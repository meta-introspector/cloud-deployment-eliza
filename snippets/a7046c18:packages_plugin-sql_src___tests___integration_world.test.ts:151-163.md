# a7046c18:packages_plugin-sql_src___tests___integration_world.test.ts:151-163

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/world.test.ts:151-163
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };
      await adapter.createWorld(world1);
      await adapter.createWorld(world2);
      const worlds = await adapter.getAllWorlds();
      expect(worlds.length).toBe(2);
    });

    it("should return an empty array if no worlds exist", async () => {
      const worlds = await adapter.getAllWorlds();
      expect(worlds).toEqual([]);
    });
  });
});
```