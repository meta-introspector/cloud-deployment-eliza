# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      const room = {
        id: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        type: ChannelType.DM,
        name: "DM",
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

    it("should always respond to platform mentions", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174011" as UUID,
        content: {
          text: "@TestAgent hello",
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

      const mentionContext = {
        isMention: true,
        isReply: false,
        isThread: false,
        mentionedUserIds: [],
      };

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
        room,
        mentionContext,
      );

      expect(result.shouldRespond).toBe(true);
      expect(result.skipEvaluation).toBe(true);
      expect(result.reason).toContain("platform mention");
    });

    it("should always respond to platform replies", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174012" as UUID,
        content: { text: "Thanks!", channelType: ChannelType.GROUP } as Content,
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

      const mentionContext = {
        isMention: false,
        isReply: true,
        isThread: false,
        mentionedUserIds: [],
      };

      const result = messageService.shouldRespond(
        mockRuntime as IAgentRuntime,
        message,
        room,
        mentionContext,
      );

      expect(result.shouldRespond).toBe(true);
      expect(result.skipEvaluation).toBe(true);
      expect(result.reason).toContain("platform reply");
    });

    it("should always respond in VOICE_DM channels", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174013" as UUID,
        content: {
          text: "Voice message",
          channelType: ChannelType.VOICE_DM,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      const room = {
        id: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        type: ChannelType.VOICE_DM,
        name: "Voice DM",
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

    it("should always respond to client_chat source", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174014" as UUID,
        content: {
          text: "Hello from client",
          source: "client_chat",
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
```