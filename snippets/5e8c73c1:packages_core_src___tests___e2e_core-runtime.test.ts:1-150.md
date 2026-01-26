# 5e8c73c1:packages_core_src___tests___e2e_core-runtime.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/e2e/core-runtime.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

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

import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { AgentRuntime } from '../../runtime';
import { DefaultMessageService } from '../../services/default-message-service';
import { createMessageMemory, getMemoryText } from '../../memory';
import { parseCharacter } from '../../character';
import type { Character, Memory, UUID, Content, HandlerCallback } from '../../types';
import { MemoryType, ModelType, ChannelType } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { createMockAdapter } from '../test-helpers';
import type { IDatabaseAdapter } from '../../types';

describe('Core Runtime E2E Tests', () => {
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
      name: 'TestAgent',
      username: 'testagent',
      bio: ['A helpful AI assistant'],
      messageExamples: [],
      postExamples: [],
      topics: [],
      style: { all: [], chat: [], post: [] },
      adjectives: [],
      settings: {
        MODEL: 'gpt-4',
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
          names: ['TestUser'],
          agentId,
          metadata: {},
        },
      ]),
      getRoomsByIds: mock(async () => [
        {
          id: roomId,
          name: 'Test Room',
          source: 'test',
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
        return '<shouldRespond>true</shouldRespond><reason>User message</reason>';
      },
      'test'
    );

    runtime.registerModel(
      ModelType.TEXT_LARGE,
      async () => {
        return '<thought>I should respond</thought><text>Hello! How can I help you?</text>';
      },
      'test'
    );
  });

  afterEach(() => {
    mock.restore();
    capturedResponses = [];
  });

  describe('Complete Message Processing Workflow', () => {
    it('should process a message from creation to response', async () => {
      const userMessage = createMessageMemory({
        entityId,
        roomId,
        content: { text: 'Hello, agent!' },
      });

      const result = await messageService.handleMessage(runtime, userMessage, responseCallback);

      expect(result.didRespond).toBeDefined();
      expect(typeof result.didRespond).toBe('boolean');
      expect(mockAdapter.createMemory).toHaveBeenCalled();
      expect(result.state).toBeDefined();
      expect(result.responseMessages).toBeDefined();
      expect(Array.isArray(result.responseMessages)).toBe(true);
    });

    it('should store message in memory and retrieve it', async () => {
      const userMessage = createMessageMemory({
        entityId,
        roomId,
        content: { text: 'Test message for memory' },
      });

      const storedMemories: Memory[] = [userMessage];
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(storedMemories);

      await messageService.handleMessage(runtime, userMessage, responseCallback);

```