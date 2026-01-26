# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:751-760

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:751-760
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should handle removing non-existent items", async () => {
      // These should not throw
      await adapter.deleteEntity(uuidv4() as UUID);
      await adapter.deleteMemory(uuidv4() as UUID);
      await adapter.deleteComponent(uuidv4() as UUID);
      await adapter.deleteRoom(uuidv4() as UUID);
    });
  });
});
```