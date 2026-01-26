# 5e8c73c1:packages_server_src_api_shared_response-handlers.ts:151-191

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/shared/response-handlers.ts:151-191
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
      await handleSyncMode(
        res,
        elizaOS,
        agentId,
        messageMemory,
        userMessage,
        additionalResponseData
      );
      break;

    case 'websocket':
    default:
      handleWebSocketMode(res, userMessage, additionalResponseData, onWebSocketMode);
      break;
  }
}
```