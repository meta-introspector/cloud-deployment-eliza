# a7046c18:packages_plugin-sql_src___tests___migration_introspection.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/introspection.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { sql } from "drizzle-orm";
import {
  integer,
  pgSchema,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { DatabaseIntrospector } from "../../runtime-migrator/drizzle-adapters/database-introspector";
import { RuntimeMigrator } from "../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../runtime-migrator/types";

describe("Database Introspection Tests", () => {
  let pgClient: PGlite;
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let introspector: DatabaseIntrospector;

  beforeEach(async () => {
    // Create in-memory database for testing
    pgClient = new PGlite({ extensions: { vector } });
    db = drizzle(pgClient);
    migrator = new RuntimeMigrator(db);
    introspector = new DatabaseIntrospector(db);

    // Initialize migration tables
    await migrator.initialize();
  });

  afterEach(async () => {
    // Clean up
    await pgClient.close();
  });

  describe("Basic Introspection", () => {
    it("should introspect existing tables without snapshots", async () => {
      // First, create tables directly in the database (simulating pre-existing tables)
      await db.execute(sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await db.execute(sql`
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT,
          published BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await db.execute(sql`
        CREATE INDEX idx_posts_user_id ON posts(user_id)
      `);

      await db.execute(sql`
        CREATE INDEX idx_posts_published ON posts(published) WHERE published = true
      `);

      // Now introspect the database
      const snapshot = await introspector.introspectSchema("public");

      // Verify the snapshot contains the correct tables
      expect(Object.keys(snapshot.tables)).toHaveLength(2);
      expect(snapshot.tables["public.users"]).toBeDefined();
      expect(snapshot.tables["public.posts"]).toBeDefined();

      // Verify users table structure
      const usersTable = snapshot.tables["public.users"];
      expect(usersTable.name).toBe("users");
      expect(usersTable.schema).toBe("public");
      expect(Object.keys(usersTable.columns)).toHaveLength(5);
      expect(usersTable.columns.id).toMatchObject({
        name: "id",
        type: "serial",
        primaryKey: true,
        notNull: true,
      });
      expect(usersTable.columns.email.notNull).toBe(true);
      expect(usersTable.uniqueConstraints).toBeDefined();

      // Verify posts table structure
      const postsTable = snapshot.tables["public.posts"];
      expect(postsTable.name).toBe("posts");
      expect(Object.keys(postsTable.columns)).toHaveLength(6);
      expect(postsTable.columns.user_id.notNull).toBe(true);

      // Verify foreign key
      const foreignKeys = Object.values(postsTable.foreignKeys);
      expect(foreignKeys).toHaveLength(1);
      expect(foreignKeys[0]).toMatchObject({
        tableFrom: "posts",
        tableTo: "users",
        columnsFrom: ["user_id"],
        columnsTo: ["id"],
        onDelete: "cascade",
      });

      // Verify indexes
      expect(Object.keys(postsTable.indexes)).toHaveLength(2);
    });

    it("should handle introspection with custom schemas", async () => {
      // Create a custom schema with tables
      await db.execute(sql`CREATE SCHEMA plugin_test`);

      await db.execute(sql`
        CREATE TABLE plugin_test.settings (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await db.execute(sql`
        CREATE TABLE plugin_test.logs (
          id SERIAL PRIMARY KEY,
          level TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Introspect the custom schema
      const snapshot = await introspector.introspectSchema("plugin_test");

      // Verify the snapshot
      expect(Object.keys(snapshot.tables)).toHaveLength(2);
      expect(snapshot.tables["plugin_test.settings"]).toBeDefined();
      expect(snapshot.tables["plugin_test.logs"]).toBeDefined();

      // Verify schema is set correctly
      const settingsTable = snapshot.tables["plugin_test.settings"];
      expect(settingsTable.schema).toBe("plugin_test");
      expect(settingsTable.name).toBe("settings");
    });

    it("should handle check constraints during introspection", async () => {
```