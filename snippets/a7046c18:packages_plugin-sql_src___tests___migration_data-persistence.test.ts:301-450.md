# a7046c18:packages_plugin-sql_src___tests___migration_data-persistence.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/data-persistence.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    it("should handle migration rollback on failure without data loss", async () => {
      // Create table with critical data
      await db.execute(sql`
        CREATE TABLE transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          amount NUMERIC(10,2) NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert transaction data
      const transactionIds: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const result = await db.execute(sql`
          INSERT INTO transactions (amount, status) 
          VALUES (${100 * i}, 'completed')
          RETURNING id
        `);
        transactionIds.push(result.rows[0].id as string);
      }

      // Verify initial state
      const initialData = await db.execute(sql`
        SELECT * FROM transactions ORDER BY amount
      `);
      expect(initialData.rows).toHaveLength(10);

      // Try a migration that will fail (conflicting column type)
      const badSchema = pgTable("transactions", {
        id: integer("id").primaryKey(), // Wrong type - will conflict
        amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
        status: text("status").notNull(),
        created_at: timestamp("created_at").defaultNow(),
      });

      // This should fail but not lose data
      try {
        await migrator.migrate(
          "@elizaos/plugin-sql",
          { transactions: badSchema },
          {
            verbose: false,
            force: false, // Don't force destructive changes
          },
        );
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        // Expected to fail
        expect((error as Error).message).toContain(
          "Destructive migration blocked",
        );
      }

      // Verify data is still intact after failed migration
      const afterFailure = await db.execute(sql`
        SELECT * FROM transactions ORDER BY amount
      `);
      expect(afterFailure.rows).toHaveLength(10);

      // Verify each transaction is unchanged
      for (let i = 0; i < 10; i++) {
        expect(afterFailure.rows[i].amount).toBe(`${String(100 * (i + 1))}.00`); // Numeric includes precision
        expect(afterFailure.rows[i].status).toBe("completed");
        expect(transactionIds).toContain(afterFailure.rows[i].id as string);
      }
    });

    it("should correctly track migration history through multiple changes", async () => {
      // Create initial table
      const ordersV1 = pgTable("orders", {
        id: serial("id").primaryKey(),
        total: integer("total").notNull(),
      });

      await migrator.migrate(
        "@elizaos/plugin-sql",
        { orders: ordersV1 },
        { verbose: false },
      );

      // Insert data
      for (let i = 1; i <= 5; i++) {
        await db.execute(sql`
          INSERT INTO orders (total) VALUES (${i * 100})
        `);
      }

      // Version 2: Add customer_name
      const ordersV2 = pgTable("orders", {
        id: serial("id").primaryKey(),
        total: integer("total").notNull(),
        customer_name: text("customer_name"),
      });

      await migrator.migrate(
        "@elizaos/plugin-sql",
        { orders: ordersV2 },
        { verbose: false },
      );

      // Version 3: Add status and created_at
      const ordersV3 = pgTable("orders", {
        id: serial("id").primaryKey(),
        total: integer("total").notNull(),
        customer_name: text("customer_name"),
        status: varchar("status", { length: 20 }).default("pending"),
        created_at: timestamp("created_at").defaultNow(),
      });

      await migrator.migrate(
        "@elizaos/plugin-sql",
        { orders: ordersV3 },
        { verbose: false },
      );

      // Verify data persisted through all migrations
      const finalData = await db.execute(sql`
        SELECT * FROM orders ORDER BY id
      `);

      expect(finalData.rows).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(finalData.rows[i].id).toBe(i + 1);
        expect(finalData.rows[i].total).toBe((i + 1) * 100);
        expect(finalData.rows[i].status).toBe("pending"); // Default value
      }

      // Verify complete migration history
      const status = await migrator.getStatus("@elizaos/plugin-sql");
      expect(status.hasRun).toBe(true);
      expect(status.journal?.entries).toHaveLength(3); // Three migrations
      expect(status.snapshots).toBe(3); // Three snapshots

      // Verify each snapshot was saved correctly
      const journalEntries = status.journal?.entries || [];
      expect(journalEntries[0].idx).toBe(0);
      expect(journalEntries[1].idx).toBe(1);
      expect(journalEntries[2].idx).toBe(2);
    });

    it("should handle complex data with JSON and arrays correctly", async () => {
      // Create table with complex data types
      await db.execute(sql`
        CREATE TABLE user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT NOT NULL,
          settings JSONB NOT NULL,
```