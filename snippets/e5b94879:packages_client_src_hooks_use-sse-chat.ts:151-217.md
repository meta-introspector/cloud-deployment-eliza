# e5b94879:packages_client_src_hooks_use-sse-chat.ts:151-217

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-sse-chat.ts:151-217
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
              try {
                const chunk = JSON.parse(data);

                if (chunk.type === 'chunk' && chunk.text) {
                  accumulatedText += chunk.text;
                  onUpdateMessage(agentMessageId, {
                    text: accumulatedText,
                    isStreaming: true,
                  });
                } else if (chunk.type === 'complete') {
                  onUpdateMessage(agentMessageId, {
                    text: chunk.text || accumulatedText,
                    isStreaming: false,
                    isLoading: false,
                  });
                  setIsStreaming(false);
                } else if (chunk.type === 'error') {
                  throw new Error(chunk.error || 'Stream error');
                }
              } catch {
                // Non-JSON data, treat as text chunk
                accumulatedText += data;
                onUpdateMessage(agentMessageId, {
                  text: accumulatedText,
                  isStreaming: true,
                });
              }
            }
          }
        }

        // Ensure final state
        onUpdateMessage(agentMessageId, {
          text: accumulatedText,
          isStreaming: false,
          isLoading: false,
        });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        console.error('[useSSEChat] Error sending message:', error);
        onUpdateMessage(tempId, {
          isLoading: false,
          text: `${text} (Failed to send)`,
        });
      } finally {
        setIsStreaming(false);
        setInputDisabled(false);
      }
    },
    [sessionId, agentId, serverId, channelId, currentUserId, onAddMessage, onUpdateMessage]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
    inputDisabled,
  };
}
```