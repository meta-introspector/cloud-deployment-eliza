# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
        room,
      );

      expect(result.shouldRespond).toBe(true);
      expect(result.skipEvaluation).toBe(true);
      expect(result.reason).toContain("whitelisted source");
    });

    it("should always respond in API channels", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174015" as UUID,
        content: {
          text: "API request",
          channelType: ChannelType.API,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const room = {
        id: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        type: ChannelType.API,
        name: "API",
        worldId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
        source: "test",
      };

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
        room,
      );

      expect(result.shouldRespond).toBe(true);
      expect(result.skipEvaluation).toBe(true);
      expect(result.reason).toContain("private channel");
    });

    it("should require LLM evaluation for group messages without mentions", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174016" as UUID,
        content: {
          text: "General message in group",
          channelType: ChannelType.GROUP,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const room = {
        id: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        type: ChannelType.GROUP,
        name: "Group",
        worldId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
        source: "test",
      };

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
        room,
      );

      expect(result.shouldRespond).toBe(false);
      expect(result.skipEvaluation).toBe(false);
      expect(result.reason).toContain("needs LLM evaluation");
    });

    it("should return false if no room context provided", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174017" as UUID,
        content: { text: "Message without room" } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
      );

      expect(result.shouldRespond).toBe(false);
      expect(result.skipEvaluation).toBe(true);
      expect(result.reason).toBe("no room context");
    });
  });

  describe("handleMessage", () => {
    it("should process a simple message and generate response", async () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174020" as UUID,
        content: {
          text: "Hello, how are you?",
          source: "client_chat",
          channelType: ChannelType.DM,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        message,
        mockCallback,
      );

      expect(result.didRespond).toBeDefined();
      expect(mockRuntime.createMemory).toHaveBeenCalled();
    });

    it("should emit RUN_STARTED event when handling message", async () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174021" as UUID,
        content: {
          text: "Test message",
          source: "client_chat",
          channelType: ChannelType.DM,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        message,
        mockCallback,
      );

      expect(mockRuntime.emitEvent).toHaveBeenCalledWith(
        EventType.RUN_STARTED,
        expect.objectContaining({
          runtime: mockRuntime,
          messageId: message.id,
        }),
      );
    });
```