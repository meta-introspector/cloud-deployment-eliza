# a7046c18:packages_core_typescript_src___tests___e2e_core-runtime.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/e2e/core-runtime.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * E2E (End-to-End) Test Suite for Core Runtime Functionality
 * ============================================================
 *
 * This file contains comprehensive end-to-end tests that validate core runtime
 * functionality in a realistic scenario. These tests simulate real-world usage
 * patterns and validate the complete workflow from message creation to response.
 *
 * NOTE: These tests use bun:test but simulate E2E scenarios by testing
 * multiple components working together in realistic workflows.
 */

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { parseCharacter } from "../../character";
import { createMessageMemory, getMemoryText } from "../../memory";
import { AgentRuntime } from "../../runtime";
import { DefaultMessageService } from "../../services/default-message-service";
import type {
  Character,
  Content,
  HandlerCallback,
  IDatabaseAdapter,
  Memory,
  UUID,
} from "../../types";
import { ChannelType, ModelType } from "../../types";
import { createMockAdapter } from "../test-helpers";

describe("Core Runtime E2E Tests", () => {
  let runtime: AgentRuntime;
  let mockAdapter: IDatabaseAdapter;
  let testCharacter: Character;
  let agentId: UUID;
  let roomId: UUID;
  let entityId: UUID;
  let messageService: DefaultMessageService;
  let responseCallback: HandlerCallback;
  let capturedResponses: Content[];

  beforeEach(() => {
    agentId = uuidv4() as UUID;
    roomId = uuidv4() as UUID;
    entityId = uuidv4() as UUID;
    capturedResponses = [];

    testCharacter = {
      id: agentId,
      name: "TestAgent",
      username: "testagent",
      bio: ["A helpful AI assistant"],
      messageExamples: [],
      postExamples: [],
      topics: [],
      style: { all: [], chat: [], post: [] },
      adjectives: [],
      settings: {
        MODEL: "gpt-4",
      },
    };

    responseCallback = mock(async (content: Content) => {
      capturedResponses.push(content);
      return [
        {
          id: uuidv4() as UUID,
          content,
          entityId: agentId,
          agentId,
          roomId,
          createdAt: Date.now(),
        },
      ];
    });

    mockAdapter = createMockAdapter({
      getEntitiesByIds: mock(async () => [
        {
          id: entityId,
          names: ["TestUser"],
          agentId,
          metadata: {},
        },
      ]),
      getRoomsByIds: mock(async () => [
        {
          id: roomId,
          name: "Test Room",
          source: "test",
          type: ChannelType.GROUP,
          worldId: uuidv4() as UUID,
        },
      ]),
      createRooms: mock(async () => [roomId]),
    });

    runtime = new AgentRuntime({
      character: testCharacter,
      adapter: mockAdapter,
    });

    messageService = new DefaultMessageService();

    // Register mock model handlers
    runtime.registerModel(
      ModelType.TEXT_SMALL,
      async () => {
        return "<shouldRespond>true</shouldRespond><reason>User message</reason>";
      },
      "test",
    );

    runtime.registerModel(
      ModelType.TEXT_LARGE,
      async () => {
        return "<thought>I should respond</thought><text>Hello! How can I help you?</text>";
      },
      "test",
    );
  });

  afterEach(() => {
    mock.restore();
    capturedResponses = [];
  });

  describe("Complete Message Processing Workflow", () => {
    it("should process a message from creation to response", async () => {
      const userMessage = createMessageMemory({
        entityId,
        roomId,
        content: { text: "Hello, agent!" },
      });

      const result = await messageService.handleMessage(
        runtime,
        userMessage,
        responseCallback,
      );

      expect(result.didRespond).toBeDefined();
      expect(typeof result.didRespond).toBe("boolean");
      expect(mockAdapter.createMemory).toHaveBeenCalled();
      expect(result.state).toBeDefined();
      expect(result.responseMessages).toBeDefined();
      expect(Array.isArray(result.responseMessages)).toBe(true);
    });

    it("should store message in memory and retrieve it", async () => {
      const userMessage = createMessageMemory({
```