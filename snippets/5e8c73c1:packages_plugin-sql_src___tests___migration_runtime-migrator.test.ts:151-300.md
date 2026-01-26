# 5e8c73c1:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    });

    it('should track migration in _migrations table', async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._migrations 
            WHERE plugin_name = 'plugin-sql'
            ORDER BY created_at DESC
            LIMIT 1`
      );

      expect(result.rows.length).toBeGreaterThan(0);

      if (result.rows.length > 0) {
        const migration = result.rows[0] as any;
        testResults.passed.push(
          `Migration tracked: ${migration.plugin_name} - ${migration.hash.substring(0, 8)}...`
        );
      } else {
        testResults.failed.push('Migration not tracked in _migrations table');
      }
    });

    it('should save journal entry', async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._journal 
            WHERE plugin_name = 'plugin-sql'`
      );

      expect(result.rows.length).toBe(1);

      if (result.rows.length > 0) {
        const journal = result.rows[0] as any;
        const entries = journal.entries;
        testResults.passed.push(`Journal saved with ${entries.length} entries`);
      } else {
        testResults.failed.push('Journal not saved');
      }
    });

    it('should save snapshot', async () => {
      const result = await db.execute(
        sql`SELECT * FROM migrations._snapshots 
            WHERE plugin_name = 'plugin-sql'
            ORDER BY idx DESC`
      );

      expect(result.rows.length).toBeGreaterThan(0);

      if (result.rows.length > 0) {
        const snapshot = result.rows[0] as any;
        const tables = Object.keys(snapshot.snapshot.tables || {});
        testResults.passed.push(`Snapshot saved with ${tables.length} tables`);
      } else {
        testResults.failed.push('Snapshot not saved');
      }
    });
  });

  describe('Column Types and Constraints', () => {
    it('should create columns with correct types', async () => {
      const criticalColumns = [
        { table: 'agents', column: 'id', type: 'uuid' },
        { table: 'agents', column: 'name', type: 'text' },
        { table: 'agents', column: 'enabled', type: 'boolean' },
        { table: 'agents', column: 'bio', type: 'jsonb' },
        { table: 'memories', column: 'content', type: 'jsonb' },
        { table: 'embeddings', column: 'dim_384', type: 'USER-DEFINED' }, // vector
        { table: 'entities', column: 'names', type: 'ARRAY' },
      ];

      for (const col of criticalColumns) {
        const result = await db.execute(
          sql`SELECT data_type 
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = ${col.table}
              AND column_name = ${col.column}`
        );

        if (result.rows.length > 0) {
          const actualType = (result.rows[0] as any).data_type;
          const typeMatches =
            actualType === col.type ||
            (col.type === 'USER-DEFINED' && actualType === 'USER-DEFINED');

          if (typeMatches) {
            testResults.passed.push(
              `Column type correct: ${col.table}.${col.column} (${actualType})`
            );
          } else {
            testResults.failed.push(
              `Column type wrong: ${col.table}.${col.column} - expected ${col.type}, got ${actualType}`
            );
          }
        } else {
          testResults.failed.push(`Column missing: ${col.table}.${col.column}`);
        }
      }
    });

    it('should create foreign key constraints', async () => {
      const result = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND constraint_type = 'FOREIGN KEY'`
      );

      const fkCount = parseInt((result.rows[0] as any).count);
      expect(fkCount).toBeGreaterThan(0);

      if (fkCount > 0) {
        testResults.passed.push(`Foreign keys created: ${fkCount}`);
      } else {
        testResults.failed.push('No foreign keys created');
      }
    });

    it('should create unique constraints', async () => {
      const result = await db.execute(
        sql`SELECT constraint_name, table_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND constraint_type = 'UNIQUE'`
      );

      const uniqueCount = result.rows.length;
      expect(uniqueCount).toBeGreaterThan(0);

      if (uniqueCount > 0) {
        testResults.passed.push(`Unique constraints created: ${uniqueCount}`);

        // Check specific unique constraint on agents.name
        const hasAgentNameUnique = result.rows.some(
          (r: any) => r.table_name === 'agents' && r.constraint_name === 'name_unique'
        );

        if (hasAgentNameUnique) {
          testResults.passed.push('agents.name unique constraint created');
        } else {
          testResults.failed.push('agents.name unique constraint missing');
        }
      } else {
        testResults.failed.push('No unique constraints created');
      }
    });
  });

  describe('Idempotency', () => {
    it('should handle running the same migration twice', async () => {
```