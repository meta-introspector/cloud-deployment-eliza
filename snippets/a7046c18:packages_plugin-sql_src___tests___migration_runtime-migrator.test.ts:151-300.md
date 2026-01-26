# a7046c18:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  describe("Schema Migration Execution", () => {
    it("should run initial migration for plugin-sql schema", async () => {
      // Run the migration with the actual schema
      await migrator.migrate("plugin-sql", schema, { verbose: true });

      // Check that tables were created in public schema
      const tablesResult = await db.execute(
        sql`SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename`,
      );

      const createdTables = tablesResult.rows.map((r: any) => r.tablename);
      console.log(`\n📋 Tables created: ${createdTables.length}`);

      // Expected tables from schema
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
        if (createdTables.includes(table)) {
          testResults.passed.push(`Table created: ${table}`);
        } else {
          testResults.failed.push(`Table missing: ${table}`);
        }
        expect(createdTables).toContain(table);
      }
    });

    it("should track migration in _migrations table", async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._migrations 
            WHERE plugin_name = 'plugin-sql'
            ORDER BY created_at DESC
            LIMIT 1`,
      );

      expect(result.rows.length).toBeGreaterThan(0);

      if (result.rows.length > 0) {
        const migration = result.rows[0] as MigrationRow;
        testResults.passed.push(
          `Migration tracked: ${migration.plugin_name} - ${migration.hash.substring(0, 8)}...`,
        );
      } else {
        testResults.failed.push("Migration not tracked in _migrations table");
      }
    });

    it("should save journal entry", async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._journal 
            WHERE plugin_name = 'plugin-sql'`,
      );

      expect(result.rows.length).toBe(1);

      if (result.rows.length > 0) {
        const journal = result.rows[0] as JournalRow;
        const entries = journal.entries;
        testResults.passed.push(`Journal saved with ${entries.length} entries`);
      } else {
        testResults.failed.push("Journal not saved");
      }
    });

    it("should save snapshot", async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._snapshots 
            WHERE plugin_name = 'plugin-sql'
            ORDER BY idx DESC`,
      );

      expect(result.rows.length).toBeGreaterThan(0);

      if (result.rows.length > 0) {
        const snapshot = result.rows[0] as SnapshotRow;
        const tables = Object.keys(snapshot.snapshot.tables || {});
        testResults.passed.push(`Snapshot saved with ${tables.length} tables`);
      } else {
        testResults.failed.push("Snapshot not saved");
      }
    });
  });

  describe("Column Types and Constraints", () => {
    it("should create columns with correct types", async () => {
      const criticalColumns = [
        { table: "agents", column: "id", type: "uuid" },
        { table: "agents", column: "name", type: "text" },
        { table: "agents", column: "enabled", type: "boolean" },
        { table: "agents", column: "bio", type: "jsonb" },
        { table: "memories", column: "content", type: "jsonb" },
        { table: "embeddings", column: "dim_384", type: "USER-DEFINED" }, // vector
        { table: "entities", column: "names", type: "ARRAY" },
      ];

      for (const col of criticalColumns) {
        const result = await db.execute(
          sql`SELECT data_type 
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = ${col.table}
              AND column_name = ${col.column}`,
        );

        if (result.rows.length > 0) {
          const actualType = (result.rows[0] as ColumnRow).data_type;
          const typeMatches =
            actualType === col.type ||
            (col.type === "USER-DEFINED" && actualType === "USER-DEFINED");

          if (typeMatches) {
            testResults.passed.push(
              `Column type correct: ${col.table}.${col.column} (${actualType})`,
            );
          } else {
            testResults.failed.push(
              `Column type wrong: ${col.table}.${col.column} - expected ${col.type}, got ${actualType}`,
            );
          }
        } else {
          testResults.failed.push(`Column missing: ${col.table}.${col.column}`);
        }
      }
    });

    it("should create foreign key constraints", async () => {
      const result = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND constraint_type = 'FOREIGN KEY'`,
```