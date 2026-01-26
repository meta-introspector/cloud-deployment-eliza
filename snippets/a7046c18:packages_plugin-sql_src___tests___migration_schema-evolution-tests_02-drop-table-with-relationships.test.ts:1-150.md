# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_02-drop-table-with-relationships.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/02-drop-table-with-relationships.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

// Helper types for database query result rows

interface ExistsRow {
  exists: boolean;
}

interface StatsRow {
  agents: string | number;
  entities: string | number;
  rooms: string | number;
  memories: string | number;
  relationships: string | number;
  [key: string]: unknown;
}

// Import ALL production schemas
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

/**
 * Schema Evolution Test 2: Dropping Tables with Foreign Key Relationships
 *
 * This test uses the ACTUAL elizaOS production schemas with their
 * complex foreign key relationships to verify cascade behavior.
 */

describe("Schema Evolution Test: Drop Table with Production Relationships", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  // Full production schema
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
      "schema_evolution_drop_table_test",
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

  it("should handle dropping memories table with cascade effects on production schema", async () => {
    // Apply full production schema
    const schemaV1 = getFullSchemaV1();

    console.log("🚀 Migrating full production schema...");
    await migrator.migrate("@elizaos/production-schema-v1", schemaV1);

    // Insert interconnected production data
    console.log("\n📝 Creating interconnected production data...");

    // 1. Create agents
    const agent1Id = "550e8400-e29b-41d4-a716-446655440001";
    const agent2Id = "550e8400-e29b-41d4-a716-446655440002";

    await db.insert(agentTable).values([
      {
        id: agent1Id,
        name: "Production Agent One",
        bio: ["Customer support specialist"],
        enabled: true,
        system: "Support system prompt",
        messageExamples: [],
        postExamples: [],
        topics: ["support"],
        adjectives: ["helpful"],
        knowledge: [],
        plugins: ["bootstrap", "sql"],
        settings: {},
        style: {},
      },
      {
        id: agent2Id,
        name: "Production Agent Two",
        bio: ["Analytics agent"],
        enabled: true,
        system: "Analytics system prompt",
        messageExamples: [],
        postExamples: [],
        topics: ["analytics"],
        adjectives: ["analytical"],
        knowledge: [],
        plugins: ["bootstrap"],
        settings: {},
        style: {},
      },
    ]);

    // 2. Create entities
    const entity1Id = "660e8400-e29b-41d4-a716-446655440001";
    const entity2Id = "660e8400-e29b-41d4-a716-446655440002";

    await db.insert(entityTable).values([
      {
        id: entity1Id,
        agentId: agent1Id,
        names: ["John Doe"],
        metadata: { type: "user", verified: true },
      },
      {
        id: entity2Id,
```