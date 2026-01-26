# a69475c0:packages_server_src_index.ts:1801-1832

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:1801-1832
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
        });

        setTimeout(() => {
          logger.error({ src: 'http' }, 'Forcing shutdown after timeout');
          process.exit(1);
        }, 5000);
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  }
}

// Export loader utilities
export {
  tryLoadFile,
  loadCharactersFromUrl,
  jsonToCharacter,
  loadCharacter,
  loadCharacterTryPath,
  hasValidRemoteUrls,
  loadCharacters,
} from './services/loader';

// Export types
export * from './types/server';

// Export ElizaOS from core (re-export for convenience)
export { ElizaOS } from '@elizaos/core';
```