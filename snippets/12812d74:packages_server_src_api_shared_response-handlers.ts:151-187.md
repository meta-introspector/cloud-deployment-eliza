# 12812d74:packages_server_src_api_shared_response-handlers.ts:151-187

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/api/shared/response-handlers.ts:151-187
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
    success: true,
    userMessage,
    ...additionalResponseData,
  });
}

/**
 * Main handler for different response modes
 * Routes to appropriate handler based on mode parameter
 */
export async function handleResponseMode(options: HandleResponseModeOptions): Promise<void> {
  const {
    res,
    mode,
    elizaOS,
    agentId,
    messageMemory,
    userMessage,
    additionalResponseData,
    onWebSocketMode,
  } = options;

  switch (mode) {
    case 'stream':
      await handleStreamMode(res, elizaOS, agentId, messageMemory, userMessage);
      break;

    case 'sync':
      await handleSyncMode(res, elizaOS, agentId, messageMemory, userMessage, additionalResponseData);
      break;

    case 'websocket':
    default:
      handleWebSocketMode(res, userMessage, additionalResponseData, onWebSocketMode);
      break;
  }
}
```