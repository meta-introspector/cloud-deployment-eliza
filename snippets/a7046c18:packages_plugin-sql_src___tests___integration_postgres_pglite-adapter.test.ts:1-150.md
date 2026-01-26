# a7046c18:packages_plugin-sql_src___tests___integration_postgres_pglite-adapter.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/pglite-adapter.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import type { UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import { DatabaseMigrationService } from "../../../migration-service";
import { PgliteDatabaseAdapter } from "../../../pglite/adapter";
import { PGliteClientManager } from "../../../pglite/manager";
import * as schema from "../../../schema";

describe("PostgreSQL Adapter Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter;
  let manager: PGliteClientManager;
  let cleanup: () => Promise<void>;
  let agentId: UUID;

  beforeEach(async () => {
    agentId = uuidv4() as UUID;
    const client = new PGlite();
    manager = new PGliteClientManager(client);
    adapter = new PgliteDatabaseAdapter(agentId, manager);
    await adapter.init();

    // Run migrations
    const migrationService = new DatabaseMigrationService();
    const db = adapter.getDatabase();
    await migrationService.initializeWithDatabase(db);
    migrationService.discoverAndRegisterPluginSchemas([
      { name: "@elizaos/plugin-sql", description: "SQL plugin", schema },
    ]);
    await migrationService.runAllPluginMigrations();

    cleanup = async () => {
      await adapter.close();
    };
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Connection Management", () => {
    it("should initialize successfully", async () => {
      const isReady = await adapter.isReady();
      expect(isReady).toBe(true);
    });

    it("should get database connection", async () => {
      const connection = await adapter.getConnection();
      expect(connection).toBeDefined();
    });

    it("should close connection gracefully", async () => {
      await adapter.close();

      // Should not throw
      expect(true).toBe(true);
    });

    it("should handle isReady when adapter is closed", async () => {
      await adapter.close();
      const isReady = await adapter.isReady();
      expect(isReady).toBe(false);
    });
  });

  describe("Database Operations", () => {
    it("should perform withDatabase operation", async () => {
      const result = await (adapter as any).withDatabase(async () => {
        // Simple operation to test
        return "success";
      });

      expect(result).toBe("success");
    });

    it("should handle withDatabase errors", async () => {
      let errorCaught = false;
      try {
        await (adapter as any).withDatabase(async () => {
          throw new Error("Test error");
        });
      } catch (error) {
        errorCaught = true;
        expect((error as Error).message).toBe("Test error");
      }

      expect(errorCaught).toBe(true);
    });

    it("should handle database operations", async () => {
      // Test a simple database operation
      const result = await (adapter as any).withDatabase(async () => {
        return { status: "ok" };
      });

      expect(result).toEqual({ status: "ok" });
    });

    it("should propagate errors from database operations", async () => {
      let errorCaught = false;

      try {
        await (adapter as any).withDatabase(async () => {
          throw new Error("Database operation failed");
        });
      } catch (error) {
        errorCaught = true;
        expect((error as Error).message).toBe("Database operation failed");
      }

      expect(errorCaught).toBe(true);
    });
  });

  describe("Manager Operations", () => {
    it("should get connection instance", () => {
      const connection = manager.getConnection();
      expect(connection).toBeDefined();
    });

    it("should check if shutting down", () => {
      const isShuttingDown = manager.isShuttingDown();
      expect(isShuttingDown).toBe(false);
    });

    it("should handle close operation", async () => {
      await manager.close();
      const isShuttingDown = manager.isShuttingDown();
      expect(isShuttingDown).toBe(true);
    });

    it("should test connection through adapter", async () => {
      const isReady = await adapter.isReady();
      expect(isReady).toBe(true);
    });

    it("should handle connection errors", async () => {
      // Close the adapter
      await adapter.close();

      // Now try to check if ready
      const isReady = await adapter.isReady();
      expect(isReady).toBe(false);
    });

    it("should handle query failures", async () => {
      // PGLite adapter init doesn't actually run queries, so we test a different operation
      const mockClient = new PGlite();
```