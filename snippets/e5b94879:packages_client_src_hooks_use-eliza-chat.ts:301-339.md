# e5b94879:packages_client_src_hooks_use-eliza-chat.ts:301-339

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-eliza-chat.ts:301-339
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
    ]
  );

  // Compute combined states (no useMemo needed - simple conditionals on primitives)
  const combinedInputDisabled =
    transport === 'sse'
      ? sseInputDisabled
      : transport === 'http'
        ? httpInputDisabled
        : inputDisabled;

  const combinedIsTyping =
    transport === 'sse' ? sseIsStreaming : transport === 'http' ? httpIsLoading : isTyping;

  return {
    // Data
    messages,
    // States
    isLoading,
    isTyping: combinedIsTyping,
    isError,
    inputDisabled: combinedInputDisabled,
    // Pagination
    hasMore: hasNextPage,
    isFetchingMore: isFetchingNextPage,
    // Error
    error,
    // Actions
    sendMessage,
    fetchMore: fetchNextPage,
    clearMessages: handleClearMessages,
    // Direct message manipulation (for advanced use cases like retry, optimistic updates)
    addMessage: handleAddMessage,
    updateMessage: handleUpdateMessage,
    removeMessage: handleRemoveMessage,
    // SSE specific
    stopStreaming: transport === 'sse' ? stopStreaming : undefined,
  };
}
```