# a7046c18:packages_plugin-sql_src___tests___unit_pglite_adapter.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/pglite/adapter.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, type Mock, mock } from "bun:test";
import type { UUID } from "@elizaos/core";
import { PgliteDatabaseAdapter } from "../../../pglite/adapter";
import type { PGliteClientManager } from "../../../pglite/manager";

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
interface TestablePgliteAdapter extends PgliteDatabaseAdapter {
  agentId: UUID;
  manager: PGliteClientManager;
  embeddingDimension: string;
}

describe("PgliteDatabaseAdapter", () => {
  let adapter: PgliteDatabaseAdapter;
  let mockManager: Partial<PGliteClientManager>;
  const agentId = "00000000-0000-0000-0000-000000000000" as UUID;

  beforeEach(() => {
    // Clear mocks before each test
    (logger.debug as Mock).mockClear();
    (logger.info as Mock).mockClear();
    (logger.warn as Mock).mockClear();
    (logger.error as Mock).mockClear();

    // Create a mock manager
    mockManager = {
      getConnection: mock().mockReturnValue({
        query: mock().mockResolvedValue({ rows: [] }),
        close: mock().mockResolvedValue(undefined),
        transaction: mock(),
      }),
      close: mock().mockResolvedValue(undefined),
      isShuttingDown: mock().mockReturnValue(false),
    };

    adapter = new PgliteDatabaseAdapter(
      agentId,
      mockManager as PGliteClientManager,
    );
  });

  describe("constructor", () => {
    it("should initialize with correct agentId and manager", () => {
      expect(adapter).toBeDefined();
      const testAdapter = adapter as unknown as TestablePgliteAdapter;
      expect(testAdapter.agentId).toBe(agentId);
      expect(testAdapter.manager).toBe(mockManager);
    });

    it("should set embeddingDimension to default 384", () => {
      const testAdapter = adapter as unknown as TestablePgliteAdapter;
      expect(testAdapter.embeddingDimension).toBe("dim384");
    });
  });

  describe("init", () => {
    it("should complete initialization", async () => {
      await adapter.init();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: "plugin:sql" },
        "PGliteDatabaseAdapter initialized",
      );
    });
  });

  describe("close", () => {
    it("should close the manager", async () => {
      await adapter.close();
      expect(mockManager.close).toHaveBeenCalled();
    });
  });

  describe("isReady", () => {
    it("should return true when manager is not shutting down", async () => {
      mockManager.isShuttingDown.mockReturnValue(false);
      const result = await adapter.isReady();
      expect(result).toBe(true);
    });

    it("should return false when manager is shutting down", async () => {
      mockManager.isShuttingDown.mockReturnValue(true);
      const result = await adapter.isReady();
      expect(result).toBe(false);
    });
  });

  describe("getConnection", () => {
    it("should return the connection from manager", async () => {
      const mockConnection = { query: mock(), close: mock() };
      mockManager.getConnection.mockReturnValue(mockConnection);

      const result = await adapter.getConnection();
      expect(result).toBe(mockConnection);
      expect(mockManager.getConnection).toHaveBeenCalled();
    });
  });

  describe("database operations", () => {
    it("should use the connection from manager for operations", () => {
      const mockConnection = mockManager.getConnection();
      expect(mockConnection).toBeDefined();
      expect(mockConnection.query).toBeDefined();
      expect(mockConnection.transaction).toBeDefined();
    });

    it("should handle query errors gracefully", async () => {
      const mockConnection = {
        query: mock().mockRejectedValue(new Error("Query failed")),
      };
      mockManager.getConnection.mockReturnValue(mockConnection);

      const connection = await adapter.getConnection();
      await expect(connection.query("SELECT 1")).rejects.toThrow(
        "Query failed",
      );
    });
  });

  describe("withDatabase shutdown handling", () => {
    it("should throw error instead of returning null when database is shutting down", async () => {
      // Create adapter with manager that is shutting down
      const shuttingDownManager = {
        getConnection: mock().mockReturnValue({
          query: mock().mockResolvedValue({ rows: [] }),
          close: mock().mockResolvedValue(undefined),
          transaction: mock(),
        }),
        close: mock().mockResolvedValue(undefined),
        isShuttingDown: mock().mockReturnValue(true),
      } as PGliteClientManager;

      const shuttingDownAdapter = new PgliteDatabaseAdapter(
        agentId,
        shuttingDownManager,
      );

      // Attempt operation during shutdown should throw
```