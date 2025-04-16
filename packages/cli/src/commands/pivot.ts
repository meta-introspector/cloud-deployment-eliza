import { generateMemoryPivotTable } from '../server/api/pivot';
import { writeFileSync } from 'fs';
import { buildProject } from '@/src/utils/build-project';
import {
  AgentRuntime,
  type Character,
  type IAgentRuntime,
  type Plugin,
  logger,
  stringToUuid,
  ChannelType,
  encryptedCharacter,
  Memory,
  State,
  createUniqueUuid,
  validateUuid,
} from '@elizaos/core';

import { Command } from 'commander';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { character, character as defaultCharacter } from '../characters/eliza';
import { AgentServer } from '../server/index';

import { conversation } from '../server/api/abstract';

import { jsonToCharacter, loadCharacterTryPath } from '../server/loader';
import { loadConfig, saveConfig } from '../utils/config-manager.js';
import { promptForEnvVars } from '../utils/env-prompt.js';
import { configureDatabaseSettings, loadEnvironment } from '../utils/get-config';
//import { handleError } from '../utils/handle-error';
import { installPlugin } from '../utils/install-plugin';
import { displayBanner } from '../displayBanner';
import { worldRouter } from '../server/api/world';
import { UUID } from 'node:crypto';
import { todo } from 'node:test';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom UUID generator using SHA-256
function generateContentUUID(content: string): string {
  // For browser compatibility, you might want to use a different crypto library
  // This example uses Node.js crypto
  const crypto = require('crypto');

  // Create SHA-256 hash of the content
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  // Create UUID v5 using the hash
  // Using a fixed namespace UUID (UUID for URLs)
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  return uuidV5(hash, namespace);
}

// UUID v5 implementation (you'd typically use a library like 'uuid')
// Here's a simple version for demonstration
function uuidV5(name: string, namespace: string): string {
  const { v5 } = require('uuid');
  return v5(name, namespace);
}

// Iterator class
class ContentUUIDIterator implements Iterator<string> {
  private messages: Memory[];
  private index: number = 0;
  private seenUUIDs: Set<string> = new Set();

  constructor(messages: Memory[]) {
    this.messages = messages;
  }

  next(): IteratorResult<string> {
    while (this.index < this.messages.length) {
      const message = this.messages[this.index];
      this.index++;

      const content = message.content?.text || '';
      if (!content) {
        continue;
      }

      const uuid = generateContentUUID(content);

      if (!this.seenUUIDs.has(uuid)) {
        this.seenUUIDs.add(uuid);
        //console.log('UUID', uuid, 'Content', content);
        console.log('Content', content);
        return {
          value: uuid,
          done: false,
        };
      }
    }

    return {
      value: undefined,
      done: true,
    };
  }

  // Make it iterable
  [Symbol.iterator](): Iterator<string> {
    return this;
  }
}
function createContentUUIDIterator(messages: Memory[]): ContentUUIDIterator {
  return new ContentUUIDIterator(messages);
}

//export const wait = (minTime = 1000, maxTime = 3000) => {
//  const waitTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
//return new Promise((resolve) => setTimeout(resolve, waitTime));
//};

/**
   Prompt for environment variables for all plugins in the project
 * Analyzes project agents and their plugins to determine which environment variables to prompt for
 */
