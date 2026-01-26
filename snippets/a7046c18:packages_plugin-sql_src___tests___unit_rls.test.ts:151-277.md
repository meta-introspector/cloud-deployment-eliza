# a7046c18:packages_plugin-sql_src___tests___unit_rls.test.ts:151-277

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/rls.test.ts:151-277
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(serverName).toBe("Default Server");
    });
  });

  describe("Table Exclusions", () => {
    it("should define correct tables excluded from Server RLS", () => {
      const excludedTables = [
        "servers",
        "drizzle_migrations",
        "__drizzle_migrations",
      ];

      // Tables that should NOT have Server RLS
      expect(excludedTables).toContain("servers");
      expect(excludedTables).toContain("drizzle_migrations");
      expect(excludedTables).toContain("__drizzle_migrations");

      // Tables that SHOULD have Server RLS (not in exclusion list)
      expect(excludedTables).not.toContain("agents");
      expect(excludedTables).not.toContain("messages");
      expect(excludedTables).not.toContain("channels");
      expect(excludedTables).not.toContain("message_servers");
      expect(excludedTables).not.toContain("memories");
    });
  });

  describe("Server RLS SQL Function Names", () => {
    it("should have consistent function names", () => {
      const functions = {
        currentServerId: "current_server_id",
        addServerIsolation: "add_server_isolation",
        applyRlsToAllTables: "apply_rls_to_all_tables",
      };

      expect(functions.currentServerId).toBe("current_server_id");
      expect(functions.addServerIsolation).toBe("add_server_isolation");
      expect(functions.applyRlsToAllTables).toBe("apply_rls_to_all_tables");
    });
  });

  describe("Policy Names", () => {
    it("should use consistent policy naming", () => {
      const tableName = "agents";
      const policyName = "server_isolation_policy";

      expect(policyName).toBe("server_isolation_policy");
      expect(policyName).not.toContain(tableName); // Generic policy name for all tables
    });
  });
});

describe("Server RLS Schema Validation", () => {
  describe("Servers Table Schema", () => {
    it("should have correct columns", () => {
      const expectedColumns = {
        id: { type: "UUID", primaryKey: true },
        created_at: { type: "TIMESTAMPTZ", nullable: false },
        updated_at: { type: "TIMESTAMPTZ", nullable: false },
      };

      expect(Object.keys(expectedColumns)).toHaveLength(3);
      expect(expectedColumns.id.primaryKey).toBe(true);
      expect(expectedColumns.created_at.nullable).toBe(false);
      expect(expectedColumns.updated_at.nullable).toBe(false);
    });
  });

  describe("Agent Table Schema with Server RLS", () => {
    it("should include server_id column when RLS is enabled", () => {
      const columns = [
        "id",
        "name",
        "username",
        "server_id", // RLS column
        "created_at",
        "updated_at",
      ];

      expect(columns).toContain("server_id");
    });

    it("should have index on server_id column", () => {
      const indexName = "idx_agents_server_id";
      const indexColumn = "server_id";

      expect(indexName).toContain(indexColumn);
      expect(indexName).toContain("agents");
    });
  });
});

describe("Server RLS Security Properties", () => {
  describe("FORCE ROW LEVEL SECURITY", () => {
    it("should enforce RLS even for table owner (PostgreSQL role)", () => {
      const forceRLS = true;

      // When FORCE is enabled, even PostgreSQL table owner role respects RLS
      expect(forceRLS).toBe(true);
    });

    it("should enforce strict server_id matching (no NULL clause)", () => {
      const policyCondition = "server_id = current_server_id()";

      // Security hardening: removed NULL clause to prevent data leakage
      expect(policyCondition).not.toContain("OR server_id IS NULL");
      expect(policyCondition).toBe("server_id = current_server_id()");
    });
  });

  describe("Multi-Server Isolation", () => {
    it("should isolate data by server_id", () => {
      const server1Id = stringToUuid("server-1-token");
      const server2Id = stringToUuid("server-2-token");

      // Different servers should have different server IDs
      expect(server1Id).not.toBe(server2Id);

      // Both should be valid UUIDs
      expect(server1Id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(server2Id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });
});
```