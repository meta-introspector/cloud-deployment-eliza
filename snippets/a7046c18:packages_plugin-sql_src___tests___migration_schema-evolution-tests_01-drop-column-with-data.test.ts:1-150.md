# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_01-drop-column-with-data.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/01-drop-column-with-data.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
// Import the ACTUAL production schemas
import { agentTable } from "../../../schema/agent";
import { cacheTable } from "../../../schema/cache";
import { channelTable } from "../../../schema/channel";
import { channelParticipantsTable } from "../../../schema/channelParticipant";
import { componentTable } from "../../../schema/component";
import { embeddingTable } from "../../../schema/embedding";
import { entityTable } from "../../../schema/entity";
import { logTable } from "../../../schema/log";
import { memoryTable } from "../../../schema/memory";
import { messageTable } from "../../../schema/message";
import { messageServerTable } from "../../../schema/messageServer";
import { messageServerAgentsTable } from "../../../schema/messageServerAgent";
import { participantTable } from "../../../schema/participant";
import { relationshipTable } from "../../../schema/relationship";
import { roomTable } from "../../../schema/room";
import { taskTable } from "../../../schema/tasks";
import { worldTable } from "../../../schema/world";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

/**
 * Schema Evolution Test 1: Dropping Columns from Production Schema
 *
 * This test uses the ACTUAL elizaOS production schemas to verify
 * that schema evolution properly handles column drops with real data.
 */

describe("Schema Evolution Test: Drop Column with Production Schema", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  // Full production schema as it exists today
  const getFullSchemaV1 = () => ({
    agents: agentTable,
    memories: memoryTable,
    entities: entityTable,
    relationships: relationshipTable,
    rooms: roomTable,
    worlds: worldTable,
    participants: participantTable,
    messages: messageTable,
    messageServers: messageServerTable,
    channels: channelTable,
    channelParticipants: channelParticipantsTable,
    components: componentTable,
    embeddings: embeddingTable,
    logs: logTable,
    cache: cacheTable,
    tasks: taskTable,
    messageServerAgents: messageServerAgentsTable,
  });

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_drop_column_test",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should handle dropping username column from agents table with production data", async () => {
    // Apply the full production schema
    const schemaV1 = getFullSchemaV1();

    console.log("🚀 Migrating full production schema V1...");
    await migrator.migrate("@elizaos/production-schema-v1", schemaV1);

    // Insert production-like data into multiple related tables
    console.log("\n📝 Inserting production data...");

    // Insert agents with username field
    await db.insert(agentTable).values([
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Agent Alpha",
        username: "alpha_bot", // This field will be dropped
        bio: [
          "Expert in natural language processing",
          "Specialized in customer support",
        ],
        enabled: true,
        system: "You are a helpful assistant",
        messageExamples: [],
        postExamples: [],
        topics: ["technology", "support"],
        adjectives: ["helpful", "knowledgeable"],
        knowledge: [],
        plugins: ["bootstrap", "sql"],
        settings: { secrets: {} },
        style: { all: ["professional", "friendly"] },
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Agent Beta",
        username: "beta_bot", // This field will be dropped
        bio: ["Data analysis specialist"],
        enabled: true,
        system: "You are a data analyst",
        messageExamples: [],
        postExamples: [],
        topics: ["data", "analytics"],
        adjectives: ["analytical", "precise"],
        knowledge: [],
        plugins: ["bootstrap"],
        settings: {},
        style: {},
      },
    ]);

    // Insert related entities
    await db.insert(entityTable).values([
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        agentId: "550e8400-e29b-41d4-a716-446655440001",
        names: ["User One"],
        metadata: { role: "admin", type: "user" },
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440002",
        agentId: "550e8400-e29b-41d4-a716-446655440002",
        names: ["User Two"],
        metadata: { role: "member", type: "user" },
      },
    ]);

    // Insert memories linked to agents
    await db.insert(memoryTable).values([
      {
        id: "770e8400-e29b-41d4-a716-446655440001",
        agentId: "550e8400-e29b-41d4-a716-446655440001",
        entityId: "660e8400-e29b-41d4-a716-446655440001",
        type: "conversation",
        content: {
          text: "Important customer interaction",
          sentiment: "positive",
        },
```