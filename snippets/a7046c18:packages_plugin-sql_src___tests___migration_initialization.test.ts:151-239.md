# a7046c18:packages_plugin-sql_src___tests___migration_initialization.test.ts:151-239

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization.test.ts:151-239
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const expectedTables = [
        "agents",
        "cache",
        "channel_participants",
        "channels",
        "components",
        "embeddings",
        "entities",
        "logs",
        "memories",
        "message_servers",
        "message_server_agents",
        "central_messages",
        "participants",
        "relationships",
        "rooms",
        "tasks",
        "worlds",
      ];

      for (const table of expectedTables) {
        expect(createdTables).toContain(table);
      }
    });

    it("should track migration in _migrations table", async () => {
      const result = await db.execute(
        sql.raw(`SELECT * FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/plugin-sql'
                 ORDER BY created_at DESC
                 LIMIT 1`),
      );

      expect(result.rows.length).toBeGreaterThan(0);

      const migration = result.rows[0] as MigrationRow;
      expect(migration.plugin_name).toBe("@elizaos/plugin-sql");
      expect(migration.hash).toBeDefined();
      expect(migration.created_at).toBeDefined();
    });

    it("should save journal entry with migration details", async () => {
      const result = await db.execute(
        sql.raw(`SELECT * FROM migrations._journal 
                 WHERE plugin_name = '@elizaos/plugin-sql'`),
      );

      expect(result.rows.length).toBe(1);

      const journal = result.rows[0] as JournalRow;
      expect(journal.entries).toBeDefined();
      expect(Array.isArray(journal.entries)).toBe(true);
      expect(journal.entries.length).toBeGreaterThan(0);
    });

    it("should save schema snapshot", async () => {
      const result = await db.execute(
        sql.raw(`SELECT * FROM migrations._snapshots 
                 WHERE plugin_name = '@elizaos/plugin-sql'
                 ORDER BY idx DESC`),
      );

      expect(result.rows.length).toBeGreaterThan(0);

      const snapshot = result.rows[0] as SnapshotRow;
      expect(snapshot.snapshot).toBeDefined();
      expect(snapshot.snapshot.tables).toBeDefined();
      expect(Object.keys(snapshot.snapshot.tables).length).toBeGreaterThan(0);
    });
  });

  describe("Migration Status and Tracking", () => {
    it("should provide accurate migration status", async () => {
      const status = await migrator.getStatus("@elizaos/plugin-sql");

      expect(status.hasRun).toBe(true);
      expect(status.snapshots).toBeGreaterThan(0);
      expect(status.lastMigration).toBeDefined();
    });

    it("should handle status check for non-existent plugin", async () => {
      const status = await migrator.getStatus("non-existent-plugin");

      expect(status.hasRun).toBe(false);
      expect(status.snapshots).toBe(0);
      expect(status.lastMigration).toBeNull();
    });
  });
});
```