export async function promptForProjectPlugins(
  project: any,
  pluginToLoad?: { name: string }
): Promise<void> {
  // Set to track unique plugin names to avoid duplicate prompts
  const pluginsToPrompt = new Set<string>();

  // If we have a specific plugin to load, add it
  if (pluginToLoad?.name) {
    pluginsToPrompt.add(pluginToLoad.name.toLowerCase());
  }

  // If we have a project, scan all its agents for plugins
  if (project) {
    // Handle both formats: project with agents array and project with single agent
    const agents = Array.isArray(project.agents)
      ? project.agents
      : project.agent
        ? [project.agent]
        : [];

    // Check each agent's plugins
    for (const agent of agents) {
      if (agent.plugins?.length) {
        for (const plugin of agent.plugins) {
          const pluginName = typeof plugin === 'string' ? plugin : plugin.name;

          logger.debug('Checking if plugin is installed: ', pluginName);

          if (pluginName) {
            // Extract just the plugin name from the package name if needed
            const simpleName = pluginName.split('/').pop()?.replace('plugin-', '') || pluginName;
            pluginsToPrompt.add(simpleName.toLowerCase());
          }
        }
      }
    }
  }

  // Prompt for each identified plugin
  for (const pluginName of pluginsToPrompt) {
    logger.info(`Prompting for ${pluginName} environment variables...`);
    try {
      await promptForEnvVars(pluginName);
    } catch (error) {
      logger.warn(`Failed to prompt for ${pluginName} environment variables: ${error}`);
    }
  }
}
function exportToCSV(fileName: string, data: any[], headers: string[]) {
  console.log('exportToCSV debug', fileName, data, headers);
  const csvContent = [
    headers.join(','), // Header row
    ...data.map((entry) => headers.map((header) => entry[header] || '').join(',')), // Data rows
  ].join('\n');
  console.log('exportToCSV debug2', fileName, csvContent);
  writeFileSync(fileName, csvContent);
}
export async function generateReports(
  pivotTable,
  runtime: IAgentRuntime,
  roomId: UUID,
  cutoff: number,
  limit: number = 100
) {
  // Extract subsets for reports
  const actionsReport = pivotTable.map((entry) => ({
    Action: entry.action,
    Thought: entry.thought,
    Count: entry.count,
  }));

  const providersReport = pivotTable.map((entry) => ({
    Provider: entry.provider,
    Thought: entry.thought,
    Count: entry.count,
  }));

  const thoughtsReport = pivotTable.map((entry) => ({
    Thought: entry.thought,
    MetaThought: entry.metaThought,
    Count: entry.count,
  }));

  // Export to CSV files
  const uuidname = roomId.toString();
  exportToCSV(`actions_report${uuidname}.csv`, actionsReport, ['Action', 'Thought', 'Count']);
  exportToCSV(`providers_report${uuidname}.csv`, providersReport, ['Provider', 'Thought', 'Count']);
  exportToCSV(`thoughts_report${uuidname}.csv`, thoughtsReport, [
    'Thought',
    'MetaThought',
    'Count',
  ]);

  console.log('Reports generated successfully!');
}

async function reportRoom(runtime: IAgentRuntime, room: any) {
  const memories = await runtime.getMemories({
    tableName: 'messages',
    roomId: room.id,
  });

  const pivotTable = await generateMemoryPivotTable(runtime, room.id, 1000);
  console.log('Pivot Table Length:', pivotTable.length);

  return { roomId: room.id, pivotTable };
}

async function reportWorld(runtime: IAgentRuntime, world: any) {
  const rooms = await runtime.getRooms(world.id);
  const roomReports = await Promise.all(rooms.map((room) => reportRoom(runtime, room)));
  console.log('roomReports2', world.id, roomReports);
  return { worldId: world.id, roomReports };
}

//async function generateReportsForWorlds(runtime: IAgentRuntime, worlds: any[]) {
// console.log('Generating Reports for Worlds:', worlds);

//for (const worldReport of worldReports) {
//    console.log('World Report:', worldReport);
// }

//return generateReportsForWorlds(runtime, worldReports);
//generateReports(worldReports, runtime, worlds[0].id, 1000);
//}

// pivotTable,
// runtime: IAgentRuntime,
// roomId: UUID,
// cutoff: number,
// limit: number = 100
// Interface for the pivot table entry in the World Report
interface PivotTableEntry {
  action: string;
  provider: string;
  thought: string;
  metaThought: string;
  entityIds: string[];
  count: number;
  memoryIds: string[];
  earliestCreatedAt: number | 'Infinity';
  frequencyOverTime: Record<string, any>;
  uniqueProvidersCount: number;
  matrixEmbedding: any[];
}

// Interface for a room report
interface RoomReport {
  roomId: string;
  pivotTable: PivotTableEntry[];
}

// Interface for the World Report
interface WorldReport {
  worldId: string;
  roomReports: RoomReport[];
}

