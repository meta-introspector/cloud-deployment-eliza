import { buildProject } from '@/src/utils/build-project';
import { type IAgentRuntime, logger } from '@elizaos/core';

import { Command } from 'commander';

//import { MyRequest, MyResponse } from '../server/api/abstract';

import { loadCharacterTryPath } from '../server/loader';
//import { handleError } from '../utils/handle-error';

import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// Placeholder interfaces for external dependencies (to be replaced with actual definitions)
interface LogReader {
  processLogLine(line: string): Promise<void>;
  processLogChunk(chunk: string): Promise<void>;
}

interface Profile {
  addLibrary(name: string, start: bigint | number, end: bigint | number): any;
  addCode(
    type: string,
    name: string,
    timestamp: number,
    start: bigint | number,
    size: bigint | number
  ): void;
  addFuncCode(
    type: string,
    name: string,
    timestamp: number,
    start: bigint | number,
    size: bigint | number,
    sfiAddr: bigint | number,
    state: any
  ): void;
  moveCode(from: bigint | number, to: bigint | number): void;
  recordTick(nsSinceStart: number, vmState: number, stack: (bigint | number)[]): void;
  getFlatProfile(): any;
  getBottomUpProfile(): any;
  serializeVMSymbols(): any;
  writeJson(): void;
}

interface JsonProfile extends Profile {}

interface ViewBuilder {
  buildView(profile: any): any;
}

// Main V8Profile class
class V8Profile implements Profile {
  private ticks: { nsSinceStart: number; vmState: number; stack: (bigint | number)[] }[] = [];
  private groupedData: { [key: string]: any } = {}; // Recursive grouping storage

  private static IC_RE =
    /^(LoadGlobalIC: )|(Handler: )|(?:CallIC|LoadIC|StoreIC)|(?:Builtin: (?:Keyed)?(?:Load|Store)IC_)/;
  private static BYTECODES_RE = /^(BytecodeHandler: )/;
  private static SPARKPLUG_HANDLERS_RE = /^(Builtin: .*Baseline.*)/;
  private static BUILTINS_RE = /^(Builtin: )/;
  private static STUBS_RE = /^(Stub: )/;

  private skipThisFunction?: (name: string) => boolean;

  constructor(
    separateIc: boolean,
    separateBytecodes: boolean,
    separateBuiltins: boolean,
    separateStubs: boolean,
    separateSparkplugHandlers: boolean,
    useBigIntAddresses: boolean = false
  ) {
    const regexps: RegExp[] = [];
    if (!separateIc) regexps.push(V8Profile.IC_RE);
    if (!separateBytecodes) regexps.push(V8Profile.BYTECODES_RE);
    if (!separateBuiltins) regexps.push(V8Profile.BUILTINS_RE);
    if (!separateStubs) regexps.push(V8Profile.STUBS_RE);
    if (!separateSparkplugHandlers) regexps.push(V8Profile.SPARKPLUG_HANDLERS_RE);

    if (regexps.length > 0) {
      this.skipThisFunction = (name: string): boolean => {
        return regexps.some((re) => re.test(name));
      };
    }
  }

  // Placeholder implementations for Profile interface (to be filled with actual logic)
  addLibrary(name: string, start: bigint | number, end: bigint | number): any {
    return null;
  }
  addCode(
    type: string,
    name: string,
    timestamp: number,
    start: bigint | number,
    size: bigint | number
  ): void {}
  addFuncCode(
    type: string,
    name: string,
    timestamp: number,
    start: bigint | number,
    size: bigint | number,
    sfiAddr: bigint | number,
    state: any
  ): void {}
  moveCode(from: bigint | number, to: bigint | number): void {}
  recordTick(nsSinceStart: number, vmState: number, stack: (bigint | number)[]): void {
    this.ticks.push({ nsSinceStart, vmState, stack });
  }
  //getFlatProfile(): any {
  //  return null;
  //}
  getBottomUpProfile(): any {
    return null;
  }
  serializeVMSymbols(): any {
    return null;
  }
  writeJson(): void {}

  // Example of adding a method with proper typing
  handleUnknownCode(operation: string, addr: bigint | number, opt_stackPos?: number): void {
    // Implementation would go here
  }

