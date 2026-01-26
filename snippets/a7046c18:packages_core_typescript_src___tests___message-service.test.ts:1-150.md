# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { ChannelType, EventType, ModelType } from "../index";
import { DefaultMessageService } from "../services/default-message-service";
import type { IMessageService } from "../services/message-service";
import type { Content, HandlerCallback, Memory, UUID } from "../types";
import type { GenerateTextParams } from "../types/model";
import type { IAgentRuntime } from "../types/runtime";

describe("DefaultMessageService", () => {
  let messageService: IMessageService;
  let mockRuntime: Partial<IAgentRuntime>;
  let mockCallback: HandlerCallback;

  beforeEach(() => {
    // Create mock callback
    mockCallback = mock(async (content: Content) => {
      return [
        {
          id: "123e4567-e89b-12d3-a456-426614174099" as UUID,
          content,
          entityId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          createdAt: Date.now(),
        },
      ];
    });

    // Create mock runtime
    mockRuntime = {
      agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
      logger: {
        debug: mock(() => {}),
        info: mock(() => {}),
        warn: mock(() => {}),
        error: mock(() => {}),
        success: mock(() => {}),
      },
      character: {
        name: "TestAgent",
        username: "testagent",
        clients: [],
        modelProvider: "openai",
        settings: {
          secrets: {},
          voice: {
            model: "en_US-male-medium",
          },
        },
        system: "You are a helpful AI assistant.",
      },
      getSetting: mock((key: string) => {
        const settings: Record<string, any> = {
          ALWAYS_RESPOND_CHANNELS: "",
          ALWAYS_RESPOND_SOURCES: "",
          SHOULD_RESPOND_BYPASS_TYPES: "",
          SHOULD_RESPOND_BYPASS_SOURCES: "",
        };
        return settings[key];
      }),
      createMemory: mock(async (memory: Memory, _tableName: string) => {
        return memory;
      }),
      getMemoryById: mock(async (_id: UUID) => null),
      getMemoriesByRoomIds: mock(async () => []),
      composeState: mock(async () => ({
        data: {},
        values: {},
      })),
      useModel: mock(
        async (
          modelType: (typeof ModelType)[keyof typeof ModelType],
          params: unknown,
        ) => {
          if (modelType === ModelType.TEXT_SMALL) {
            // Response for shouldRespond check (no streaming)
            return "<response><action>REPLY</action><reason>User asked a question</reason></response>";
          }
          // Response for message handler - now with streaming support
          // Must include <response> wrapper for parseKeyValueXml to work
          const responseText =
            "<response><thought>Processing message</thought><actions>REPLY</actions><providers></providers><text>Hello! How can I help you?</text></response>";
          const textParams = params as GenerateTextParams;
          if (textParams?.stream) {
            // Return TextStreamResult for streaming - simulate chunked response
            return {
              textStream: (async function* () {
                // Yield in chunks to simulate real streaming
                yield "<response><thought>Processing message</thought>";
                yield "<actions>REPLY</actions><providers></providers>";
                yield "<text>Hello! How can I help you?</text></response>";
              })(),
              text: Promise.resolve(responseText),
            };
          }
          return responseText;
        },
      ),
      processActions: mock(async () => {}),
      evaluate: mock(async () => {}),
      emitEvent: mock(async () => {}),
      getRoom: mock(async (roomId: UUID) => ({
        id: roomId,
        type: ChannelType.GROUP,
        name: "Test Room",
        worldId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
      })),
      getWorld: mock(async (worldId: UUID) => ({
        id: worldId,
        name: "Test World",
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
      })),
      ensureRoomExists: mock(async () => {}),
      getActions: mock(() => []),
      startRun: mock(() => "123e4567-e89b-12d3-a456-426614174100" as UUID),
      endRun: mock((_runId: UUID) => {}),
      queueEmbeddingGeneration: mock(async () => {}),
      log: mock(async () => {}),
      getParticipantUserState: mock(async () => ({
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        userId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
      })),
      getRoomsByIds: mock(async (roomIds: UUID[]) => {
        return roomIds.map((id) => ({
          id,
          name: "Test Room",
          type: ChannelType.GROUP,
          worldId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
        }));
      }),
      getEntityById: mock(async (entityId: UUID) => ({
        id: entityId,
        names: ["Test User"],
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
      })),
    } as IAgentRuntime;

    messageService = new DefaultMessageService();
  });

  describe("shouldRespond", () => {
    it("should always respond in DM channels", () => {
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174010" as UUID,
        content: { text: "Hello", channelType: ChannelType.DM } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };
```