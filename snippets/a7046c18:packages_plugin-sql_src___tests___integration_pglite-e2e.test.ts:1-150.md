# a7046c18:packages_plugin-sql_src___tests___integration_pglite-e2e.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/pglite-e2e.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import type {
  Agent,
  ChannelType,
  Component,
  Entity,
  Memory,
  UUID,
} from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import { DatabaseMigrationService } from "../../migration-service";
import { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { PGliteClientManager } from "../../pglite/manager";
import * as schema from "../../schema";
import type { DrizzleDatabase } from "../../types";

// Use PGLite for testing instead of real PostgreSQL
describe("PostgreSQL E2E Tests", () => {
  const createTestAdapter = async () => {
    const client = new PGlite();
    const manager = new PGliteClientManager(client);
    const agentId = uuidv4() as UUID;
    const adapter = new PgliteDatabaseAdapter(agentId, manager);
    await adapter.init();

    // Run migrations for each adapter
    const migrationService = new DatabaseMigrationService();
    const db = adapter.getDatabase();
    await migrationService.initializeWithDatabase(db as DrizzleDatabase);
    migrationService.discoverAndRegisterPluginSchemas([
      { name: "@elizaos/plugin-sql", description: "SQL plugin", schema },
    ]);
    await migrationService.runAllPluginMigrations();

    return { adapter, agentId };
  };

  describe("Connection Management", () => {
    it("should test connection successfully", async () => {
      const { adapter } = await createTestAdapter();

      const isReady = await adapter.isReady();
      expect(isReady).toBe(true);

      await adapter.close();
    });

    it("should get connection", async () => {
      const { adapter } = await createTestAdapter();

      const connection = await adapter.getConnection();
      expect(connection).toBeDefined();

      await adapter.close();
    });
  });

  describe("Agent Operations", () => {
    it("should create and retrieve an agent", async () => {
      const { adapter, agentId } = await createTestAdapter();

      const agent: Partial<Agent> = {
        id: agentId,
        name: "Test Agent",
        settings: {
          apiKey: "test-key",
          model: "gpt-4",
        },
      };

      const created = await adapter.createAgent(agent as Agent);
      expect(created).toBe(true);

      const retrieved = await adapter.getAgent(agentId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe("Test Agent");
      expect(retrieved?.settings).toEqual(agent.settings!);

      await adapter.close();
    });

    it("should update an agent", async () => {
      const { adapter, agentId } = await createTestAdapter();

      const agent: Partial<Agent> = {
        id: agentId,
        name: "Original Name",
      };

      await adapter.createAgent(agent as Agent);

      const updated = await adapter.updateAgent(agentId, {
        name: "Updated Name",
        settings: { newSetting: "value" },
      });

      expect(updated).toBe(true);

      const retrieved = await adapter.getAgent(agentId);
      expect(retrieved?.name).toBe("Updated Name");
      expect(retrieved?.settings?.newSetting).toBe("value");

      await adapter.close();
    });

    it("should delete an agent", async () => {
      const { adapter, agentId } = await createTestAdapter();

      const agent: Partial<Agent> = {
        id: agentId,
        name: "To Delete",
      };

      await adapter.createAgent(agent as Agent);
      const deleted = await adapter.deleteAgent(agentId);
      expect(deleted).toBe(true);

      const retrieved = await adapter.getAgent(agentId);
      expect(retrieved).toBeNull();

      await adapter.close();
    });
  });

  describe("Entity Operations", () => {
    it("should create and retrieve entities", async () => {
      const { adapter, agentId } = await createTestAdapter();

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      const entities: Entity[] = [
        {
          id: uuidv4() as UUID,
          agentId,
          names: ["Entity One"],
          metadata: { custom: "data" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          names: ["Entity Two"],
          metadata: { custom: "data" },
        },
      ];

```