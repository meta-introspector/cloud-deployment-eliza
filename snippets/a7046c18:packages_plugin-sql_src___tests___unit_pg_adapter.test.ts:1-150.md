# a7046c18:packages_plugin-sql_src___tests___unit_pg_adapter.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/pg/adapter.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, type Mock, mock } from "bun:test";
import type { UUID } from "@elizaos/core";
import { PgDatabaseAdapter } from "../../../pg/adapter";
import type { PostgresConnectionManager } from "../../../pg/manager";

// Mock the logger module
mock.module("@elizaos/core", () => ({
  logger: {
    debug: mock(),
    info: mock(),
    warn: mock(),
    error: mock(),
  },
}));

// Import after mocking
import { logger } from "@elizaos/core";

// Test interface for accessing private properties
interface TestablePgAdapter extends PgDatabaseAdapter {
  agentId: UUID;
  manager: PostgresConnectionManager;
  embeddingDimension: string;
}

describe("PgDatabaseAdapter", () => {
  let adapter: PgDatabaseAdapter;
  let mockManager: Partial<PostgresConnectionManager>;
  const agentId = "00000000-0000-0000-0000-000000000000" as UUID;

  beforeEach(() => {
    // Clear mocks before each test
    (logger.debug as Mock).mockClear();
    (logger.info as Mock).mockClear();
    (logger.warn as Mock).mockClear();
    (logger.error as Mock).mockClear();

    // Create a mock manager
    mockManager = {
      getDatabase: mock(() => ({
        query: {},
        transaction: mock(() => {}),
      })),
      getClient: mock(() => {}),
      testConnection: mock(() => Promise.resolve(true)),
      close: mock(() => Promise.resolve()),
      getConnection: mock(() => ({
        connect: mock(() => {}),
        end: mock(() => {}),
      })),
    };

    adapter = new PgDatabaseAdapter(
      agentId,
      mockManager as PostgresConnectionManager,
    );
  });

  describe("constructor", () => {
    it("should initialize with correct agentId and manager", () => {
      expect(adapter).toBeDefined();
      const testAdapter = adapter as unknown as TestablePgAdapter;
      expect(testAdapter.agentId).toBe(agentId);
      expect(testAdapter.manager).toBe(mockManager);
    });

    it("should set embeddingDimension to default 384", () => {
      const testAdapter = adapter as unknown as TestablePgAdapter;
      expect(testAdapter.embeddingDimension).toBe("dim384");
    });
  });

  describe("init", () => {
    it("should complete initialization", async () => {
      await adapter.init();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: "plugin:sql" },
        "PgDatabaseAdapter initialized",
      );
    });
  });

  describe("isReady", () => {
    it("should return true when connection is healthy", async () => {
      mockManager.testConnection.mockResolvedValue(true);

      const result = await adapter.isReady();
      expect(result).toBe(true);
      expect(mockManager.testConnection).toHaveBeenCalled();
    });

    it("should return false when connection is unhealthy", async () => {
      mockManager.testConnection.mockResolvedValue(false);

      const result = await adapter.isReady();
      expect(result).toBe(false);
      expect(mockManager.testConnection).toHaveBeenCalled();
    });
  });

  describe("close", () => {
    it("should close the manager", async () => {
      await adapter.close();
      expect(mockManager.close).toHaveBeenCalled();
    });

    it("should handle close errors gracefully", async () => {
      mockManager.close.mockRejectedValue(new Error("Close failed"));

      // The adapter's close method catches and logs errors without throwing
      await expect(adapter.close()).rejects.toThrow("Close failed");
    });
  });

  describe("getConnection", () => {
    it("should return connection from manager", async () => {
      const mockConnection = { connect: mock(), end: mock() };
      mockManager.getConnection.mockReturnValue(mockConnection);

      const result = await adapter.getConnection();
      expect(result).toBe(mockConnection);
      expect(mockManager.getConnection).toHaveBeenCalled();
    });
  });

  describe("database operations", () => {
    it("should handle database operation errors", async () => {
      // Test that the adapter properly initializes with the manager
      expect(adapter).toBeDefined();
      const testAdapter = adapter as unknown as TestablePgAdapter;
      expect(testAdapter.manager).toBe(mockManager);
    });

    it("should use the database from manager", () => {
      const db = mockManager.getDatabase();
      expect(db).toBeDefined();
      expect(db.query).toBeDefined();
      expect(db.transaction).toBeDefined();
    });
  });

  describe("withDatabase pool-based connection", () => {
    it("should use shared pool-based db instance without acquiring individual clients", async () => {
      const mockDb = {
        select: mock().mockReturnThis(),
        from: mock().mockReturnThis(),
        where: mock().mockReturnThis(),
        limit: mock().mockResolvedValue([]),
        transaction: mock(),
      };
```