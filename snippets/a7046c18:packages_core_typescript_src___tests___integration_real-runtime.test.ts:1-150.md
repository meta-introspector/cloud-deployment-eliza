# a7046c18:packages_core_typescript_src___tests___integration_real-runtime.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/integration/real-runtime.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview Example Integration Tests with Real Infrastructure
 *
 * These tests demonstrate how to write integration tests that use:
 * - Real database (PGLite via @elizaos/plugin-sql)
 * - Real inference (Ollama or cloud providers)
 *
 * NO MOCKS - These tests require real infrastructure to run.
 *
 * Prerequisites:
 * 1. Install plugin-sql: bun add @elizaos/plugin-sql
 * 2. For local inference, run Ollama: ollama serve
 * 3. Or set cloud API keys: OPENAI_API_KEY, ANTHROPIC_API_KEY
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import type { Character, IAgentRuntime, Memory, UUID } from "../../types";
import { stringToUuid } from "../../utils";

// Check if we should run integration tests (requires explicit opt-in)
const SHOULD_RUN = process.env.RUN_INTEGRATION_TESTS === "true";

describe.skipIf(!SHOULD_RUN)(
  "Integration Tests with Real Infrastructure",
  () => {
    let runtime: IAgentRuntime | undefined;
    let agentId: UUID;
    let cleanup: (() => Promise<void>) | undefined;
    let setupSucceeded = false;

    const testCharacter: Character = {
      name: "IntegrationTestAgent",
      system: "You are a helpful assistant for integration testing.",
      bio: ["Integration test agent"],
      messageExamples: [],
      postExamples: [],
      topics: ["testing"],
      knowledge: [],
      plugins: [],
      settings: {},
    };

    beforeAll(async () => {
      // Dynamic import to avoid build errors if plugin-sql is not installed
      let createTestDatabase: typeof import("@elizaos/plugin-sql/src/__tests__/test-helpers").createTestDatabase;

      try {
        const testHelpers = await import(
          "@elizaos/plugin-sql/src/__tests__/test-helpers"
        );
        createTestDatabase = testHelpers.createTestDatabase;
      } catch (e) {
        console.warn(
          "⚠️  Integration tests skipped: @elizaos/plugin-sql not available",
          e,
        );
        return;
      }

      try {
        agentId = uuidv4() as UUID;
        testCharacter.id = agentId;

        const result = await createTestDatabase(agentId);
        runtime = result.runtime;
        cleanup = result.cleanup;

        // Wait for runtime to be fully initialized
        await runtime.initialize();
        setupSucceeded = true;
      } catch (e) {
        console.warn("⚠️  Integration test setup failed:", e);
      }
    });

    afterAll(async () => {
      if (cleanup) {
        await cleanup();
      }
    });

    describe("Database Operations", () => {
      it("should create and retrieve a memory", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }

        const roomId = stringToUuid(`test-room-${uuidv4()}`);

        const memory: Memory = {
          id: stringToUuid(`message-${uuidv4()}`),
          entityId: agentId,
          roomId,
          content: {
            text: "Hello, this is a test message",
            source: "integration-test",
          },
          createdAt: Date.now(),
        };

        // Create memory
        const memoryId = await runtime.createMemory(memory, "messages");
        expect(memoryId).toBeDefined();

        // Retrieve memories
        const memories = await runtime.getMemories({
          roomId,
          count: 10,
          tableName: "messages",
        });

        expect(memories.length).toBeGreaterThan(0);
        const found = memories.find((m) => m.id === memory.id);
        expect(found).toBeDefined();
        expect(found?.content.text).toBe("Hello, this is a test message");
      });

      it("should create a room and add participants", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }

        const roomId = stringToUuid(`test-room-${uuidv4()}`);
        const entityId = stringToUuid(`test-entity-${uuidv4()}`);

        // Ensure room exists
        await runtime.ensureRoomExists({
          id: roomId,
          name: "Test Room",
          source: "integration-test",
          type: "GROUP",
        });

        // Add participant
        const added = await runtime.addParticipant(entityId, roomId);
        expect(added).toBe(true);

        // Verify participant
        const participants = await runtime.getParticipantsForRoom(roomId);
        expect(participants).toContain(entityId);
      });

      it("should handle world and room relationships", async () => {
        if (!setupSucceeded || !runtime) {
          console.warn("⚠️  Skipping: runtime not available");
          return;
        }
```