  recordCsvLine(fields: string[]): void {
    const groupByField = (data: string[], index: number): any => {
      if (index >= data.length) return data.join(','); // Leaf node: raw line
      const key = data[index];
      return { [key]: groupByField(data, index + 1) };
    };

    const type = fields[0];
    if (!this.groupedData[type]) this.groupedData[type] = {};
    const subGrouped = groupByField(fields.slice(1), 0);

    // Merge recursively
    const merge = (target: any, source: any) => {
      for (const key in source) {
        if (typeof source[key] === 'object' && key in target) {
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    merge(this.groupedData[type], subGrouped);
  }

  getFlatProfile(): any {
    const stateCounts: { [key: number]: number } = {};
    let totalTime = 0;
    for (const tick of this.ticks) {
      stateCounts[tick.vmState] = (stateCounts[tick.vmState] || 0) + 1;
      totalTime += tick.nsSinceStart;
    }
    return {
      totalTicks: this.ticks.length,
      totalTimeNs: totalTime,
      stateBreakdown: Object.fromEntries(
        Object.entries(stateCounts).map(([state, count]) => [VmStates[state], count])
      ),
      csvGroups: this.groupedData,
    };
  }
}

// Interface for function info
interface FuncInfo {
  name: string;
  start: bigint | number;
  end?: bigint | number;
  size?: bigint | number;
}

// Base CppEntriesProvider class
abstract class CppEntriesProvider {
  protected _isEnabled: boolean = true;
  protected parseAddr: (str: string) => bigint | number;

  public parseAddress(str: string): bigint | number {
    console.log('Parse', str);
    return this.parseAddr(str);
  }
  protected parseHexAddr: (str: string) => bigint | number;
  protected symbols: string[] = [];
  protected parsePos: number = 0;

  constructor(useBigIntAddresses: boolean = false) {
    this.parseAddr = useBigIntAddresses ? BigInt : parseInt;
    this.parseHexAddr = useBigIntAddresses
      ? (str: string) => BigInt(parseInt(str))
      : (str: string) => parseInt(str);
  }

  inRange(funcInfo: FuncInfo, start: bigint | number, end: bigint | number): boolean {
    return funcInfo.start >= start && (funcInfo.end ?? funcInfo.start) <= end;
  }

  async parseVmSymbols(
    libName: string,
    libStart: bigint | number,
    libEnd: bigint | number,
    libASLRSlide: bigint | number,
    processorFunc: (name: string, start: bigint | number, end: bigint | number) => void
  ): Promise<void> {
    if (!this._isEnabled) return;
    await this.loadSymbols(libName);

    let lastUnknownSize: FuncInfo | undefined;
    let lastAdded: FuncInfo | undefined;

    const addEntry = (funcInfo: FuncInfo): void => {
      if (lastUnknownSize && lastUnknownSize.start < funcInfo.start) {
        lastUnknownSize.end = funcInfo.start;
        if (
          (!lastAdded || !this.inRange(lastUnknownSize, lastAdded.start, lastAdded.end!)) &&
          this.inRange(lastUnknownSize, libStart, libEnd)
        ) {
          processorFunc(lastUnknownSize.name, lastUnknownSize.start, lastUnknownSize.end!);
          lastAdded = lastUnknownSize;
        }
      }
      lastUnknownSize = undefined;

      if (funcInfo.end) {
        if (
          (!lastAdded || lastAdded.start !== funcInfo.start) &&
          this.inRange(funcInfo, libStart, libEnd)
        ) {
          processorFunc(funcInfo.name, funcInfo.start, funcInfo.end);
          lastAdded = funcInfo;
        }
      } else {
        lastUnknownSize = funcInfo;
      }
    };

    while (true) {
      const funcInfo = this.parseNextLine();
      if (funcInfo === null) continue;
      if (funcInfo === false) break;
      funcInfo.start =
        funcInfo.start < libStart &&
        funcInfo.start <
          (typeof libEnd === 'bigint' && typeof libStart === 'bigint'
            ? libEnd - libStart
            : Number(libEnd) - Number(libStart))
          ? typeof funcInfo.start === 'bigint' && typeof libStart === 'bigint'
            ? funcInfo.start + libStart
            : Number(funcInfo.start) + Number(libStart)
          : typeof funcInfo.start === 'bigint' && typeof libASLRSlide === 'bigint'
            ? funcInfo.start + libASLRSlide
            : Number(funcInfo.start) + Number(libASLRSlide);
      if (funcInfo.size) {
        funcInfo.end =
          typeof funcInfo.start === 'bigint' && typeof funcInfo.size === 'bigint'
            ? funcInfo.start + funcInfo.size
            : Number(funcInfo.start) + Number(funcInfo.size);
      }
      addEntry(funcInfo);
    }
    addEntry({ name: '', start: libEnd });
  }

  protected abstract loadSymbols(libName: string): Promise<void>;
  abstract parseNextLine(): FuncInfo | null | false;
}

// LinuxCppEntriesProvider
export class LinuxCppEntriesProvider extends CppEntriesProvider {
  private nmExec: string;
  private objdumpExec: string;
  private readelfExec: string;
  private targetRootFS: string;
  private apkEmbeddedLibrary: string;
  private fileOffsetMinusVma: bigint | number;
  private FUNC_RE: RegExp = /^([0-9a-fA-F]{8,16}) ([0-9a-fA-F]{8,16} )?[tTwW] (.*)$/;

  constructor(
    nmExec: string,
    objdumpExec: string,
    readelfExec: string,
    targetRootFS: string,
    apkEmbeddedLibrary: string,
    useBigIntAddresses: boolean = false
  ) {
    super(useBigIntAddresses);
    this.nmExec = nmExec;
    this.objdumpExec = objdumpExec;
    this.readelfExec = readelfExec;
    this.targetRootFS = targetRootFS;
    this.apkEmbeddedLibrary = apkEmbeddedLibrary;
    this.fileOffsetMinusVma = useBigIntAddresses ? 0n : 0;
  }

  protected async loadSymbols(libName: string): Promise<void> {
    this.parsePos = 0;
    let adjustedLibName = libName;
    if (this.apkEmbeddedLibrary && libName.endsWith('.apk')) {
      adjustedLibName = this.apkEmbeddedLibrary;
    }
    if (this.targetRootFS) {
      adjustedLibName =
        this.targetRootFS + adjustedLibName.substring(adjustedLibName.lastIndexOf('/') + 1);
    }

    const osSystem = async (cmd: string, args: string[]): Promise<string> => '';
    try {
      this.symbols = [
        await osSystem(this.nmExec, ['-C', '-n', '-S', adjustedLibName]),
        await osSystem(this.nmExec, ['-C', '-n', '-S', '-D', adjustedLibName]),
      ];
      // Additional logic for debug symbols and objdump output would go here
    } catch (e) {
      this.symbols = ['', ''];
    }
  }

  parseNextLine(): FuncInfo | null | false {
    if (this.symbols.length === 0) return false;
    const lineEndPos = this.symbols[0].indexOf('\n', this.parsePos);
    if (lineEndPos === -1) {
      this.symbols.shift();
      this.parsePos = 0;
      return this.parseNextLine();
    }

    const line = this.symbols[0].substring(this.parsePos, lineEndPos);
    this.parsePos = lineEndPos + 1;
    const fields = line.match(this.FUNC_RE);
    if (!fields) return null;

    const funcInfo: FuncInfo = {
      name: fields[3],
      start:
        typeof this.fileOffsetMinusVma === 'bigint' &&
        typeof this.parseHexAddr(fields[1]) === 'bigint'
          ? typeof this.fileOffsetMinusVma === 'bigint' &&
            typeof this.parseHexAddr(fields[1]) === 'bigint'
            ? typeof this.fileOffsetMinusVma === 'bigint'
              ? BigInt(this.parseHexAddr(fields[1])) + this.fileOffsetMinusVma
              : Number(this.parseHexAddr(fields[1])) + Number(this.fileOffsetMinusVma)
            : Number(this.parseHexAddr(fields[1])) + Number(this.fileOffsetMinusVma)
          : Number(this.parseHexAddr(fields[1])) + Number(this.fileOffsetMinusVma),
    };
    if (fields[2]) funcInfo.size = this.parseHexAddr(fields[2]);
    return funcInfo;
  }
}

// ArgumentsProcessor (partial)
interface ArgsResult {
  logFileName: string;
  platform: 'linux' | 'windows' | 'macos';
  stateFilter: number | null;
  separateIc: boolean;
  // Add other properties as needed
}

export class ArgumentsProcessor {
  getDefaultResults(): ArgsResult {
    return {
      logFileName: 'v8.log',
      platform: 'linux',
      stateFilter: null,
      separateIc: true,
      // Add other defaults
    };
  }
}

// TickProcessor (partial)
export enum VmStates {
  JS = 0,
  GC = 1,
  PARSER = 2,
  BYTECODE_COMPILER = 3,
  COMPILER = 4,
  OTHER = 5,
  EXTERNAL = 6,
  IDLE = 7,
}

export class TickProcessor implements LogReader {
  private cppEntriesProvider: CppEntriesProvider;
  private profile: Profile;
  private ticks: { total: number; unaccounted: number; excluded: number; gc: number };

  constructor(
    cppEntriesProvider: CppEntriesProvider,
    separateIc: boolean,
    separateBytecodes: boolean,
    separateBuiltins: boolean,
    separateStubs: boolean,
    separateSparkplugHandlers: boolean,
    callGraphSize: number,
    ignoreUnknown: boolean,
    stateFilter: number | null,
    distortion: number,
    range: string,
    sourceMap: string | null,
    timedRange: boolean,
    pairwiseTimedRange: boolean,
    onlySummary: boolean,
    runtimeTimerFilter: string | null,
    preprocessJson: boolean,
    useBigIntAddresses: boolean
  ) {
    // Remove the super call as TickProcessor does not extend any class
    this.cppEntriesProvider = cppEntriesProvider;
    this.profile = preprocessJson
      ? new V8Profile(
          separateIc,
          separateBytecodes,
          separateBuiltins,
          separateStubs,
          separateSparkplugHandlers,
          useBigIntAddresses
        )
      : new V8Profile(
          separateIc,
          separateBytecodes,
          separateBuiltins,
          separateStubs,
          separateSparkplugHandlers,
          useBigIntAddresses
        );
    this.ticks = { total: 0, unaccounted: 0, excluded: 0, gc: 0 };
  }
  async processLogLine(line: string): Promise<void> {
    if (!line.trim()) return;

    // Process each line of the log
    const fields = line.split(/\s+/);
    let stack2 = fields.slice(2).map((addr) => this.cppEntriesProvider.parseAddress(addr));

    const timestamp = parseInt(fields[0]);
    const vmState = parseInt(fields[1]);
    let stack = fields.slice(2).map((addr) => this.cppEntriesProvider.parseAddress(addr));

    // Record the tick in the profile
    this.profile.recordTick(timestamp, vmState, stack2);

    // Update tick counts
    this.ticks.total++;
    if (vmState === VmStates.GC) {
      this.ticks.gc++;
    }
  }

  async processLogChunk(chunk: string): Promise<void> {
    const lines = chunk.split('\n');
    for (const line of lines) {
      await this.processLogLine(line);
    }
  }

  async processLogFile(fileName: string): Promise<void> {
    // Implementation would go here
    // For example, read ttry {
    const fileStream = createReadStream(fileName, { encoding: 'utf8' });
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Handle all line endings
    });

    for await (const line of rl) {
      await this.processLogLine(line);
    }

    console.log(
      `Processed ${fileName}: Total Ticks: ${this.ticks.total}, GC Ticks: ${this.ticks.gc}`
    );
  }
}

const profileAgents = async (options: { profile?: string }) => {
  let profile_file = options.profile;
  console.log('profile agents', profile_file);

  let data = await decode(profile_file);
  console.log(data);
  // Load environment variables from project .env or .eliza/.env
  //await loadEnvironment();
  const processor = new TickProcessor(
    new LinuxCppEntriesProvider('nm', 'objdump', 'readelf', '', '', false), // Mocked tools
    true,
    true,
    true,
    true,
    true, // Separate all categories
    5,
    false,
    null,
    0,
    '',
    null,
    false,
    false,
    false,
    null,
    false,
    false // Defaults
  );

  await processor.processLogFile(profile_file);
  const profileData = processor['profile'].getFlatProfile(); // Access private for demo
  console.log('Profile Data:', profileData);
};

export const prof = new Command()
  .name('prof')
  .description('Process profile')
  .option('-p, --profile <trainer>', 'Profile to use')
  .action(async (options) => {
    console.log('Profile!');
    //displayBanner();

    //try {
    // Build the project first unless skip-build is specified
    if (options.build) {
      await buildProject(process.cwd());
    }

    // Collect server options
    const characterPath = options.character;

    if (characterPath) {
      options.characters = [];
      try {
        // if character path is a comma separated list, load all characters
        // can be remote path also
        if (characterPath.includes(',')) {
          const characterPaths = characterPath.split(',');
          for (const characterPath of characterPaths) {
            logger.info(`Loading character from ${characterPath}`);
            const characterData = await loadCharacterTryPath(characterPath);
            options.characters.push(characterData);
          }
        }
        await profileAgents(options);
      } catch (error) {
        logger.error(`Failed to load character: ${error}`);
        process.exit(1);
      }
    } else {
      await profileAgents(options);
    }
    // } catch (error) {
    //   handleError(error);
    // }
  });

// This is the function that registers the command with the CLI
export default function registerCommand(cli: Command) {
  console.log('registerCommand');
  return cli.addCommand(prof);
}

// Mocked V8 utilities (simplified from v8log modules)
const parseString = (s: string) => s;
const parseInt = (s: string) => Number.parseInt(s, 10);
const parseAddress = (s: string) => Number.parseInt(s, 16); // No BigInt for now
const argParsers = (...parsers: ((s: string) => any)[]) => parsers;
const offsetOrEnd = (delimiter: string, text: string) => text.indexOf(delimiter);
const readAllArgs = (parsers: ((s: string) => any)[], text: string, start: number) => {
  const fields = text.slice(start).split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  return parsers.map((parser, i) => (i < fields.length ? parser(fields[i]) : undefined));
};
const readAllArgsRaw = (text: string, start: number) => text.slice(start).split(',');

// Parsers tailored to your log
const parsers = {
  profiler: argParsers(parseString, parseInt),
  new: argParsers(parseString, parseAddress, parseInt),
  'shared-library': argParsers(parseString, parseAddress, parseAddress, parseAddress),
  tick: argParsers(parseAddress, parseInt, parseInt, parseAddress, parseInt), // 5 fields
} as const;

export async function decode(filePath: string) {
  const meta: { [key: string]: any } = {};
  const codes: any[] = [];
  const ticks: any[] = [];
  const memory: any[] = [];
  const profiler: any[] = [];
  const ignoredOps = new Set<string>();
  const ignoredEntries: any[] = [];

  const processLine = (buffer: string, sol: number, eol: number) => {
    if (sol >= eol) return;

    const line = buffer.slice(sol, eol);
    const opEnd = offsetOrEnd(',', line);
    const argsStart = opEnd + 1;
    const op = buffer.slice(sol, sol + opEnd);

    switch (op) {
      case 'v8-version': {
        const args = readAllArgsRaw(line, argsStart);
        meta.version = {
          major: args[0],
          minor: args[1],
          build: args[2],
          patch: args[3],
          extra: args[4],
          unknown: args[5],
        };
        break;
      }

      case 'v8-platform': {
        const [platform, extra] = readAllArgsRaw(line, argsStart);
        meta.platform = { platform, extra };
        break;
      }

      case 'profiler': {
        const [action, sampleInterval] = readAllArgs(parsers[op], line, argsStart);
        profiler.push({ action, sampleInterval });
        break;
      }

      case 'shared-library': {
        const [name, address, addressEnd, aslrSlide] = readAllArgs(parsers[op], line, argsStart);
        codes.push({ op, address, size: addressEnd - address, name, aslrSlide });
        break;
      }

      case 'shared-library-end': {
        codes.push({ op });
        break;
      }

      case 'new': {
        const [type, address, size] = readAllArgs(parsers[op], line, argsStart);
        memory.push({ op, type, address, size });
        break;
      }

      case 'tick': {
        const [pc, timestamp, vmState, tosOrExternalCallback, extra] = readAllArgs(
          parsers[op],
          line,
          argsStart
        );
        ticks.push({ timestamp, vmState, pc, tosOrExternalCallback, extra });
        break;
      }

      default:
        ignoredOps.add(op);
        ignoredEntries.push({ op, line });
    }
  };

  const fileStream = createReadStream(filePath, { encoding: 'utf8' });
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  let tail = '';
  let lineStartOffset = 0;

  const t = Date.now();
  for await (const chunk of rl) {
    const chunkText = tail + chunk;
    let eol = -1;
    lineStartOffset = 0;

    do {
      eol = chunkText.indexOf('\n', lineStartOffset);
      if (eol === -1) break;
      if (eol === lineStartOffset) {
        lineStartOffset = eol + 1;
        continue;
      }
      processLine(chunkText, lineStartOffset, eol);
      lineStartOffset = eol + 1;
    } while (true);

    tail = chunkText.slice(lineStartOffset);
  }

  // Process last line
  processLine(tail, 0, tail.length);

  const result = {
    meta,
    codes,
    ticks,
    memory,
    profiler,
    ignoredOps: [...ignoredOps],
    ignoredEntries,
  };

  logger.info(`Parsed ${filePath} in ${Date.now() - t}ms`);
  logger.debug(`Result: ${JSON.stringify(result, null, 2)}`);

  return result;
}
