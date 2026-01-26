# a7046c18:packages_plugin-sql_src___tests___migration_production-scenario.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/production-scenario.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL
        )
      `);

      // But the related tables were not created (simulating a failed migration)
      // Now define the complete schema
      const usersTable = pgTable("users", {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        created_at: timestamp("created_at").defaultNow(), // New field
      });

      const profilesTable = pgTable("profiles", {
        id: uuid("id").primaryKey().defaultRandom(),
        user_id: uuid("user_id")
          .notNull()
          .references(() => usersTable.id),
        bio: text("bio"),
        avatar_url: text("avatar_url"),
      });

      const sessionsTable = pgTable("sessions", {
        id: uuid("id").primaryKey().defaultRandom(),
        user_id: uuid("user_id")
          .notNull()
          .references(() => usersTable.id),
        token: text("token").notNull().unique(),
        expires_at: timestamp("expires_at").notNull(),
      });

      const schema = {
        users: usersTable,
        profiles: profilesTable,
        sessions: sessionsTable,
      };

      // Run migration - should complete the partial migration
      await migrator.migrate("@elizaos/plugin-sql", schema, { verbose: false });

      // Verify all tables exist
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const tableNames = tables.rows.map((row) => row.table_name);
      expect(tableNames).toContain("users");
      expect(tableNames).toContain("profiles");
      expect(tableNames).toContain("sessions");

      // Verify the users table was updated with new field
      const userColumns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY column_name
      `);

      const columnNames = userColumns.rows.map((row) => row.column_name);
      expect(columnNames).toContain("created_at");
    });

    it("should be idempotent when run multiple times", async () => {
      // Create initial state
      await db.execute(sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price NUMERIC(10,2) NOT NULL
        )
      `);

      await db.execute(sql`
        INSERT INTO products (name, price) VALUES 
        ('Product A', 99.99),
        ('Product B', 149.99)
      `);

      // Define schema
      const productsTable = pgTable("products", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        price: numeric("price", { precision: 10, scale: 2 }).notNull(),
        category: text("category").default("general"), // New field
      });

      const schema = { products: productsTable };

      // Run migration multiple times
      await migrator.migrate("@elizaos/plugin-sql", schema, { verbose: false });
      await migrator.migrate("@elizaos/plugin-sql", schema, { verbose: false });
      await migrator.migrate("@elizaos/plugin-sql", schema, { verbose: false });

      // Verify data is still intact
      const products = await db.execute(sql`
        SELECT * FROM products ORDER BY id
      `);
      expect(products.rows).toHaveLength(2);
      expect(products.rows[0].name).toBe("Product A");
      expect(products.rows[1].name).toBe("Product B");

      // Verify structure is correct (not duplicated)
      const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products'
        ORDER BY column_name
      `);

      const columnNames = columns.rows.map((row) => row.column_name);
      expect(columnNames).toHaveLength(4); // id, name, price, category
      expect(columnNames).toContain("category");
    });
  });

  describe("Scenario 4: Large Production Database", () => {
    it("should handle introspection of many tables efficiently", async () => {
      // Create multiple tables to simulate a large production database
      const tableCount = 20;

      for (let i = 0; i < tableCount; i++) {
        await db.execute(
          sql.raw(`
          CREATE TABLE table_${i} (
            id SERIAL PRIMARY KEY,
            data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `),
        );

        // Add some data
        await db.execute(
          sql.raw(`
          INSERT INTO table_${i} (data) VALUES ('Data for table ${i}')
        `),
        );
      }

      // Add some indexes
      for (let i = 0; i < 5; i++) {
        await db.execute(
          sql.raw(`
          CREATE INDEX idx_table_${i}_created_at ON table_${i}(created_at)
        `),
```