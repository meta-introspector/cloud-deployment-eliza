# 2d12b6ef:packages_server_src_index.ts:1801-1821

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:1801-1821
**Novelty Score:** 35.43
**Concepts:** testing

```
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