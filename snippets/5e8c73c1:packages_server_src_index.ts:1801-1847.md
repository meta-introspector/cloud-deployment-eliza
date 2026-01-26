# 5e8c73c1:packages_server_src_index.ts:1801-1847

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/index.ts:1801-1847
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        }
      }

      if (this.database) {
        try {
          await this.database.close();
        } catch (error) {
          logger.error({ src: 'db', error }, 'Error closing database');
        }
      }

      if (this.server) {
        this.server.close(() => {
          logger.success({ src: 'http' }, 'Server closed');
          process.exit(0);
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