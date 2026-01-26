# 2d12b6ef:packages_server_src_api_shared_response-handlers.ts:151-221

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/shared/response-handlers.ts:151-221
**Novelty Score:** 35.43
**Concepts:** testing

```
  onWebSocketTransport?: () => void | Promise<void>
): void {
  // Execute callback if provided (e.g., emit to message bus)
  if (onWebSocketTransport) {
    // Fire and forget - don't await
    Promise.resolve(onWebSocketTransport()).catch((err) => {
      logger.error({ src: 'http', error: err }, 'Error in websocket transport callback');
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
    onWebSocketTransport,
  } = options;

  switch (transport) {
    case 'sse':
      await handleSSETransport(res, elizaOS, agentId, messageMemory, userMessage);
      break;

    case 'http':
      await handleHttpTransport(
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
      handleWebSocketTransport(res, userMessage, additionalResponseData, onWebSocketTransport);
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
    onWebSocketTransport: options.onWebSocketMode,
  });
}
```