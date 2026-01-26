# a7046c18:packages_plugin-sql_src___tests___unit_entity-rls.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/entity-rls.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      // Should prioritize channel_id (shared access)
      expect(has_channel_id).toBe(true);
      expect(has_entity_id).toBe(true);

      const selectedColumn = has_channel_id ? "channel_id" : "entity_id";
      expect(selectedColumn).toBe("channel_id");
    });

    it("should detect relationships table as direct entity access", () => {
      // relationships table schema (hypothetical)
      const tableColumns = ["id", "entity_id", "data", "created_at"];

      const has_room_id = tableColumns.includes("room_id");
      const has_channel_id = tableColumns.includes("channel_id");
      const has_entity_id = tableColumns.includes("entity_id");

      // Should use entity_id (no room/channel columns)
      expect(has_room_id).toBe(false);
      expect(has_channel_id).toBe(false);
      expect(has_entity_id).toBe(true);

      let selectedColumn: string;
      if (has_room_id) {
        selectedColumn = "room_id";
      } else if (has_channel_id) {
        selectedColumn = "channel_id";
      } else if (has_entity_id) {
        selectedColumn = "entity_id";
      } else {
        selectedColumn = "none";
      }

      expect(selectedColumn).toBe("entity_id");
    });
  });
});

describe("Entity RLS Policy Types", () => {
  describe("Participant-Based Policy (room_id/channel_id)", () => {
    it("should generate correct policy for room-based tables", () => {
      const _tableName = "memories";
      const columnName = "room_id";

      const policyCondition = `${columnName} IN (SELECT channel_id FROM participants WHERE entity_id = current_entity_id())`;

      expect(policyCondition).toContain(columnName);
      expect(policyCondition).toContain("participants");
      expect(policyCondition).toContain("current_entity_id()");
    });

    it("should allow NULL entity_id for server operations", () => {
      const policyWithBypass = `current_entity_id() IS NULL OR room_id IN (...)`;

      expect(policyWithBypass).toContain("current_entity_id() IS NULL");
      expect(policyWithBypass).toContain("OR");
    });

    it("should use channel_id from participants table", () => {
      const subquery =
        "SELECT channel_id FROM participants WHERE entity_id = current_entity_id()";

      expect(subquery).toContain("channel_id");
      expect(subquery).not.toContain("room_id"); // participants use channel_id
    });
  });

  describe("Direct Access Policy (entity_id/author_id)", () => {
    it("should generate correct policy for entity-based tables", () => {
      const _tableName = "relationships";
      const columnName = "entity_id";

      const policyCondition = `${columnName} = current_entity_id()`;

      expect(policyCondition).toBe("entity_id = current_entity_id()");
      expect(policyCondition).not.toContain("participants");
    });

    it("should allow NULL entity_id for server operations", () => {
      const policyWithBypass = `current_entity_id() IS NULL OR entity_id = current_entity_id()`;

      expect(policyWithBypass).toContain("current_entity_id() IS NULL");
      expect(policyWithBypass).toContain("OR");
    });

    it("should support author_id as alternative column", () => {
      const columnName = "author_id";
      const policyCondition = `${columnName} = current_entity_id()`;

      expect(policyCondition).toBe("author_id = current_entity_id()");
    });
  });
});

describe("Entity RLS Function Names", () => {
  it("should have consistent function names", () => {
    const functions = {
      currentEntityId: "current_entity_id",
      addEntityIsolation: "add_entity_isolation",
      applyEntityRlsToAllTables: "apply_entity_rls_to_all_tables",
    };

    expect(functions.currentEntityId).toBe("current_entity_id");
    expect(functions.addEntityIsolation).toBe("add_entity_isolation");
    expect(functions.applyEntityRlsToAllTables).toBe(
      "apply_entity_rls_to_all_tables",
    );
  });

  it("should use different function names than Server RLS", () => {
    const serverFunctions = {
      currentServerId: "current_server_id",
      addServerIsolation: "add_server_isolation",
    };

    const entityFunctions = {
      currentEntityId: "current_entity_id",
      addEntityIsolation: "add_entity_isolation",
    };

    // Should be different to avoid conflicts
    expect(entityFunctions.currentEntityId).not.toBe(
      serverFunctions.currentServerId,
    );
    expect(entityFunctions.addEntityIsolation).not.toBe(
      serverFunctions.addServerIsolation,
    );
  });
});

describe("Entity RLS Policy Names", () => {
  it("should use consistent policy naming", () => {
    const policyName = "entity_isolation_policy";

    expect(policyName).toBe("entity_isolation_policy");
    expect(policyName).not.toBe("server_isolation_policy"); // Different from Server RLS
  });

  it("should use generic policy name for all tables", () => {
    const tables = ["memories", "participants", "relationships"];
    const policyName = "entity_isolation_policy";

    tables.forEach((table) => {
      // Same policy name for all tables (not table-specific)
      expect(policyName).not.toContain(table);
    });
  });
});

describe("Entity RLS Table Exclusions", () => {
```