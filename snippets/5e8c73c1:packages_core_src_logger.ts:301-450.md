# 5e8c73c1:packages_core_src_logger.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/logger.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
// ============================================================================

/**
 * Creates an in-memory destination for storing recent logs
 */
function createInMemoryDestination(maxLogs = 100): InMemoryDestination {
  const logs: LogEntry[] = [];

  return {
    write(entry: LogEntry): void {
      logs.push(entry);
      if (logs.length > maxLogs) {
        logs.shift();
      }
      // Notify all listeners for real-time streaming
      for (const listener of logListeners) {
        try {
          listener(entry);
        } catch {
          // Ignore errors in listeners to prevent breaking the logging flow
        }
      }
    },
    clear(): void {
      logs.length = 0;
    },
    recentLogs(): string {
      return logs
        .map((entry) => {
          const timestamp = showTimestamps ? new Date(entry.time).toISOString() : '';
          // Convert numeric level back to string using the reverse mapping
          const levelStr = LEVEL_TO_NAME[entry.level ?? 30] || 'info';
          return `${timestamp} ${levelStr} ${entry.msg}`.trim();
        })
        .join('\n');
    },
  };
}

// Global in-memory destination
const globalInMemoryDestination = createInMemoryDestination();

// ============================================================================
// Adze Configuration
// ============================================================================

// Configure Adze globally
// Map ElizaOS log levels to Adze log levels
const getAdzeActiveLevel = () => {
  const level = effectiveLogLevel.toLowerCase();
  if (level === 'trace') return 'verbose';
  if (level === 'debug') return 'debug';
  if (level === 'log') return 'log';
  if (level === 'info') return 'info';
  if (level === 'warn') return 'warn';
  if (level === 'error') return 'error';
  if (level === 'fatal') return 'alert';
  return 'info'; // Default to info
};

const adzeActiveLevel = getAdzeActiveLevel();

// Reusable custom level configuration - improved colors and emojis for better terminal readability
interface AdzeLevelConfig {
  levelName: string;
  level: number;
  style: string;
  terminalStyle: readonly string[];
  method: keyof Console;
  emoji: string;
}

const customLevelConfig: Record<string, AdzeLevelConfig> = {
  alert: {
    levelName: 'alert',
    level: 0,
    style: 'font-size: 12px; color: #ff0000;',
    terminalStyle: ['bgRed' as const, 'white' as const, 'bold' as const], // Critical - keep background
    method: 'error' as keyof Console,
    emoji: '', // Visual scanning help
  },
  error: {
    levelName: 'error',
    level: 1,
    style: 'font-size: 12px; color: #ff0000;',
    terminalStyle: ['bgRed' as const, 'whiteBright' as const, 'bold' as const], // Loud and bright - white on red
    method: 'error' as keyof Console,
    emoji: '',
  },
  warn: {
    levelName: 'warn',
    level: 2,
    style: 'font-size: 12px; color: #ffaa00;',
    terminalStyle: ['bgYellow' as const, 'black' as const, 'bold' as const], // Bright but less than error - black on yellow
    method: 'warn' as keyof Console,
    emoji: '',
  },
  info: {
    levelName: 'info',
    level: 3,
    style: 'font-size: 12px; color: #0099ff;',
    terminalStyle: ['cyan' as const], // Minimal - just cyan text, no background
    method: 'info' as keyof Console,
    emoji: '',
  },
  fail: {
    levelName: 'fail',
    level: 4,
    style: 'font-size: 12px; color: #ff6600;',
    terminalStyle: ['red' as const, 'underline' as const], // Red underlined text, no background
    method: 'error' as keyof Console,
    emoji: '',
  },
  success: {
    levelName: 'success',
    level: 5,
    style: 'font-size: 12px; color: #00cc00;',
    terminalStyle: ['green' as const], // Minimal - just green text
    method: 'log' as keyof Console,
    emoji: '',
  },
  log: {
    levelName: 'log',
    level: 6,
    style: 'font-size: 12px; color: #888888;',
    terminalStyle: ['white' as const], // Minimal - just white text
    method: 'log' as keyof Console,
    emoji: '',
  },
  debug: {
    levelName: 'debug',
    level: 7,
    style: 'font-size: 12px; color: #9b59b6;',
    terminalStyle: ['gray' as const, 'dim' as const], // Dark and subtle since off by default
    method: 'debug' as keyof Console,
    emoji: '',
  },
  verbose: {
    levelName: 'verbose',
    level: 8,
    style: 'font-size: 12px; color: #666666;',
    terminalStyle: ['gray' as const, 'dim' as const, 'italic' as const], // Very subtle
    method: 'debug' as keyof Console,
    emoji: '',
  },
};

const adzeStore = setup({
  activeLevel: adzeActiveLevel,
  format: raw ? 'json' : 'pretty',
```