# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should emit RUN_ENDED event after processing", async () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174022" as UUID,
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

      // Check that RUN_ENDED was called
      const emitEventCalls = (mockRuntime.emitEvent as ReturnType<typeof mock>)
        .mock.calls;
      const runEndedCall = emitEventCalls.find(
        (call: unknown[]) =>
          Array.isArray(call) && call[0] === EventType.RUN_ENDED,
      );
      expect(runEndedCall).toBeDefined();
    });

    it("should handle errors gracefully", async () => {
      // Test that service handles invalid input gracefully
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174023" as UUID,
        content: {
          text: "", // Empty text
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

      // Should still return a result even with empty input
      expect(result).toBeDefined();
    });

    it("should store incoming message in memory", async () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174024" as UUID,
        content: {
          text: "Store this message",
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

      expect(mockRuntime.createMemory).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            text: "Store this message",
          }),
        }),
        "messages",
      );
    });
  });

  describe("integration scenarios", () => {
    it("should handle voice message flow", async () => {
      const voiceMessage: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174030" as UUID,
        content: {
          text: "Hello via voice",
          source: "discord",
          isVoiceMessage: true,
          channelType: ChannelType.VOICE_DM,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        voiceMessage,
        mockCallback,
      );

      // Should process voice messages just like regular messages
      expect(result).toBeDefined();
      expect(mockRuntime.createMemory).toHaveBeenCalled();
    });

    it("should handle message without callback", async () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174031" as UUID,
        content: {
          text: "Message without callback",
          source: "discord",
          channelType: ChannelType.GROUP,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      // Should not throw when callback is undefined
      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        message,
        undefined,
      );

      expect(result).toBeDefined();
    });

    it("should handle message from agent itself", async () => {
      const agentMessage: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174032" as UUID,
        content: {
          text: "Message from agent",
          source: "client_chat",
          channelType: ChannelType.DM,
        } as Content,
        entityId: mockRuntime.agentId as UUID, // Same as agent
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: mockRuntime.agentId as UUID,
        createdAt: Date.now(),
```