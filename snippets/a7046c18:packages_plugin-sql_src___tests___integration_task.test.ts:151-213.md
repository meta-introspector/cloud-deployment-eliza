# a7046c18:packages_plugin-sql_src___tests___integration_task.test.ts:151-213

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/task.test.ts:151-213
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const roomId2 = uuidv4() as UUID;
      await adapter.createRooms([
        {
          id: roomId1,
          agentId: testAgentId,
          worldId: testWorldId,
          source: "test",
          type: ChannelType.GROUP,
        } as Room,
        {
          id: roomId2,
          agentId: testAgentId,
          worldId: testWorldId,
          source: "test",
          type: ChannelType.GROUP,
        } as Room,
      ]);

      const task1: Task = {
        id: uuidv4() as UUID,
        roomId: roomId1,
        worldId: testWorldId,
        entityId: testEntityId,
        name: "Task 1",
        description: "Task 1",
        tags: ["urgent", "a"],
        metadata: {},
      };
      await adapter.createTask(task1);

      const task2: Task = {
        id: uuidv4() as UUID,
        roomId: roomId1,
        worldId: testWorldId,
        entityId: testEntityId,
        name: "Task 2",
        description: "Task 2",
        tags: ["a", "b"],
        metadata: {},
      };
      await adapter.createTask(task2);

      const task3: Task = {
        id: uuidv4() as UUID,
        roomId: roomId2,
        worldId: testWorldId,
        entityId: testEntityId,
        name: "Task 3",
        description: "Task 3",
        tags: ["urgent", "c"],
        metadata: {},
      };
      await adapter.createTask(task3);

      const filteredTasks = await adapter.getTasks({
        roomId: roomId1,
        tags: ["urgent"],
      });
      expect(filteredTasks.length).toBe(1);
      expect(filteredTasks[0].id).toBe(task1.id as UUID);
    });
  });
});
```