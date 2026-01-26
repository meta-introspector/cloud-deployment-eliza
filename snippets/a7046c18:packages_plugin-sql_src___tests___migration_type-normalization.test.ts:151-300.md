# a7046c18:packages_plugin-sql_src___tests___migration_type-normalization.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/type-normalization.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'test_timestamp'
        ORDER BY column_name
      `);
      expect(columns.rows).toHaveLength(3);
    });

    it("should handle timestamp with time zone variations", async () => {
      await db.execute(sql`
        CREATE TABLE test_timestamptz (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      const schema = {
        test_timestamptz: pgTable("test_timestamptz", {
          id: uuid("id").primaryKey().defaultRandom(),
          created_at: timestamp("created_at", {
            withTimezone: true,
          }).defaultNow(),
        }),
      };

      await migrator.migrate("@test/timestamptz", schema, { verbose: false });

      // Should complete without errors
      const result = await db.execute(
        sql`SELECT COUNT(*) FROM test_timestamptz`,
      );
      expect(result).toBeDefined();
    });
  });

  describe("Numeric Type Variations", () => {
    it("should handle numeric/decimal equivalence", async () => {
      await db.execute(sql`
        CREATE TABLE test_numeric (
          id SERIAL PRIMARY KEY,
          price DECIMAL(10,2),
          quantity NUMERIC(10,2)
        )
      `);

      const schema = {
        test_numeric: pgTable("test_numeric", {
          id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
          price: numeric("price", { precision: 10, scale: 2 }),
          quantity: numeric("quantity", { precision: 10, scale: 2 }),
        }),
      };

      await migrator.migrate("@test/numeric", schema, { verbose: false });

      // Should complete without errors
      const result = await db.execute(sql`SELECT COUNT(*) FROM test_numeric`);
      expect(result).toBeDefined();
    });

    it("should handle varchar/character varying equivalence", async () => {
      await db.execute(sql`
        CREATE TABLE test_varchar (
          id SERIAL PRIMARY KEY,
          name CHARACTER VARYING(255),
          description VARCHAR(500)
        )
      `);

      const schema = {
        test_varchar: pgTable("test_varchar", {
          id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
          name: varchar("name", { length: 255 }),
          description: varchar("description", { length: 500 }),
        }),
      };

      await migrator.migrate("@test/varchar", schema, { verbose: false });

      // Should complete without errors
      const result = await db.execute(sql`SELECT COUNT(*) FROM test_varchar`);
      expect(result).toBeDefined();
    });
  });

  describe("Safe Type Promotions", () => {
    it("should allow safe numeric type promotions", async () => {
      await db.execute(sql`
        CREATE TABLE test_promotion (
          id SERIAL PRIMARY KEY,
          small_num SMALLINT,
          medium_num INTEGER
        )
      `);

      // Insert test data
      await db.execute(sql`
        INSERT INTO test_promotion (small_num, medium_num) 
        VALUES (100, 1000)
      `);

      // Promote types to larger sizes (safe operation)
      const schema = {
        test_promotion: pgTable("test_promotion", {
          id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
          small_num: integer("small_num"), // smallint -> integer
          medium_num: bigint("medium_num", { mode: "number" }), // integer -> bigint
        }),
      };

      // This should be allowed without force flag
      await migrator.migrate("@test/promotion", schema, { verbose: false });

      // Verify data is preserved
      const result = await db.execute(sql`
        SELECT * FROM test_promotion
      `);
      expect(result.rows[0].small_num).toBe(100);
      expect(Number(result.rows[0].medium_num)).toBe(1000);
    });

    it("should allow varchar to text promotion", async () => {
      await db.execute(sql`
        CREATE TABLE test_text_promotion (
          id SERIAL PRIMARY KEY,
          short_text VARCHAR(100),
          long_text TEXT
        )
      `);

      await db.execute(sql`
        INSERT INTO test_text_promotion (short_text, long_text) 
        VALUES ('short', 'long text value')
      `);

      const schema = {
        test_text_promotion: pgTable("test_text_promotion", {
          id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
          short_text: text("short_text"), // varchar -> text (safe)
          long_text: text("long_text"),
        }),
      };

      await migrator.migrate("@test/text_promotion", schema, {
        verbose: false,
      });

      // Verify data is preserved
      const result = await db.execute(sql`
        SELECT * FROM test_text_promotion
```