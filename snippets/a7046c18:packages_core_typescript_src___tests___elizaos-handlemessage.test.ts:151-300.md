# a7046c18:packages_core_typescript_src___tests___elizaos-handlemessage.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos-handlemessage.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Test",
          source: "discord",
        },
      });

      expect(ensureConnectionMock).toHaveBeenCalled();
      const callArgs = ensureConnectionMock.mock.calls[0][0];

      expect(callArgs.entityId).toBe("123e4567-e89b-12d3-a456-426614174005");
      expect(callArgs.roomId).toBe("123e4567-e89b-12d3-a456-426614174002");
      expect(callArgs.source).toBe("discord");
    });

    it("should use worldId if provided", async () => {
      await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        worldId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
        content: {
          text: "Test",
          source: "discord",
        },
      });

      const callArgs = ensureConnectionMock.mock.calls[0][0];
      expect(callArgs.worldId).toBe("123e4567-e89b-12d3-a456-426614174003");
    });

    it("should fallback to roomId if worldId not provided", async () => {
      await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Test",
          source: "web",
        },
      });

      const callArgs = ensureConnectionMock.mock.calls[0][0];
      expect(callArgs.worldId).toBe("123e4567-e89b-12d3-a456-426614174002");
    });

    it("should preserve provided id, agentId, and createdAt", async () => {
      const customId = "123e4567-e89b-12d3-a456-426614174100" as UUID;
      const customAgentId = "123e4567-e89b-12d3-a456-426614174101" as UUID;
      const customCreatedAt = Date.now() - 1000;

      const result = await elizaOS.handleMessage(agentId, {
        id: customId,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: customAgentId,
        createdAt: customCreatedAt,
        content: {
          text: "Test",
          source: "test",
        },
      });

      expect(result.userMessage.id).toBe(customId);
      expect(result.userMessage.agentId).toBe(customAgentId);
      expect(result.userMessage.createdAt).toBe(customCreatedAt);
    });

    it("should pass processing options to messageService", async () => {
      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Test",
            source: "test",
          },
        },
        {
          maxRetries: 3,
          timeoutDuration: 5000,
          useMultiStep: true,
          maxMultiStepIterations: 10,
        },
      );

      const callArgs = handleMessageMock.mock.calls[0];
      const processingOptions = callArgs[3];

      expect(processingOptions.maxRetries).toBe(3);
      expect(processingOptions.timeoutDuration).toBe(5000);
      expect(processingOptions.useMultiStep).toBe(true);
      expect(processingOptions.maxMultiStepIterations).toBe(10);
    });

    it("should call onComplete callback when provided", async () => {
      const onCompleteMock = mock(async () => {});

      await elizaOS.handleMessage(
        agentId,
        {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Test",
            source: "test",
          },
        },
        {
          onComplete: onCompleteMock,
        },
      );

      expect(onCompleteMock).toHaveBeenCalled();
    });
  });

  describe("ASYNC Mode", () => {
    it("should return immediately with messageId when onResponse provided", async () => {
      const onResponseMock = mock(async (_content: Content) => {});

      const result = await elizaOS.handleMessage(
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

      // Should return message ID immediately
      expect(result.messageId).toBeDefined();

      // Should return user message
      expect(result.userMessage).toBeDefined();

      // Should NOT return processing in async mode
      expect(result.processing).toBeUndefined();
    });

    it("should call onResponse callback with agent response", async () => {
      const onResponseMock = mock(async (_content: Content) => {});

      await elizaOS.handleMessage(
        agentId,
```