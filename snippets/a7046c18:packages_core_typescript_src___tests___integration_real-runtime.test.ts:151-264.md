# a7046c18:packages_core_typescript_src___tests___integration_real-runtime.test.ts:151-264

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/integration/real-runtime.test.ts:151-264
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        const worldId = await runtime.createWorld({
          name: "Test World",
          agentId,
        });
        expect(worldId).toBeDefined();

        const roomId = stringToUuid(`test-room-${uuidv4()}`);
        await runtime.ensureRoomExists({
          id: roomId,
          name: "Room in World",
          source: "integration-test",
          type: "GROUP",
          worldId,
        });

        // Get rooms for world
        const rooms = await runtime.getRoomsByWorld(worldId);
        expect(rooms.length).toBeGreaterThan(0);
      });
    });

    describe("Entity Management", () => {
      it("should create and retrieve an entity", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }

        const entityId = stringToUuid(`entity-${uuidv4()}`);

        await runtime.createEntity({
          id: entityId,
          names: ["Test Entity"],
          agentId,
          metadata: { testKey: "testValue" },
        });

        const entity = await runtime.getEntityById(entityId);
        expect(entity).toBeDefined();
        expect(entity?.names).toContain("Test Entity");
      });
    });

    describe("Cache Operations", () => {
      it("should set and get cache values", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }

        const cacheKey = `test-cache-${uuidv4()}`;
        const cacheValue = { data: "test data", timestamp: Date.now() };

        await runtime.setCache({ key: cacheKey, agentId, value: cacheValue });

        const retrieved = await runtime.getCache({ key: cacheKey, agentId });
        expect(retrieved).toBeDefined();
        expect(retrieved?.data).toBe("test data");
      });
    });

    describe("Task Management", () => {
      it("should create and retrieve a task", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }

        const roomId = stringToUuid(`test-room-${uuidv4()}`);

        const taskId = await runtime.createTask({
          name: "Test Task",
          roomId,
          worldId: agentId, // Using agentId as worldId for simplicity
          metadata: { priority: "high" },
          tags: ["test"],
        });

        expect(taskId).toBeDefined();

        const task = await runtime.getTask(taskId);
        expect(task).toBeDefined();
        expect(task?.name).toBe("Test Task");
      });
    });
  },
);

/**
 * Example of testing with real inference (requires Ollama)
 */
describe.skipIf(!SHOULD_RUN)("Inference Integration Tests", () => {
  it.skip("should generate text using Ollama", async () => {
    // This test requires Ollama to be running
    // Enable it when you have Ollama set up

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: "Say hello in one word",
        stream: false,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as { response: string };
      expect(data.response).toBeDefined();
      expect(data.response.length).toBeGreaterThan(0);
    }
  });
});
```