# a7046c18:packages_plugin-sql_src___tests___migration_data-persistence.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/data-persistence.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { RuntimeMigrator } from "../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../runtime-migrator/types";

/**
 * Comprehensive data persistence tests to ensure data is never lost
 * during migrations, even in complex scenarios
 */
describe("Data Persistence Through Migrations", () => {
  let pgClient: PGlite;
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;

  beforeEach(async () => {
    pgClient = new PGlite({ extensions: { vector } });
    db = drizzle(pgClient);
    migrator = new RuntimeMigrator(db);
    await migrator.initialize();
  });

  afterEach(async () => {
    await pgClient.close();
  });

  describe("Critical Data Persistence Scenarios", () => {
    it("should preserve ALL data through column additions", async () => {
      // Step 1: Create a table with production data
      await db.execute(sql`
        CREATE TABLE customers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert significant amount of data
      const customerData: Array<{ id: number; name: string; email: string }> =
        [];
      for (let i = 1; i <= 100; i++) {
        customerData.push({
          id: i,
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
        });
      }

      for (const customer of customerData) {
        await db.execute(sql`
          INSERT INTO customers (name, email) 
          VALUES (${customer.name}, ${customer.email})
        `);
      }

      // Verify initial data
      const initialCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM customers`,
      );
      expect(Number(initialCount.rows[0].count)).toBe(100);

      // Step 2: Define schema with new columns
      const customersTable = pgTable("customers", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        created_at: timestamp("created_at").defaultNow(),
        // New columns
        phone: varchar("phone", { length: 20 }),
        address: text("address"),
        is_active: boolean("is_active").default(true),
        metadata: jsonb("metadata"),
      });

      const schema = { customers: customersTable };

      // Step 3: Run migration with force to allow type changes
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Step 4: Verify ALL data is preserved
      const afterMigration = await db.execute(sql`
        SELECT * FROM customers 
        ORDER BY id
      `);

      expect(afterMigration.rows).toHaveLength(100);

      // Verify each record
      for (let i = 0; i < 100; i++) {
        const row = afterMigration.rows[i];
        expect(row.id).toBe(i + 1);
        expect(row.name).toBe(`Customer ${i + 1}`);
        expect(row.email).toBe(`customer${i + 1}@example.com`);
        expect(row.created_at).toBeDefined();
        // New columns should have defaults
        expect(row.is_active).toBe(true);
        expect(row.phone).toBeNull();
        expect(row.address).toBeNull();
        expect(row.metadata).toBeNull();
      }

      // Step 5: Verify migration metadata is correct
      const status = await migrator.getStatus("@elizaos/plugin-sql");
      expect(status.hasRun).toBe(true);
      expect(status.snapshots).toBeGreaterThan(0);
      expect(status.journal).toBeDefined();
      expect(status.journal?.entries).toHaveLength(2); // One for introspection, one for migration
    });

    it("should preserve data through column type changes that are safe", async () => {
      // Create table with numeric data
      await db.execute(sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL,
          stock INTEGER DEFAULT 0
        )
      `);

      // Insert product data
      const products = [
        { name: "Product A", price: 1999, stock: 100 },
        { name: "Product B", price: 2999, stock: 50 },
        { name: "Product C", price: 3999, stock: 25 },
        { name: "Product D", price: 4999, stock: 10 },
        { name: "Product E", price: 5999, stock: 5 },
      ];

      for (const product of products) {
        await db.execute(sql`
          INSERT INTO products (name, price, stock) 
```