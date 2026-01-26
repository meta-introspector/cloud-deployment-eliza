# a7046c18:packages_plugin-sql_src___tests___migration_data-persistence.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/data-persistence.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          tags TEXT[] DEFAULT '{}',
          metadata JSONB
        )
      `);

      // Insert complex data
      const profiles = [
        {
          username: "user1",
          settings: { theme: "dark", notifications: true, language: "en" },
          tags: ["admin", "developer"],
          metadata: { lastLogin: "2024-01-01", loginCount: 42 },
        },
        {
          username: "user2",
          settings: { theme: "light", notifications: false, language: "es" },
          tags: ["user", "beta-tester"],
          metadata: { lastLogin: "2024-01-02", loginCount: 15 },
        },
        {
          username: "user3",
          settings: { theme: "auto", notifications: true, language: "fr" },
          tags: ["moderator"],
          metadata: null,
        },
      ];

      for (const profile of profiles) {
        // Handle arrays and JSONB properly for PostgreSQL
        // Arrays need to be inserted as a PostgreSQL array literal
        const tagsLiteral = profile.tags
          ? `{${profile.tags.map((t) => `"${t}"`).join(",")}}`
          : "{}";

        await db.execute(
          sql.raw(`
          INSERT INTO user_profiles (username, settings, tags, metadata) 
          VALUES (
            '${profile.username}', 
            '${JSON.stringify(profile.settings)}'::jsonb,
            '${tagsLiteral}'::text[],
            ${profile.metadata ? `'${JSON.stringify(profile.metadata)}'::jsonb` : "NULL"}
          )
        `),
        );
      }

      // Define schema with modifications
      const userProfilesTable = pgTable("user_profiles", {
        id: uuid("id").primaryKey().defaultRandom(),
        username: text("username").notNull(),
        settings: jsonb("settings").notNull(),
        tags: text("tags").array().default(sql`'{}'::text[]`),
        metadata: jsonb("metadata"),
        created_at: timestamp("created_at").defaultNow(), // New column
        is_verified: boolean("is_verified").default(false), // New column
      });

      const schema = { user_profiles: userProfilesTable };

      // Run migration
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Verify complex data is preserved
      const result = await db.execute(sql`
        SELECT * FROM user_profiles ORDER BY username
      `);

      expect(result.rows).toHaveLength(3);

      // Verify user1 data
      const user1 = result.rows[0];
      expect(user1.username).toBe("user1");
      expect(user1.settings).toEqual({
        theme: "dark",
        notifications: true,
        language: "en",
      });
      expect(user1.tags).toEqual(["admin", "developer"]);
      expect(user1.metadata).toEqual({
        lastLogin: "2024-01-01",
        loginCount: 42,
      });
      expect(user1.is_verified).toBe(false); // New column default

      // Verify user2 data
      const user2 = result.rows[1];
      expect(user2.username).toBe("user2");
      expect(user2.settings).toEqual({
        theme: "light",
        notifications: false,
        language: "es",
      });
      expect(user2.tags).toEqual(["user", "beta-tester"]);

      // Verify user3 with null metadata
      const user3 = result.rows[2];
      expect(user3.username).toBe("user3");
      expect(user3.metadata).toBeNull();
      expect(user3.tags).toEqual(["moderator"]);
    });

    it("should handle large-scale data migration efficiently", async () => {
      // Create table with substantial amount of data
      await db.execute(sql`
        CREATE TABLE events (
          id SERIAL PRIMARY KEY,
          event_type TEXT NOT NULL,
          payload JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert 1000 events
      const eventTypes = ["click", "view", "purchase", "signup", "logout"];
      const batchSize = 100;

      for (let batch = 0; batch < 10; batch++) {
        const values: string[] = [];
        for (let i = 0; i < batchSize; i++) {
          const eventNum = batch * batchSize + i;
          const eventType = eventTypes[eventNum % eventTypes.length];
          values.push(
            `('${eventType}', '{"id": ${eventNum}, "timestamp": "${new Date().toISOString()}"}')`,
          );
        }

        await db.execute(
          sql.raw(`
          INSERT INTO events (event_type, payload) 
          VALUES ${values.join(", ")}
        `),
        );
      }

      // Verify initial count
      const initialCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM events`,
      );
      expect(Number(initialCount.rows[0].count)).toBe(1000);

      // Define schema with new columns and indexes
      const eventsTable = pgTable("events", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        event_type: text("event_type").notNull(),
        payload: jsonb("payload"),
        created_at: timestamp("created_at").defaultNow(),
```