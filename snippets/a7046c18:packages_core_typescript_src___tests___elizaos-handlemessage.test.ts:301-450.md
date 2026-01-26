# a7046c18:packages_core_typescript_src___tests___elizaos-handlemessage.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos-handlemessage.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Hello",
            source: "discord",
          },
        },
        {
          onResponse: onResponseMock,
        },
      );

      // Wait a bit for async callback
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Callback should have been called
      expect(onResponseMock).toHaveBeenCalled();
      const callArgs = onResponseMock.mock.calls[0][0];
      expect(callArgs.text).toBe("Hello! How can I help you?");
    });

    it("should call onError callback if error occurs in callback", async () => {
      const onResponseMock = mock(async (_content: Content) => {
        throw new Error("Test error");
      });
      const onErrorMock = mock(async (_error: Error) => {});

      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Hello",
            source: "discord",
          },
        },
        {
          onResponse: onResponseMock,
          onError: onErrorMock,
        },
      );

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Error callback should have been called
      expect(onErrorMock).toHaveBeenCalled();
      const errorArg = onErrorMock.mock.calls[0][0];
      expect(errorArg.message).toBe("Test error");
    });

    it("should call onError if messageService.handleMessage fails", async () => {
      const errorHandleMessageMock = mock(async () => {
        throw new Error("MessageService error");
      });

      const runtime = elizaOS.getAgent(agentId);
      if (runtime) {
        runtime.messageService = {
          handleMessage: errorHandleMessageMock,
        };
      }

      const onResponseMock = mock(async (_content: Content) => {});
      const onErrorMock = mock(async (_error: Error) => {});

      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Hello",
            source: "discord",
          },
        },
        {
          onResponse: onResponseMock,
          onError: onErrorMock,
        },
      );

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Error callback should have been called
      expect(onErrorMock).toHaveBeenCalled();
      const errorArg = onErrorMock.mock.calls[0][0];
      expect(errorArg.message).toBe("MessageService error");
    });

    it("should call onComplete callback when provided", async () => {
      const onCompleteMock = mock(async () => {});

      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Hello",
            source: "test",
          },
        },
        {
          onResponse: mock(async () => {}),
          onComplete: onCompleteMock,
        },
      );

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      // onComplete should have been called
      expect(onCompleteMock).toHaveBeenCalled();
    });

    it("should pass callback to handleMessage in async mode", async () => {
      const onResponseMock = mock(async (_content: Content) => {});

      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Hello",
            source: "discord",
          },
        },
        {
          onResponse: onResponseMock,
        },
      );

      // Wait a bit for async callback
      await new Promise((resolve) => setTimeout(resolve, 10));

      // handleMessage should have been called with a callback (async mode)
      expect(handleMessageMock).toHaveBeenCalled();
      const callArgs = handleMessageMock.mock.calls[0];
      expect(callArgs[2]).toBeDefined(); // callback should be defined in async mode
      expect(typeof callArgs[2]).toBe("function");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing source in content", async () => {
```