// Interface for the flattened pivot table entry (from previous response)
interface FlattenedPivotTableEntry {
  worldId: string;
  roomId: string;
  action: string;
  provider: string;
  thought: string;
  metaThought: string;
  entityIds: string; // Joined array of entity IDs
  count: number;
  memoryIds: string; // Joined array of memory IDs
  earliestCreatedAt: number | 'Infinity';
  frequencyOverTime: string; // JSON-serialized
  uniqueProvidersCount: number;
  matrixEmbedding: string; // JSON-serialized
}
function flattenWorldReport(worldReport: WorldReport): FlattenedPivotTableEntry[] {
  console.log('flattenWorldReport', worldReport);
  const flattened: FlattenedPivotTableEntry[] = [];

  // Iterate through each room report
  for (const world of worldReport) {
    for (const roomReport of world.roomReports) {
      // Iterate through each pivot table entry in the room
      for (const pivotEntry of roomReport.pivotTable) {
        const flattenedEntry: FlattenedPivotTableEntry = {
          worldId: worldReport.worldId,
          roomId: roomReport.roomId,
          action: pivotEntry.action,
          provider: pivotEntry.provider,
          thought: pivotEntry.thought,
          metaThought: pivotEntry.metaThought,
          entityIds: pivotEntry.entityIds.join(','), // Join array into string
          count: pivotEntry.count,
          memoryIds: pivotEntry.memoryIds.join(','), // Join array into string
          earliestCreatedAt: pivotEntry.earliestCreatedAt,
          frequencyOverTime: JSON.stringify(pivotEntry.frequencyOverTime), // Serialize object
          uniqueProvidersCount: pivotEntry.uniqueProvidersCount,
          matrixEmbedding: JSON.stringify(pivotEntry.matrixEmbedding), // Serialize array
        };
        flattened.push(flattenedEntry);
      }
    }
  }

  return flattened;
}
/**
 * pivots an agent with the given character, agent server, initialization function, plugins, and options.
 *
 * @param character The character object representing the agent.
 * @param server The agent server where the agent will be registered.
 * @param init Optional initialization function to be called with the agent runtime.
 * @param plugins An array of plugins to be used by the agent.
 * @param options Additional options for pivoting the agent, such as data directory and postgres URL.
 * @returns A promise that resolves to the agent runtime object.
 */
