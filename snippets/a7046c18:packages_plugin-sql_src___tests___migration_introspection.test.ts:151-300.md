# a7046c18:packages_plugin-sql_src___tests___migration_introspection.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/introspection.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await db.execute(sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          quantity INTEGER NOT NULL,
          CONSTRAINT positive_price CHECK (price > 0),
          CONSTRAINT positive_quantity CHECK (quantity >= 0)
        )
      `);

      const snapshot = await introspector.introspectSchema("public");
      const productsTable = snapshot.tables["public.products"];

      // Verify check constraints were captured
      expect(Object.keys(productsTable.checkConstraints)).toHaveLength(2);
      expect(productsTable.checkConstraints.positive_price).toBeDefined();
      expect(productsTable.checkConstraints.positive_quantity).toBeDefined();
    });

    it("should detect existing tables correctly", async () => {
      // Initially no tables
      let hasExisting = await introspector.hasExistingTables(
        "@elizaos/plugin-sql",
      );
      expect(hasExisting).toBe(false);

      // Create a table
      await db.execute(sql`
        CREATE TABLE test_table (
          id SERIAL PRIMARY KEY,
          name TEXT
        )
      `);

      // Now should detect tables
      hasExisting = await introspector.hasExistingTables("@elizaos/plugin-sql");
      expect(hasExisting).toBe(true);
    });
  });

  describe("Migration with Pre-existing Tables", () => {
    it("should handle migration when tables already exist without snapshots", async () => {
      // Step 1: Create tables directly (simulating production tables)
      await db.execute(sql`
        CREATE TABLE accounts (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Step 2: Define the schema in code (might have some differences)
      const accountsTable = pgTable("accounts", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        username: text("username").notNull().unique(),
        email: text("email").notNull().unique(),
        created_at: timestamp("created_at").defaultNow(),
        // New field that doesn't exist in DB yet
        updated_at: timestamp("updated_at").defaultNow(),
      });

      const schema = { accounts: accountsTable };

      // Step 3: Run migration - should introspect existing tables first
      // Use force to allow type changes in test environment
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Step 4: Verify the new column was added
      const result = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'accounts'
        ORDER BY column_name
      `);

      const columnNames = result.rows.map((row) => row.column_name);
      expect(columnNames).toContain("updated_at");
      expect(columnNames).toHaveLength(5); // id, username, email, created_at, updated_at
    });

    it("should preserve data when introspecting and migrating", async () => {
      // Create table with data
      await db.execute(sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL
        )
      `);

      await db.execute(sql`
        INSERT INTO products (name, price) VALUES 
        ('Product A', 100),
        ('Product B', 200),
        ('Product C', 300)
      `);

      // Define schema with additional column
      const productsTable = pgTable("products", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        price: integer("price").notNull(),
        description: text("description"), // New column
      });

      const schema = { products: productsTable };

      // Run migration
      // Use force to allow type changes in test environment
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Verify data is preserved
      const result = await db.execute(sql`SELECT * FROM products ORDER BY id`);
      expect(result.rows).toHaveLength(3);
      expect(result.rows[0]).toMatchObject({ name: "Product A", price: 100 });
      expect(result.rows[1]).toMatchObject({ name: "Product B", price: 200 });
      expect(result.rows[2]).toMatchObject({ name: "Product C", price: 300 });

      // Verify new column exists
      const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products'
      `);
      const columnNames = columns.rows.map((row) => row.column_name);
      expect(columnNames).toContain("description");
    });

    it("should handle complex schema with foreign keys during introspection", async () => {
      // Create related tables
      await db.execute(sql`
        CREATE TABLE organizations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await db.execute(sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          org_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
```