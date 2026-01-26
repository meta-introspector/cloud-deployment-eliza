# a7046c18:packages_plugin-sql_src___tests___unit_index.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/index.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  describe("Plugin Structure", () => {
    it("should have correct plugin metadata", () => {
      expect(plugin.name).toBe("@elizaos/plugin-sql");
      expect(plugin.description).toBe(
        "A plugin for SQL database access with dynamic schema migrations",
      );
      expect(plugin.priority).toBe(0);
    });

    it("should have schema defined", () => {
      expect(plugin.schema).toBeDefined();
      // Schema exports individual table definitions
      expect(plugin.schema).toHaveProperty("agentTable");
      expect(plugin.schema).toHaveProperty("entityTable");
      expect(plugin.schema).toHaveProperty("memoryTable");
    });

    it("should have init function", () => {
      expect(plugin.init).toBeDefined();
      expect(typeof plugin.init).toBe("function");
    });
  });

  describe("Plugin Initialization", () => {
    it("should skip initialization if adapter already exists", async () => {
      // Set up runtime with existing adapter using a minimal mock adapter
      const existingAdapter: IDatabaseAdapter = {
        db: {},
        init: async () => {},
        close: async () => {},
        isReady: async () => true,
        getConnection: async () => ({}),
      } as IDatabaseAdapter;
      mockRuntime.databaseAdapter = existingAdapter;

      await plugin.init?.({}, mockRuntime);

      // Logger calls aren't easily testable in bun:test without complex mocking
      // Just verify that registerDatabaseAdapter wasn't called
      expect(mockRuntime.registerDatabaseAdapter).not.toHaveBeenCalled();
    });

    it("should register database adapter when none exists", async () => {
      // Set PGLITE_DATA_DIR to temp directory to avoid directory creation issues
      process.env.PGLITE_DATA_DIR = tempDir;
      mockRuntime.getSetting = mock((key) => {
        // Return temp directory for database paths to avoid directory creation issues
        if (key === "PGLITE_DATA_DIR") {
          return tempDir;
        }
        return null;
      });

      await plugin.init?.({}, mockRuntime);

      expect(mockRuntime.registerDatabaseAdapter).toHaveBeenCalled();
    });

    it("should use POSTGRES_URL when available", async () => {
      mockRuntime.getSetting = mock((key) => {
        if (key === "POSTGRES_URL") return "postgresql://localhost:5432/test";
        return null;
      });

      await plugin.init?.({}, mockRuntime);

      expect(mockRuntime.registerDatabaseAdapter).toHaveBeenCalled();
    });

    it("should use PGLITE_DATA_DIR when provided", async () => {
      const customDir = path.join(tempDir, "custom-pglite");
      mockRuntime.getSetting = mock((key) => {
        if (key === "PGLITE_DATA_DIR") return customDir;
        return null;
      });

      await plugin.init?.({}, mockRuntime);

      expect(mockRuntime.registerDatabaseAdapter).toHaveBeenCalled();
    });

    it("should use default path if PGLITE_DATA_DIR is not set", async () => {
      mockRuntime.getSetting = mock(() => null);

      await plugin.init?.({}, mockRuntime);

      expect(mockRuntime.registerDatabaseAdapter).toHaveBeenCalled();
    });

    it("should prefer to use PGLITE_DATA_DIR when environment variable is set", async () => {
      // Set PGLITE_DATA_DIR to temp directory to avoid directory creation issues
      process.env.PGLITE_DATA_DIR = tempDir;
      mockRuntime.getSetting = mock(() => null);

      await plugin.init?.({}, mockRuntime);

      expect(mockRuntime.registerDatabaseAdapter).toHaveBeenCalled();
    });
  });

  describe("createDatabaseAdapter", () => {
    const agentId = "00000000-0000-0000-0000-000000000000";

    it("should create PgDatabaseAdapter when postgresUrl is provided", () => {
      const config = {
        postgresUrl: "postgresql://localhost:5432/test",
      };

      const adapter = createDatabaseAdapter(config, agentId);

      expect(adapter).toBeDefined();
    });

    it("should create PgliteDatabaseAdapter when no postgresUrl is provided", () => {
      // Set PGLITE_DATA_DIR to avoid directory creation issues
      process.env.PGLITE_DATA_DIR = tempDir;
      const config = {
        dataDir: path.join(tempDir, "custom-data"),
      };

      const adapter = createDatabaseAdapter(config, agentId);

      expect(adapter).toBeDefined();
    });

    it("should use default dataDir when none provided", () => {
      // Set PGLITE_DATA_DIR to avoid directory creation issues
      process.env.PGLITE_DATA_DIR = tempDir;
      const config = {};

      const adapter = createDatabaseAdapter(config, agentId);

      expect(adapter).toBeDefined();
    });

    it("should reuse singleton managers", () => {
      // Create first adapter
      const adapter1 = createDatabaseAdapter(
        { postgresUrl: "postgresql://localhost:5432/test" },
        agentId,
      );

      // Create second adapter with same config
      const adapter2 = createDatabaseAdapter(
        { postgresUrl: "postgresql://localhost:5432/test" },
        agentId,
      );

      expect(adapter1).toBeDefined();
      expect(adapter2).toBeDefined();
```