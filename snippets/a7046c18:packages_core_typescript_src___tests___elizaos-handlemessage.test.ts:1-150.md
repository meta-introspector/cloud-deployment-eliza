# a7046c18:packages_core_typescript_src___tests___elizaos-handlemessage.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos-handlemessage.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { elizaOS as ElizaOS } from "../elizaos";
import type {
  MessageProcessingOptions,
  MessageProcessingResult,
} from "../services/message-service";
import type {
  Character,
  Content,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  UUID,
} from "../types";

describe("ElizaOS.handleMessage", () => {
  let elizaOS: ElizaOS;
  let agentId: UUID;
  let handleMessageMock: ReturnType<typeof mock>;
  let ensureConnectionMock: ReturnType<typeof mock>;

  const mockCharacter: Character = {
    id: "123e4567-e89b-12d3-a456-426614174000" as UUID,
    name: "TestAgent",
    username: "testagent",
    bio: "Test agent for unit testing ElizaOS.handleMessage() functionality",
    settings: {
      secrets: {},
      voice: { model: "en_US-male-medium" },
    },
  };

  beforeEach(async () => {
    elizaOS = new ElizaOS();

    agentId = "123e4567-e89b-12d3-a456-426614174001" as UUID;

    // Create mock for messageService.handleMessage
    handleMessageMock = mock(
      async (
        _runtime: IAgentRuntime,
        _message: Memory,
        callback: HandlerCallback | undefined,
        _options?: MessageProcessingOptions,
      ): Promise<MessageProcessingResult> => {
        const agentResponse: Content = {
          text: "Hello! How can I help you?",
          thought: "User greeted me",
          actions: ["REPLY"],
          simple: true,
        };

        // Call callback if provided (async mode)
        if (callback) {
          await callback(agentResponse);
        }

        return {
          didRespond: true,
          responseContent: agentResponse,
          responseMessages: [],
          state: {
            values: {},
            data: {},
            text: "",
          },
          mode: "simple" as const,
        };
      },
    );

    // Create mock for ensureConnection
    ensureConnectionMock = mock(async () => {});

    // Create a mock runtime directly (without initialization)
    const mockRuntime = {
      agentId,
      character: mockCharacter,
      messageService: {
        handleMessage: handleMessageMock,
      },
      ensureConnection: ensureConnectionMock,
      logger: {
        debug: mock(() => {}),
        info: mock(() => {}),
        warn: mock(() => {}),
        error: mock(() => {}),
      },
    } as any;

    // Register the mock runtime directly (bypass initialization)
    elizaOS.registerAgent(mockRuntime);
  });

  describe("SYNC Mode", () => {
    it("should send message and wait for response", async () => {
      const result = await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Hello",
          source: "web",
        },
      });

      // Should return message ID
      expect(result.messageId).toBeDefined();
      expect(typeof result.messageId).toBe("string");

      // Should return user message
      expect(result.userMessage).toBeDefined();
      expect(result.userMessage.content.text).toBe("Hello");

      // Should return processing result in SYNC mode
      expect(result.processing).toBeDefined();
      expect(result.processing?.didRespond).toBe(true);
      expect(result.processing?.responseContent?.text).toBe(
        "Hello! How can I help you?",
      );

      // handleMessage should have been called with undefined callback (sync mode)
      expect(handleMessageMock).toHaveBeenCalled();
      const callArgs = handleMessageMock.mock.calls[0];
      expect(callArgs[2]).toBeUndefined(); // callback should be undefined in sync mode
    });

    it("should auto-fill missing fields", async () => {
      const result = await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Test",
          source: "test",
        },
      });

      // Should have auto-generated ID
      expect(result.userMessage.id).toBeDefined();

      // Should have auto-filled agentId
      expect(result.userMessage.agentId).toBe(agentId);

      // Should have auto-filled createdAt
      expect(result.userMessage.createdAt).toBeDefined();
      expect(typeof result.userMessage.createdAt).toBe("number");
    });

    it("should call ensureConnection with correct params", async () => {
      await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
```