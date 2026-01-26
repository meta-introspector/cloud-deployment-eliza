# a7046c18:packages_plugin-sql_src___tests___integration_postgres_pg-adapter-integration.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/pg-adapter-integration.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import type { UUID } from "@elizaos/core";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { DatabaseMigrationService } from "../../../migration-service";
import { PgliteDatabaseAdapter } from "../../../pglite/adapter";
import { PGliteClientManager } from "../../../pglite/manager";
import * as schema from "../../../schema";

describe("PostgreSQL Adapter Direct Integration Tests", () => {
  describe("PostgreSQL Adapter Direct Tests", () => {
    let adapter: PgliteDatabaseAdapter;
    let manager: PGliteClientManager;
    let testAgentId: UUID;

    beforeAll(async () => {
      testAgentId = uuidv4() as UUID;
      const client = new PGlite();
      manager = new PGliteClientManager(client);
      adapter = new PgliteDatabaseAdapter(testAgentId, manager);
      await adapter.init();

      // Run migrations
      const migrationService = new DatabaseMigrationService();
      const db = adapter.getDatabase();
      await migrationService.initializeWithDatabase(db);
      migrationService.discoverAndRegisterPluginSchemas([
        { name: "@elizaos/plugin-sql", description: "SQL plugin", schema },
      ]);
      await migrationService.runAllPluginMigrations();
    });

    afterAll(async () => {
      // Clean up test data
      const db = adapter.getDatabase();
      await db.execute(sql`DELETE FROM agents WHERE id = ${testAgentId}`);
      await adapter.close();
    });

    describe("Initialization and Connection", () => {
      it("should initialize adapter successfully", () => {
        expect(adapter).toBeDefined();
        expect(adapter.getDatabase()).toBeDefined();
      });

      it("should test connection through adapter", async () => {
        const isReady = await adapter.isReady();
        expect(isReady).toBe(true);
      });

      it("should get database instance", () => {
        const db = adapter.getDatabase();
        expect(db).toBeDefined();
        expect(db.execute).toBeDefined();
      });

      it("should check if adapter is ready", async () => {
        const isReady = await adapter.isReady();
        expect(isReady).toBe(true);
      });
    });

    describe("Raw Database Operations", () => {
      it("should execute raw SQL through adapter database", async () => {
        const db = adapter.getDatabase();

        const result = await db.execute(sql`SELECT 1 as value`);

        expect(result).toBeDefined();
        expect(result.rows).toBeDefined();
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]).toEqual({ value: 1 });
      });

      it("should handle transactions through adapter", async () => {
        const db = adapter.getDatabase();

        // Create test table
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS pg_adapter_test (
            id SERIAL PRIMARY KEY,
            value INTEGER
          )
        `);

        try {
          // Test transaction
          await db.transaction(async (tx) => {
            await tx.execute(
              sql`INSERT INTO pg_adapter_test (value) VALUES (100)`,
            );
            await tx.execute(
              sql`INSERT INTO pg_adapter_test (value) VALUES (200)`,
            );
          });

          const result = await db.execute(sql`
            SELECT SUM(value) as total FROM pg_adapter_test
          `);

          expect(Number(result.rows[0].total)).toBe(300);
        } finally {
          // Clean up
          await db.execute(sql`DROP TABLE IF EXISTS pg_adapter_test`);
        }
      });
    });

    describe("Agent Operations", () => {
      it("should create an agent", async () => {
        const created = await adapter.createAgent({
          id: testAgentId,
          name: "PG Direct Test Agent",
          bio: "Test agent for PostgreSQL direct tests",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        expect(created).toBe(true);
      });

      it("should retrieve the created agent", async () => {
        const agent = await adapter.getAgent(testAgentId);

        expect(agent).toBeDefined();
        expect(agent?.id).toBe(testAgentId);
        expect(agent?.name).toBe("PG Direct Test Agent");
      });

      it("should update agent settings", async () => {
        const updated = await adapter.updateAgent(testAgentId, {
          settings: {
            theme: "dark",
            language: "en",
          },
        });

        expect(updated).toBe(true);

        const agent = await adapter.getAgent(testAgentId);
        expect(agent?.settings).toEqual({
          theme: "dark",
          language: "en",
        });
      });
    });

    describe("Connection Manager Features", () => {
      it("should get connection from manager", () => {
```