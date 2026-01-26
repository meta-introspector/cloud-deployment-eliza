# a7046c18:packages_core_typescript_src___tests___ensure-agent-exists.test.ts:601-633

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/ensure-agent-exists.test.ts:601-633
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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

      await testRuntime.initialize();

      // Character file value should override DB
      expect(testRuntime.getSetting("MODEL")).toBe("gpt-4");
      // DB-only setting should be preserved
      expect(testRuntime.getSetting("DB_ONLY_SETTING")).toBe("keep_me");
    });
  });
});
```