export async function pivotAgent(
  character: Character,

  server: AgentServer,
  //plugins: Plugin[] = [],

  options: {
    prompt?: string;
    dataDir?: string;
    postgresUrl?: string;
    isPluginTestMode?: boolean;
    roomId?: UUID;
    worldId?: UUID;
    //userId?: string;
    //messageId?: UUID;
    //createdAt?: string;
    //const messageId = createUniqueUuid(runtime, Date.now().toString());
  } = {}
): Promise<IAgentRuntime> {
  //console.log('D112 pivotAgent', character, server, options);
  character.id ??= stringToUuid(character.name);

  const encryptedChar = encryptedCharacter(character);

  // For ESM modules we need to use import.meta.url instead of __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  console.log('Filename', __filename);

  // Find package.json relative to the current file
  const packageJsonPath = path.resolve(__dirname, '../package.json');

  // Add a simple check in case the path is incorrect
  let version = '0.0.0'; // Fallback version
  if (!fs.existsSync(packageJsonPath)) {
  } else {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    version = packageJson.version;
  }

  const characterPlugins: Plugin[] = [];

  console.log('encryptedChar', encryptedChar);
  // for each plugin, check if it installed, and install if it is not
  for (const plugin of encryptedChar.plugins) {
    logger.debug('Checking if plugin is installed: ', plugin);
    let pluginModule: any;

    // Try to load the plugin
    try {
      // For local plugins, use regular import
      pluginModule = await import(plugin);

      logger.debug(`Successfully loaded plugin ${plugin}`);
    } catch (error) {
      logger.info(`Plugin ${plugin} not installed, installing into ${process.cwd()}...`);
      await installPlugin(plugin, process.cwd(), version);

      try {
        // For local plugins, use regular import
        pluginModule = await import(plugin);
        logger.debug(`Successfully loaded plugin ${plugin} after installation`);
      } catch (importError) {
        // Try to import from the project's node_modules directory
        try {
          const projectNodeModulesPath = path.join(process.cwd(), 'node_modules', plugin);
          logger.debug(`Attempting to import from project path: ${projectNodeModulesPath} `);

          // Read the package.json to find the entry point
          const packageJsonPath = path.join(projectNodeModulesPath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const entryPoint = packageJson.module || packageJson.main || 'dist/index.js';
            const fullEntryPath = path.join(projectNodeModulesPath, entryPoint);

            logger.debug(`Found entry point in package.json: ${entryPoint} `);
            logger.debug(`Importing from: ${fullEntryPath} `);

            pluginModule = await import(fullEntryPath);
            logger.debug(`Successfully loaded plugin from project node_modules: ${plugin} `);
          } else {
            // Fallback to a common pattern if package.json doesn't exist
            const commonEntryPath = path.join(projectNodeModulesPath, 'dist/index.js');
            logger.debug(`No package.json found, trying common entry point: ${commonEntryPath} `);
            pluginModule = await import(commonEntryPath);
            logger.debug(`Successfully loaded plugin from common entry point: ${plugin} `);
          }
        } catch (projectImportError) {
          logger.error(`Failed to install plugin ${plugin}: ${importError} `);
          logger.error(
            `Also failed to import from project node_modules: ${projectImportError.message} `
          );
        }
      }
    }

    // Process the plugin to get the actual plugin object
    const functionName = `${plugin
      .replace('@elizaos/plugin-', '')
      .replace('@elizaos-plugins/', '')
      .replace(/-./g, (x) => x[1].toUpperCase())} Plugin`; // Assumes plugin function is camelCased with Plugin suffix

    // Add detailed logging to debug plugin loading
    logger.debug(`Looking for plugin export: ${functionName} `);
    logger.debug(`Available exports: ${Object.keys(pluginModule).join(', ')} `);
    logger.debug(`Has default export: ${!!pluginModule.default} `);

    // Check if the plugin is available as a default export or named export
    const importedPlugin = pluginModule.default || pluginModule[functionName];

    if (importedPlugin) {
      logger.debug(`Found plugin import : ${importedPlugin.name} `);
      characterPlugins.push(importedPlugin);
    } else {
      // Try more aggressively to find a suitable plugin export
      let foundPlugin = null;

      // Look for any object with a name and init function
      for (const key of Object.keys(pluginModule)) {
        const potentialPlugin = pluginModule[key];
        if (
          potentialPlugin &&
          typeof potentialPlugin === 'object' &&
          potentialPlugin.name &&
          typeof potentialPlugin.init === 'function'
        ) {
          logger.debug(`Found alternative plugin export under key: ${key} `);
          foundPlugin = potentialPlugin;
          break;
        }
      }

      if (foundPlugin) {
        logger.debug(`Using alternative plugin: ${foundPlugin.name} `);
        characterPlugins.push(foundPlugin);
      } else {
        logger.warn(
          `Could not find plugin export in ${plugin}. Available exports: ${Object.keys(pluginModule).join(', ')} `
        );
      }
    }
  }

  const myplugins = [
    //...plugins,
    ...characterPlugins,
  ];

  logger.debug('myplugins', myplugins.length); // redacted leaking keys printing plugins

  const runtime = new AgentRuntime({
    character: encryptedChar,
    plugins: myplugins,
  });

  // pivot services/plugins/process knowledge
  await runtime.initialize();

  //logger.debug("server", server);
  // report to console
  logger.debug(`pivoted ${runtime.character.name} as ${runtime.agentId} `);

  //const roomId = options.roomId || createUniqueUuid(runtime, 'default-room-pivoting');
  //const worldId = options.worldId || createUniqueUuid(runtime, 'default-world-training');
  const entityId = createUniqueUuid(runtime, 'Anon');
  const userName = 'User';

  logger.info('Generating Report');
  // Ensure world exists first
  //console.log('Ensuring world exists', worldId);

  // const world = {
  //   id: worldId,
  //   name: `${ runtime.character.name } 's Feed`,
  //   agentId: runtime.agentId,
  //   serverId: entityId,
  //   metadata: {
  //     ownership: { ownerId: entityId },
  //   },
  // };
  // await runtime.ensureWorldExists(world);
  // await runtime.updateWorld(world);

  // Ensure timeline room exists
  //console.log('Ensuring timeline room exists', roomId);
  // await runtime.ensureRoomExists({
  //   id: roomId,
  //   name: `${runtime.character.name}'s Feed`,
  //   source: 'twitter',
  //   type: ChannelType.FEED,
  //   channelId: `${options.userId || 'User'}-home`,
  //   serverId: options.userId || 'User',
  //   worldId: worldId,
  // });
  //const worldId = WorldManager.getWorldId();
  //console.log('WORLDID', worldId);

  const worlds = await runtime.getAllWorlds();

  //  const worlds = await runtime.getWorld(worldId);
  //console.log('ALL WORLDS', worlds);

  const worldReports = await Promise.all(worlds.map((world) => reportWorld(runtime, world)));

  //let total_rooms = await generateReportsForWorlds(runtime, worlds);

  // let total_rooms = []
  // console.log('ROOM2', rooms2);
  // for (const room of rooms2) {
  //   console.log('ROOM', room);
  //   //for (const dv of room) {
  //   //  console.log('DV', dv);
  //   //  total_rooms.push(dv);
  //   //}
  // }

  let flat = flattenWorldReport(worldReports);
  console.log('flat', flat);
  generateReports(flat, runtime, '0-0-0-0-0', 100);

  return runtime;
}

