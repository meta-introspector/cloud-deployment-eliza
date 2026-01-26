# a7046c18:packages_plugin-sql_src___tests___migration_type-normalization.test.ts:301-377

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/type-normalization.test.ts:301-377
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      `);
      expect(result.rows[0].short_text).toBe("short");
      expect(result.rows[0].long_text).toBe("long text value");
    });
  });

  describe("Complex Real-World Scenario", () => {
    it("should handle mixed type variations in production-like table", async () => {
      // Simulate a production table with various type representations
      await db.execute(sql`
        CREATE TABLE production_table (
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          username CHARACTER VARYING(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          age SMALLINT,
          balance DECIMAL(20,2) DEFAULT 0.00,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT TRUE,
          tags TEXT[]
        )
      `);

      // Insert test data
      await db.execute(sql`
        INSERT INTO production_table (user_id, username, email, age, balance, metadata) 
        VALUES (
          gen_random_uuid(),
          'testuser',
          'test@example.com',
          25,
          100.50,
          '{"role": "user"}'::jsonb
        )
      `);

      // Drizzle schema with normalized types
      const schema = {
        production_table: pgTable("production_table", {
          id: bigint("id", { mode: "number" })
            .primaryKey()
            .generatedByDefaultAsIdentity(),
          user_id: uuid("user_id").notNull(),
          username: varchar("username", { length: 255 }).notNull(),
          email: varchar("email", { length: 255 }).notNull(),
          age: smallint("age"),
          balance: numeric("balance", { precision: 20, scale: 2 }).default(
            "0.00",
          ),
          metadata: jsonb("metadata").default({}),
          created_at: timestamp("created_at").defaultNow(),
          updated_at: timestamp("updated_at", {
            withTimezone: true,
          }).defaultNow(),
          is_active: boolean("is_active").default(true),
          tags: text("tags").array(),
        }),
      };

      // Should handle all type variations without errors
      await migrator.migrate("@test/production", schema, { verbose: false });

      // Verify data integrity
      const result = await db.execute(sql`
        SELECT * FROM production_table
      `);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].username).toBe("testuser");
      expect(result.rows[0].email).toBe("test@example.com");
      expect(result.rows[0].age).toBe(25);
      expect(Number(result.rows[0].balance)).toBe(100.5);
      expect(result.rows[0].is_active).toBe(true);
    });
  });
});
```