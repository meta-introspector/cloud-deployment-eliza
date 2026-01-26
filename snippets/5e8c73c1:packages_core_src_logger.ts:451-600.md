# 5e8c73c1:packages_core_src_logger.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/logger.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  timestampFormatter: showTimestamps ? undefined : () => '',
  withEmoji: false,
  levels: customLevelConfig as unknown as Record<
    string,
    {
      levelName: string;
      level: number;
      style: string;
      terminalStyle: Array<
        | 'bgRed'
        | 'white'
        | 'bold'
        | 'whiteBright'
        | 'bgYellow'
        | 'black'
        | 'cyan'
        | 'red'
        | 'underline'
        | 'green'
        | 'gray'
        | 'dim'
        | 'italic'
        | 'yellow'
        | 'blue'
        | 'magenta'
        | 'blackBright'
        | 'strikethrough'
      >;
      method:
        | 'error'
        | 'debug'
        | 'log'
        | 'info'
        | 'warn'
        | 'clear'
        | 'dir'
        | 'dirxml'
        | 'group'
        | 'groupCollapsed'
        | 'groupEnd'
        | 'table';
      emoji: string;
    }
  >,
});

// Mirror Adze output to in-memory storage
adzeStore.addListener('*', (log: { data?: { message?: string | unknown[]; level?: number } }) => {
  try {
    const d = log.data;
    const msg = Array.isArray(d?.message)
      ? d.message.map((m: unknown) => (typeof m === 'string' ? m : safeStringify(m))).join(' ')
      : typeof d?.message === 'string'
        ? d.message
        : '';

    const entry: LogEntry = {
      time: Date.now(),
      level: typeof d?.level === 'number' ? d.level : undefined,
      msg,
    };
    globalInMemoryDestination.write(entry);
  } catch {
    // Silent fail - don't break logging
  }
});

// ============================================================================
// Logger Factory
// ============================================================================

/**
 * Creates a sealed Adze logger instance with namespaces and metadata
 */
function sealAdze(base: Record<string, unknown>): ReturnType<typeof adze.seal> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chain: ReturnType<typeof adze.ns> | typeof adze = adze as
    | ReturnType<typeof adze.ns>
    | typeof adze;

  // Add namespaces if provided
  const namespaces: string[] = [];
  if (typeof base.namespace === 'string') namespaces.push(base.namespace);
  if (Array.isArray(base.namespaces)) namespaces.push(...(base.namespaces as string[]));
  if (namespaces.length > 0) {
    chain = chain.ns(...namespaces);
  }

  // Add metadata (excluding namespace properties)
  const metaBase: Record<string, unknown> = { ...base };
  delete metaBase.namespace;
  delete metaBase.namespaces;

  // Add server context metadata (always, for observability)
  // Only add defaults if user hasn't provided them
  if (!metaBase.name) {
    metaBase.name = 'elizaos';
  }

  // Add pid for process identification
  if (!metaBase.pid && typeof process !== 'undefined' && process.pid) {
    metaBase.pid = process.pid;
  }

  // Add environment (production, development, test)
  if (!metaBase.environment && typeof process !== 'undefined' && process.env) {
    metaBase.environment = process.env.NODE_ENV || 'development';
  }

  // Add serverId for instance identification
  if (!metaBase.serverId) {
    metaBase.serverId = serverId;
  }

  // Add hostname (for JSON format or when explicitly needed)
  if (raw && !metaBase.hostname) {
    // Get hostname in a way that works in both Node and browser
    let hostname = 'unknown';
    if (typeof process !== 'undefined' && process.platform) {
      // Node.js environment
      const os = require('os');
      hostname = os.hostname();
    } else if (typeof window !== 'undefined' && window.location) {
      // Browser environment
      hostname = window.location.hostname || 'browser';
    }
    metaBase.hostname = hostname;
  }

  // This ensures the sealed logger inherits the correct log level and styling
  const globalConfig = {
    activeLevel: getAdzeActiveLevel(),
    format: raw ? 'json' : 'pretty',
    timestampFormatter: showTimestamps ? undefined : () => '',
    withEmoji: false,
    levels: customLevelConfig as Record<
      string,
      {
        levelName: string;
        level: number;
        style: string;
        terminalStyle: string[];
        method: keyof Console;
        emoji: string;
      }
    >, // Use same reusable config
  };

  return chain
    .meta(metaBase)
```