/**
 * Stops the agent by closing the database adapter and unregistering the agent from the server.
 *
 * @param {IAgentRuntime} runtime - The runtime of the agent.
 * @param {AgentServer} server - The server that the agent is registered with.
 * @returns {Promise<void>} - A promise that resolves once the agent is stopped.
 */
async function stopAgent(runtime: IAgentRuntime, server: AgentServer) {
  await runtime.close();
  server.unregisterAgent(runtime.agentId);
}

/**
 * Function that pivots the agents.
 *
 * @param {Object} options - Command options
 * @returns {Promise<void>} A promise that resolves when the agents are successfully pivoted.
 */
const pivotAgents = async (options: {
  //configure?: boolean;
  pivoter?: Character;
  program?: string[];
  prompt: string;
  prompt_file: string;
  tools: string[];
  character: Character;
}) => {
  console.log('pivot agents');
  // Load environment variables from project .env or .eliza/.env
  await loadEnvironment();

  // Configure database settings - pass reconfigure option to potentially force reconfiguration
  const postgresUrl = await configureDatabaseSettings();
  //options.configure

  // Get PGLite data directory from environment (may have been set during configuration)
  const pgliteDataDir = process.env.PGLITE_DATA_DIR;

  // Load existing configuration
  const existingConfig = loadConfig();

  // Check if we should reconfigure based on command-line option or if using default config
  //const shouldConfigure = //options.configure ||
  // existingConfig.isDefault;

  // Handle service and model selection
  // console.log('Should configure?');
  // if (shouldConfigure) {
  //   // First-time setup or reconfiguration requested
  //   if (existingConfig.isDefault) {
  //     logger.info("First time setup. Let's configure your Eliza agent.");
  //   } else {
  //     logger.info('Reconfiguration requested.');
  //   }

  // Save the configuration AFTER user has made selections
  saveConfig({
    lastUpdated: new Date().toISOString(),
  });

  // Create server instance with appropriate database settings
  const server = new AgentServer({
    dataDir: pgliteDataDir,
    postgresUrl,
  });

  // Set up server properties
  // server.pivotAgent = async (character) => {
  //  logger.info(`D112 P5 pivoting agent for character ${character.name}`);

  //    return pivotAgent(character, server, options);
  //};
  //server.stopAgent = (runtime: IAgentRuntime) => {
  //  stopAgent(runtime, server);
  //};
  server.loadCharacterTryPath = loadCharacterTryPath;
  server.jsonToCharacter = jsonToCharacter;

  // Try to find a project or plugin in the current directory
  let isProject = false;
  let isPlugin = false;
  let pluginModule: Plugin | null = null;
  let projectModule: any = null;

  const currentDir = process.cwd();
  try {
    // Check if we're in a project with a package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    logger.debug(`Checking for package.json at: ${packageJsonPath}`);

    if (fs.existsSync(packageJsonPath)) {
      // Read and parse package.json to check if it's a project or plugin
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      logger.debug(`Found package.json with name: ${packageJson.name || 'unnamed'}`);

      // Check if this is a plugin (package.json contains 'eliza' section with type='plugin')
      if (packageJson.eliza?.type && packageJson.eliza.type === 'plugin') {
        isPlugin = true;
        logger.info('Found Eliza plugin in current directory');
      }

      // Check if this is a project (package.json contains 'eliza' section with type='project')
      if (packageJson.eliza?.type && packageJson.eliza.type === 'project') {
        isProject = true;
        logger.info('Found Eliza project in current directory');
      }

      // Also check for project indicators like a Project type export
      // or if the description mentions "project">
      if (!isProject && !isPlugin) {
        if (packageJson.description?.toLowerCase().includes('project')) {
          isProject = true;
          logger.info('Found project by description in package.json');
        }
      }

      // If we found a main entry in package.json, try to load it
      const mainEntry = packageJson.main;
      if (mainEntry) {
        const mainPath = path.resolve(process.cwd(), mainEntry);

        if (fs.existsSync(mainPath)) {
          try {
            // Try to import the module
            const importedModule = await import(mainPath);

            // First check if it's a plugin
            if (
              isPlugin ||
              (importedModule.default &&
                typeof importedModule.default === 'object' &&
                importedModule.default.name &&
                typeof importedModule.default.init === 'function')
            ) {
              isPlugin = true;
              pluginModule = importedModule.default;
              logger.info(`Loaded plugin: ${pluginModule?.name || 'unnamed'}`);

              if (!pluginModule) {
                logger.warn('Plugin loaded but no default export found, looking for other exports');

                // Try to find any exported plugin object
                for (const key in importedModule) {
                  if (
                    importedModule[key] &&
                    typeof importedModule[key] === 'object' &&
                    importedModule[key].name &&
                    typeof importedModule[key].init === 'function'
                  ) {
                    pluginModule = importedModule[key];
                    logger.info(`Found plugin export under key: ${key}`);
                    break;
                  }
                }
              }
            }
            // Then check if it's a project
            else if (
              isProject ||
              (importedModule.default &&
                typeof importedModule.default === 'object' &&
                importedModule.default.agents)
            ) {
              isProject = true;
              projectModule = importedModule;
              logger.debug(
                `Loaded project with ${projectModule.default?.agents?.length || 0} agents`
              );
            }
          } catch (importError) {
            logger.error(`Error importing module: ${importError}`);
          }
        } else {
          logger.error(`Main entry point ${mainPath} does not exist`);
        }
      }
    }
  } catch (error) {
    logger.error(`Error checking for project/plugin: ${error}`);
  }

  // Log what was found
  logger.debug(`Classification results - isProject: ${isProject}, isPlugin: ${isPlugin}`);

  if (isProject) {
    if (projectModule?.default) {
      const project = projectModule.default;
      const agents = Array.isArray(project.agents)
        ? project.agents
        : project.agent
          ? [project.agent]
          : [];
      logger.debug(`Project contains ${agents.length} agent(s)`);

      // Log agent names
      if (agents.length > 0) {
        logger.debug(`Agents: ${agents.map((a) => a.character?.name || 'unnamed').join(', ')}`);
      }
    } else {
      logger.warn("Project module doesn't contain a valid default export");
    }
  } else if (isPlugin) {
    logger.debug(`Found plugin: ${pluginModule?.name || 'unnamed'}`);
  } else {
    // Change the log message to be clearer about what we're doing
    logger.debug(
      'Running in standalone mode - using default Eliza character from ../characters/eliza'
    );
  }
  //  await server.initialize();
  //server.pivot();
  //
  if (options.character) {
    logger.debug('if characters are provided, pivot the agents with the characters');
    //for (const character of options.characters) {
    logger.debug('pivot the characters', options.character);
    const character = options.character;
    // make sure character has sql plugin
    if (!character.plugins.includes('@elizaos/plugin-sql')) {
      character.plugins.push('@elizaos/plugin-sql');
    }

    // make sure character has at least one ai provider
    if (process.env.OPENAI_API_KEY) {
      character.plugins.push('@elizaos/plugin-openai');
    } else if (process.env.ANTHROPIC_API_KEY) {
      character.plugins.push('@elizaos/plugin-anthropic');
    } else {
      character.plugins.push('@elizaos/plugin-local-ai');
    }

    logger.warn('D112 p4, pivoting agent with custom character');
    await pivotAgent(character, server, options);
  } else {
    logger.debug('pivot agents based on project, plugin, or custom configuration');
    if (isProject && projectModule?.default) {
      // Load all project agents, call their init and register their plugins
      const project = projectModule.default;

      // Handle both formats: project with agents array and project with single agent
      const agents = Array.isArray(project.agents)
        ? project.agents
        : project.agent
          ? [project.agent]
          : [];

      if (agents.length > 0) {
        logger.debug(`Found ${agents.length} agents in project`);

        // Prompt for environment variables for all plugins in the project
        try {
          await promptForProjectPlugins(project);
        } catch (error) {
          logger.warn(`Failed to prompt for project environment variables: ${error}`);
        }

        const pivotedAgents = [];
        for (const agent of agents) {
          try {
            logger.debug(`D112 P3 pivoting agent: ${agent.character.name}`);
            const runtime = await pivotAgent(
              agent.character,
              server,
              agent.init
              //agent.plugins || []
            );
            pivotedAgents.push(runtime);
            // wait .5 seconds
            //await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (agentError) {
            logger.error(`Error pivoting agent ${agent.character.name}: ${agentError}`);
          }
        }

        if (pivotedAgents.length === 0) {
          logger.warn(
            'D112 p2, Failed to pivot any agents from project, falling back to custom character'
          );
          await pivotAgent(defaultCharacter, server, options);
        } else {
          logger.debug(`Successfully pivoted ${pivotedAgents.length} agents from project`);
        }
      } else {
        logger.debug(
          'D112 P1, Project found but no agents defined, falling back to custom character'
        );
        await pivotAgent(defaultCharacter, server, options);
      }
    } else if (isPlugin && pluginModule) {
      logger.debug(
        'Before pivoting with the plugin, prompt for any environment variables it needs'
      );
      if (pluginModule.name) {
        try {
          await promptForEnvVars(pluginModule.name);
        } catch (error) {
          logger.warn(`Failed to prompt for plugin environment variables: ${error}`);
        }
      }

      // Load the default character with all its default plugins, then add the test plugin
      logger.info(
        `pivoting default Eliza character with plugin: ${pluginModule.name || 'unnamed plugin'}`
      );

      // Import the default character with all its plugins
      const { character: defaultElizaCharacter } = await import('../characters/eliza');

      // Create an array of plugins, including the explicitly loaded one
      // We're using our test plugin plus all the plugins from the default character
      const pluginsToLoad = [pluginModule];

      logger.debug(
        `Using default character with plugins for pivoting: ${defaultElizaCharacter.plugins.join(', ')}`
      );
      logger.info(
        "Plugin test mode: Using default character's plugins plus the plugin being tested"
      );

      // pivot the agent with the default character and our test plugin
      // We're in plugin test mode, so we should skip auto-loading embedding models
      logger.warn('D112 p0, pivoting agent with plugin');
      await pivotAgent(defaultElizaCharacter, server, options);

      //undefined, pluginsToLoad, {
      //isPluginTestMode: true,
      //});
      logger.info('Character pivoted with plugin successfully');
    } else {
      logger.debug('When not in a project or plugin, load the default character with all plugins');
      const { character: defaultElizaCharacter } = await import('../characters/eliza');
      //  the other branches are not used.
      logger.info(
        'D112 p9 This is used Using default Eliza character with all plugins for pivoting',
        options
      );
      await pivotAgent(defaultElizaCharacter, server, options);
    }

    // Display link to the client UI
    // First try to find it in the CLI package dist/client directory
    let clientPath = path.join(__dirname, '../../client');

    // If not found, fall back to the old relative path for development
    if (!fs.existsSync(clientPath)) {
      clientPath = path.join(__dirname, '../../../..', 'client/dist');
    }
  }
};
// Create command that can be imported directly
export const pivot = new Command()
  .name('pivot')
  .description('pivot the agent memories')
  .option('--character <character>', 'Path or URL to character file to use instead of default')
  .action(async (options) => {
    console.log('pivot!');
    //    displayBanner();

    // try {
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
        logger.debug('D112 p11 pivot');
        await pivotAgents(options);
      } catch (error) {
        logger.error(`Failed to load character: ${error}`);
        process.exit(1);
      }
    } else {
      logger.debug('p10 pivot');
      await pivotAgents(options);
    }
    // } catch (error) {
    //   handleError(error);
    // }
  });

// This is the function that registers the command with the CLI
export default function registerCommand(cli: Command) {
  return cli.addCommand(pivot);
}
