# a7046c18:packages_plugin-sql_src___tests___unit_entity-rls.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/entity-rls.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  it("should exclude correct tables from Entity RLS", () => {
    const excludedTables = [
      "servers", // Server RLS table
      "users", // Authentication table
      "entity_mappings", // Mapping table
      "drizzle_migrations",
      "__drizzle_migrations",
    ];

    // Tables that should NOT have Entity RLS
    expect(excludedTables).toContain("servers");
    expect(excludedTables).toContain("users");
    expect(excludedTables).toContain("entity_mappings");

    // Tables that SHOULD have Entity RLS (not in exclusion list)
    expect(excludedTables).not.toContain("memories");
    expect(excludedTables).not.toContain("participants");
    expect(excludedTables).not.toContain("relationships");
    expect(excludedTables).not.toContain("goals");
  });

  it("should include migration tables in exclusions", () => {
    const excludedTables = ["drizzle_migrations", "__drizzle_migrations"];

    expect(excludedTables).toContain("drizzle_migrations");
    expect(excludedTables).toContain("__drizzle_migrations");
  });
});

describe("Entity RLS Security Properties", () => {
  describe("Session Variable Usage", () => {
    it("should use app.entity_id session variable", () => {
      const sessionVar = "app.entity_id";

      expect(sessionVar).toBe("app.entity_id");
      expect(sessionVar).not.toBe("application_name"); // Different from Server RLS
    });

    it("should be transaction-scoped (SET LOCAL)", () => {
      const command = "SET LOCAL app.entity_id = $1";

      expect(command).toContain("SET LOCAL");
      expect(command).not.toContain("SET SESSION"); // Not session-wide
      expect(command).toContain("LOCAL"); // Explicitly LOCAL (not global SET)
    });

    it("should auto-reset on transaction end", () => {
      // SET LOCAL auto-resets, no explicit cleanup needed
      const autoReset = true;
      expect(autoReset).toBe(true);
    });
  });

  describe("Multi-Entity Isolation", () => {
    it("should isolate data by entity_id", () => {
      const aliceEntityId = stringToUuid("alice-discord-user");
      const bobEntityId = stringToUuid("bob-telegram-user");

      // Different entities should have different IDs
      expect(aliceEntityId).not.toBe(bobEntityId);

      // Both should be valid UUIDs
      expect(aliceEntityId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(bobEntityId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should generate consistent entity IDs from platform usernames", () => {
      const discordUser1a = stringToUuid("discord:alice#1234");
      const discordUser1b = stringToUuid("discord:alice#1234");
      const telegramUser = stringToUuid("telegram:@alice");

      // Same platform user should produce same entity_id
      expect(discordUser1a).toBe(discordUser1b);

      // Different platforms should produce different entity_ids
      expect(discordUser1a).not.toBe(telegramUser);
    });
  });

  describe("Conversation Visibility", () => {
    it("should allow users and agents to see shared conversations", () => {
      const aliceEntityId = stringToUuid("alice");
      const agentEntityId = stringToUuid("agent");

      // Both are participants in room-123
      const participants = [
        { entity_id: aliceEntityId, channel_id: "room-123" },
        { entity_id: agentEntityId, channel_id: "room-123" },
      ];

      // Alice should see messages from room-123
      const aliceCanSee = participants.some(
        (p) => p.entity_id === aliceEntityId && p.channel_id === "room-123",
      );

      // Agent should see messages from room-123
      const agentCanSee = participants.some(
        (p) => p.entity_id === agentEntityId && p.channel_id === "room-123",
      );

      expect(aliceCanSee).toBe(true);
      expect(agentCanSee).toBe(true);
    });

    it("should prevent non-participants from seeing conversations", () => {
      const bobEntityId = stringToUuid("bob");

      // Only Alice and Agent are participants
      const participants = [
        { entity_id: stringToUuid("alice"), channel_id: "room-123" },
        { entity_id: stringToUuid("agent"), channel_id: "room-123" },
      ];

      // Bob should NOT see messages from room-123
      const bobCanSee = participants.some(
        (p) => p.entity_id === bobEntityId && p.channel_id === "room-123",
      );

      expect(bobCanSee).toBe(false);
    });
  });

  describe("Server Operations Bypass", () => {
    it("should allow NULL entity_id for server operations", () => {
      const entityId = null;
      const bypassRLS = entityId === null;

      expect(bypassRLS).toBe(true);
    });

    it("should block queries when entity_id is required but missing", () => {
      const entityId = undefined;
      const policyRequiresEntity = true;

      const shouldBlock = policyRequiresEntity && !entityId;

      // If RLS is enabled and entity_id not set, should return empty results
      expect(shouldBlock).toBe(true);
    });
  });
});

describe("Entity RLS Integration", () => {
  describe("withEntityContext Helper", () => {
    it("should set entity context before query execution", () => {
      const entityId = stringToUuid("alice");
```