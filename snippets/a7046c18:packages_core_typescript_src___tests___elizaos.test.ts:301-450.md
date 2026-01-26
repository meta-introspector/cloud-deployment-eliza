# a7046c18:packages_core_typescript_src___tests___elizaos.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const runtime = result[0] as IAgentRuntime;
      // Runtime should have messageService after initialize
      expect(runtime.messageService).toBeDefined();
    });

    it("should use provided databaseAdapter", async () => {
      const customAdapter = {
        ...mockAdapter,
        _custom: true,
      } as IDatabaseAdapter;

      const result = await elizaOS.addAgents(
        [
          {
            character: testCharacter,
            plugins: [],
            databaseAdapter: customAdapter,
          },
        ],
        {
          returnRuntimes: true,
        },
      );

      const runtime = result[0] as IAgentRuntime;
      expect(runtime.adapter).toBe(customAdapter);
    });

    it("should emit event with ephemeral flag", async () => {
      const addedHandler = mock();
      elizaOS.addEventListener("agents:added", (e: Event) => {
        addedHandler((e as CustomEvent).detail);
      });

      await elizaOS.addAgents(
        [{ character: testCharacter, plugins: [mockSqlPlugin] }],
        {
          ephemeral: true,
        },
      );

      expect(addedHandler).toHaveBeenCalledTimes(1);
      expect(addedHandler.mock.calls[0][0].ephemeral).toBe(true);
    });
  });

  describe("handleMessage with runtime", () => {
    const testCharacter: Character = {
      name: "TestAgent",
      bio: "A test agent",
      system: "You are a test agent",
    };

    it("should accept runtime directly instead of UUID", async () => {
      const [runtime] = (await elizaOS.addAgents(
        [{ character: testCharacter, plugins: [mockSqlPlugin] }],
        {
          ephemeral: true,
          autoStart: true,
          returnRuntimes: true,
        },
      )) as IAgentRuntime[];

      // Mock messageService
      const handleMessageMock = mock().mockResolvedValue({ success: true });
      runtime.messageService = { handleMessage: handleMessageMock };
      runtime.ensureConnection = mock().mockResolvedValue(undefined);

      const result = await elizaOS.handleMessage(runtime, {
        entityId: uuidv4() as UUID,
        roomId: uuidv4() as UUID,
        content: { text: "Hello" },
      });

      expect(result.messageId).toBeDefined();
      expect(handleMessageMock).toHaveBeenCalled();
    });

    it("should throw error for unknown UUID", async () => {
      const unknownId = uuidv4() as UUID;

      await expect(
        elizaOS.handleMessage(unknownId, {
          entityId: uuidv4() as UUID,
          roomId: uuidv4() as UUID,
          content: { text: "Hello" },
        }),
      ).rejects.toThrow(`Agent ${unknownId} not found in registry`);
    });
  });

  describe("Event System", () => {
    it("should emit events when agents are added", async () => {
      const addedHandler = mock();
      elizaOS.addEventListener("agents:added", (e: Event) => {
        const customEvent = e as CustomEvent<AgentsAddedDetail>;
        addedHandler(customEvent.detail);
      });

      await elizaOS.addAgents([
        {
          character: { name: "Test1", bio: "Test agent 1" },
          plugins: [mockSqlPlugin],
        },
        {
          character: { name: "Test2", bio: "Test agent 2" },
          plugins: [mockSqlPlugin],
        },
      ]);

      expect(addedHandler).toHaveBeenCalledTimes(1);
      const eventData: AgentsAddedDetail = addedHandler.mock.calls[0][0];
      expect(eventData.count).toBe(2);
      expect(eventData.agentIds).toHaveLength(2);
    });

    it("should emit events when agents are stopped", async () => {
      const stoppedHandler = mock();
      elizaOS.addEventListener("agents:stopped", (e: Event) => {
        const customEvent = e as CustomEvent<AgentsStoppedDetail>;
        stoppedHandler(customEvent.detail);
      });

      const agentIds = await elizaOS.addAgents([
        {
          character: { name: "Test1", bio: "Test agent" },
          plugins: [mockSqlPlugin],
        },
      ]);
      await elizaOS.startAgents(agentIds);
      await elizaOS.stopAgents(agentIds);

      expect(stoppedHandler).toHaveBeenCalledTimes(1);
      const eventData: AgentsStoppedDetail = stoppedHandler.mock.calls[0][0];
      expect(eventData.agentIds).toEqual(agentIds);
    });

    it("should emit events when agents are deleted", async () => {
      const deletedHandler = mock();
      elizaOS.addEventListener("agents:deleted", (e: Event) => {
        const customEvent = e as CustomEvent<AgentsDeletedDetail>;
        deletedHandler(customEvent.detail);
      });

      const agentIds = await elizaOS.addAgents([
        {
          character: { name: "Test1", bio: "Test agent" },
          plugins: [mockSqlPlugin],
        },
      ]);
```