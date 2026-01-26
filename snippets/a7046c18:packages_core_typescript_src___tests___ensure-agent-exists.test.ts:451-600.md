# a7046c18:packages_core_typescript_src___tests___ensure-agent-exists.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/ensure-agent-exists.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          secrets: {
            SOLANA_PRIVATE_KEY: "secret_from_db",
          },
        },
      } as Agent;

      // Mock getAgent to return DB agent on first call (ensureAgentExists)
      // and updated agent on second call (after update)
      (getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>)
        .mockResolvedValueOnce(dbAgent)
        .mockResolvedValueOnce({
          ...dbAgent,
          settings: {
            ...dbAgent.settings,
            MODEL: "gpt-4", // Added from character file
          },
        });

      // Character file has different settings
      const character: Character = {
        id: agentId,
        name: "TestAgent",
        username: "test",
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
        settings: {
          MODEL: "gpt-4", // New setting from character file
        },
      };

      // Create new runtime with character file settings
      const testRuntime = new AgentRuntime({
        character,
        adapter: mockAdapter,
      });

      // Before initialize, character should only have file settings
      expect(testRuntime.character.settings?.SOLANA_PUBLIC_KEY).toBeUndefined();
      expect(testRuntime.character.settings?.MODEL).toBe("gpt-4");

      // Mock the services that initialize() expects
      (
        getEntitiesByIdsMock as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
        { id: agentId, names: ["TestAgent"], metadata: {}, agentId },
      ]);
      (
        getRoomsByIdsMock as BunMockFunction<IDatabaseAdapter["getRoomsByIds"]>
      ).mockResolvedValue([]);
      (
        getParticipantsForRoomMock as BunMockFunction<
          IDatabaseAdapter["getParticipantsForRoom"]
        >
      ).mockResolvedValue([]);
      (
        createEntitiesMock as BunMockFunction<
          IDatabaseAdapter["createEntities"]
        >
      ).mockResolvedValue(true);
      (
        createRoomsMock as BunMockFunction<IDatabaseAdapter["createRooms"]>
      ).mockResolvedValue([agentId]);
      (
        addParticipantsRoomMock as BunMockFunction<
          IDatabaseAdapter["addParticipantsRoom"]
        >
      ).mockResolvedValue(true);

      // Initialize runtime (should load DB settings into character)
      await testRuntime.initialize();

      // After initialize, character should have BOTH DB and file settings
      expect(testRuntime.character.settings?.SOLANA_PUBLIC_KEY).toBe(
        "wallet_from_db",
      );
      expect(testRuntime.character.settings?.RUNTIME_SETTING).toBe(
        "from_previous_run",
      );
      expect(testRuntime.character.settings?.MODEL).toBe("gpt-4"); // Character file wins
      expect(
        (testRuntime.character.settings?.secrets as Record<string, string>)
          ?.SOLANA_PRIVATE_KEY,
      ).toBe("secret_from_db");

      // Verify getSetting() can now access DB settings
      expect(testRuntime.getSetting("SOLANA_PUBLIC_KEY")).toBe(
        "wallet_from_db",
      );
      expect(testRuntime.getSetting("SOLANA_PRIVATE_KEY")).toBe(
        "secret_from_db",
      );
      expect(testRuntime.getSetting("RUNTIME_SETTING")).toBe(
        "from_previous_run",
      );
    });

    it("should preserve character file settings when merging with DB", async () => {
      const dbAgent: Agent = {
        id: agentId,
        name: "TestAgent",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bio: [],
        settings: {
          MODEL: "gpt-3.5-turbo", // Old value in DB
          DB_ONLY_SETTING: "keep_me",
        },
      } as Agent;

      (getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>)
        .mockResolvedValueOnce(dbAgent)
        .mockResolvedValueOnce({
          ...dbAgent,
          settings: {
            MODEL: "gpt-4", // Updated by character file
            DB_ONLY_SETTING: "keep_me",
          },
        });

      const character: Character = {
        id: agentId,
        name: "TestAgent",
        username: "test",
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
        settings: {
          MODEL: "gpt-4", // New value in character file
        },
      };

      const testRuntime = new AgentRuntime({
        character,
        adapter: mockAdapter,
      });

      (
        getEntitiesByIdsMock as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
```