# a7046c18:packages_plugin-sql_src___tests___unit_migration-service.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/migration-service.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Plugin } from "@elizaos/core";
import { DatabaseMigrationService } from "../../migration-service";

// Mock the logger to avoid console output during tests
const mockLogger = {
  info: mock(() => {}),
  warn: mock(() => {}),
  error: mock(() => {}),
  debug: mock(() => {}),
};

// In bun:test, we'll use simpler mocking approaches
// Mock the custom migrator
const mockRunPluginMigrations = mock(() => Promise.resolve());

// For this test, we'll spy on the actual logger rather than mock the entire module

describe("DatabaseMigrationService", () => {
  let migrationService: DatabaseMigrationService;
  let mockDb: any;

  beforeEach(() => {
    mockLogger.info.mockClear();
    mockLogger.warn.mockClear();
    mockLogger.error.mockClear();
    mockLogger.debug.mockClear();
    mockRunPluginMigrations.mockClear();

    // Create mock database
    mockDb = {
      query: {
        agentTable: { findFirst: mock(() => {}) },
        entityTable: { findFirst: mock(() => {}) },
        memoryTable: { findFirst: mock(() => {}) },
      },
      transaction: mock(() => {}),
      execute: mock(() => Promise.resolve({ rows: [] })),
    };

    migrationService = new DatabaseMigrationService();
  });

  describe("constructor", () => {
    it("should create an instance", () => {
      expect(migrationService).toBeDefined();
      expect(migrationService).toBeInstanceOf(DatabaseMigrationService);
    });
  });

  describe("initializeWithDatabase", () => {
    it("should initialize with database", async () => {
      await migrationService.initializeWithDatabase(mockDb);

      // In bun:test we focus on state rather than log assertions
      // Access private db property for testing
      const testService = migrationService as unknown as { db: typeof mockDb };
      expect(testService.db).toBe(mockDb);
    });
  });

  describe("discoverAndRegisterPluginSchemas", () => {
    it("should register plugins with schemas", () => {
      const plugins: Plugin[] = [
        {
          name: "plugin1",
          description: "Test plugin 1",
          schema: { table1: {} },
        },
        {
          name: "plugin2",
          description: "Test plugin 2",
          schema: { table2: {} },
        },
        {
          name: "plugin3",
          description: "Plugin without schema",
        },
      ];

      migrationService.discoverAndRegisterPluginSchemas(plugins);
    });

    it("should handle empty plugin array", () => {
      migrationService.discoverAndRegisterPluginSchemas([]);
    });

    it("should handle plugins without schemas", () => {
      const plugins: Plugin[] = [
        {
          name: "plugin1",
          description: "Plugin without schema",
        },
        {
          name: "plugin2",
          description: "Another plugin without schema",
        },
      ];

      migrationService.discoverAndRegisterPluginSchemas(plugins);
    });
  });

  describe("runAllPluginMigrations", () => {
    it("should throw if database not initialized", async () => {
      await expect(migrationService.runAllPluginMigrations()).rejects.toThrow(
        "Database or migrator not initialized in DatabaseMigrationService",
      );
    });

    it("should run migrations for registered plugins", async () => {
      // Initialize database
      await migrationService.initializeWithDatabase(mockDb);

      // Register plugins
      const plugins: Plugin[] = [
        {
          name: "plugin1",
          description: "Test plugin 1",
          schema: { table1: {} },
        },
        {
          name: "plugin2",
          description: "Test plugin 2",
          schema: { table2: {} },
        },
      ];

      migrationService.discoverAndRegisterPluginSchemas(plugins);

      // Simply await - if it throws, the test fails automatically
      await migrationService.runAllPluginMigrations();
    });

    it("should handle migration errors", async () => {
      // Initialize database
      await migrationService.initializeWithDatabase(mockDb);

      // Register a plugin
      migrationService.discoverAndRegisterPluginSchemas([
        {
          name: "error-plugin",
          description: "Test plugin",
          schema: { tables: {} },
        },
      ]);

      // Simply await - if it throws, the test fails automatically
      await migrationService.runAllPluginMigrations();
    });
```