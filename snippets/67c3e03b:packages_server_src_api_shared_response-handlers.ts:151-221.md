# 67c3e03b:packages_server_src_api_shared_response-handlers.ts:151-221

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/shared/response-handlers.ts:151-221
**Novelty Score:** 14.99
**Concepts:** testing

```
  onWebSocketMode?: () => void | Promise<void>
): void {
  // Execute callback if provided (e.g., emit to message bus)
  if (onWebSocketMode) {
    // Fire and forget - don't await
    Promise.resolve(onWebSocketMode()).catch((err) => {
      logger.error({ src: 'http', error: err }, 'Error in websocket mode callback');
    });
  }

  res.status(201).json({
    success: true,
    userMessage,
    ...additionalResponseData,
  });
}

/**
 * Main handler for different transport types
 * Routes to appropriate handler based on transport parameter
 */
export async function handleTransport(options: HandleTransportOptions): Promise<void> {
  const {
    res,
    transport,
    elizaOS,
    agentId,
    messageMemory,
    userMessage,
    additionalResponseData,
    onWebSocketMode,
  } = options;

  switch (transport) {
    case 'sse':
      await handleStreamMode(res, elizaOS, agentId, messageMemory, userMessage);
      break;

    case 'http':
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

/**
 * @deprecated Use handleTransport instead
 */
export async function handleResponseMode(options: HandleResponseModeOptions): Promise<void> {
  return handleTransport({
    res: options.res,
    transport: options.mode,
    elizaOS: options.elizaOS,
    agentId: options.agentId,
    messageMemory: options.messageMemory,
    userMessage: options.userMessage,
    additionalResponseData: options.additionalResponseData,
    onWebSocketMode: options.onWebSocketMode,
  });
}
```