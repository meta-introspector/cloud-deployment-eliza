# a7046c18:packages_plugin-sql_src___tests___migration_dynamic-migration.test.ts:151-187

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/dynamic-migration.test.ts:151-187
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        agentId: testAgentId,
        roomId: testRoomId,
        entityId: testEntityId,
        worldId: testWorldId,
        content: { text: "Hello from dynamic schema!" },
        metadata: { type: MemoryType.CUSTOM, source: "test" },
      };

      const memoryId = await adapter.createMemory(memory, "memories");
      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toEqual({
        text: "Hello from dynamic schema!",
      });
    });

    it("should handle complex relationships in dynamic schemas", async () => {
      const { adapter: complexAdapter, cleanup: complexCleanup } =
        await createIsolatedTestDatabase("complex-plugin-tests", [
          complexPlugin,
        ]);

      const db = complexAdapter.getDatabase();

      // Check tables in public schema (where plugin tables are created)
      const tables = await db.execute(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      );
      const tableNames = tables.rows.map((r: any) => r.table_name);
      expect(tableNames).toContain("users");
      expect(tableNames).toContain("posts");
      expect(tableNames).toContain("comments");

      await complexCleanup();
    });
  });
});
```