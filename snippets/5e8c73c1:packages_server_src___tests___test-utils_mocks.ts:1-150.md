# 5e8c73c1:packages_server_src___tests___test-utils_mocks.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/test-utils/mocks.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Mock factory functions for testing
 */

import type {
  Character,
  DatabaseAdapter,
  Evaluator,
  IAgentRuntime,
  Memory,
  Service,
  State,
  UUID,
} from '@elizaos/core';
import { ServiceType } from '@elizaos/core';
import type { NextFunction, Request, Response } from 'express';
import { jest } from 'bun:test';

/**
 * Creates a mock IAgentRuntime with all required properties
 */
export function createMockAgentRuntime(overrides?: Partial<IAgentRuntime>): IAgentRuntime {
  const db = { execute: jest.fn(() => Promise.resolve([])) };

  const baseRuntime: Partial<IAgentRuntime> = {
    // Properties from IAgentRuntime interface
    agentId: '123e4567-e89b-12d3-a456-426614174000' as UUID,
    character: {
      id: 'test-character-id' as UUID,
      name: 'Test Character',
      description: 'A test character',
      bio: ['Test bio'],
      system: 'Test system',
      modelProvider: 'openai',
      settings: {
        model: 'gpt-4',
        secrets: {},
      },
    } as Character,
    providers: [],
    actions: [],
    evaluators: [],
    plugins: [],
    services: new Map(),
    events: new Map() as any, // PluginEvents type expects object but runtime uses Map
    fetch: null,
    routes: [],

    // IAgentRuntime methods
    registerPlugin: jest.fn(() => Promise.resolve()),
    initialize: jest.fn(() => Promise.resolve()),
    getConnection: jest.fn(() => Promise.resolve(db)),
    getService: jest.fn(() => null),
    getAllServices: jest.fn(() => new Map()),
    registerService: jest.fn(() => Promise.resolve()),
    registerDatabaseAdapter: jest.fn(),
    setSetting: jest.fn(),
    getSetting: jest.fn((key: string) => overrides?.character?.settings?.[key]),
    getConversationLength: jest.fn(() => 10),
    processActions: jest.fn(() => Promise.resolve()),
    evaluate: jest.fn(() => Promise.resolve([] as Evaluator[])),
    registerProvider: jest.fn(),
    registerAction: jest.fn(),
    registerEvaluator: jest.fn(),
    ensureConnections: jest.fn(() => Promise.resolve()),
    ensureConnection: jest.fn(() => Promise.resolve()),
    ensureParticipantInRoom: jest.fn(() => Promise.resolve()),
    ensureWorldExists: jest.fn(() => Promise.resolve()),
    ensureRoomExists: jest.fn(() => Promise.resolve()),
    composeState: jest.fn(() => Promise.resolve({} as State)),
    useModel: jest.fn(() => Promise.resolve('mock response' as any)),
    registerModel: jest.fn(),
    getModel: jest.fn(() => undefined),
    registerEvent: jest.fn(),
    getEvent: jest.fn(() => undefined),
    emitEvent: jest.fn(() => Promise.resolve()),
    registerTaskWorker: jest.fn(),
    getTaskWorker: jest.fn(() => undefined),
    stop: jest.fn(() => Promise.resolve()),
    addEmbeddingToMemory: jest.fn((memory: Memory) => Promise.resolve(memory)),
    queueEmbeddingGeneration: jest.fn(() => Promise.resolve()),
    createRunId: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000' as UUID),
    startRun: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000' as UUID),
    endRun: jest.fn(),
    getCurrentRunId: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000' as UUID),
    getEntityById: jest.fn(() => Promise.resolve(null)),
    getRoom: jest.fn(() => Promise.resolve(null)),
    createEntity: jest.fn(() => Promise.resolve(true)),
    createRoom: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    addParticipant: jest.fn(() => Promise.resolve(true)),
    getRooms: jest.fn(() => Promise.resolve([])),
    registerSendHandler: jest.fn(),
    sendMessageToTarget: jest.fn(() => Promise.resolve()),

    // IDatabaseAdapter properties and methods
    db,
    isReady: jest.fn(() => Promise.resolve(true)),
    init: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
    getAgent: jest.fn(() => Promise.resolve(null)),
    getAgents: jest.fn(() => Promise.resolve([])),
    createAgent: jest.fn(() => Promise.resolve(true)),
    updateAgent: jest.fn(() => Promise.resolve(true)),
    deleteAgent: jest.fn(() => Promise.resolve(true)),
    ensureEmbeddingDimension: jest.fn(() => Promise.resolve()),
    getEntitiesByIds: jest.fn(() => Promise.resolve(null)),
    getEntitiesForRoom: jest.fn(() => Promise.resolve([])),
    createEntities: jest.fn(() => Promise.resolve(true)),
    updateEntity: jest.fn(() => Promise.resolve()),
    getComponent: jest.fn(() => Promise.resolve(null)),
    getComponents: jest.fn(() => Promise.resolve([])),
    createComponent: jest.fn(() => Promise.resolve(true)),
    updateComponent: jest.fn(() => Promise.resolve()),
    deleteComponent: jest.fn(() => Promise.resolve()),
    getMemories: jest.fn(() => Promise.resolve([])),
    getAllMemories: jest.fn(() => Promise.resolve([])),
    clearAllAgentMemories: jest.fn(() => Promise.resolve()),
    getMemoryById: jest.fn(() => Promise.resolve(null)),
    getMemoriesByIds: jest.fn(() => Promise.resolve([])),
    getMemoriesByRoomIds: jest.fn(() => Promise.resolve([])),
    getCachedEmbeddings: jest.fn(() => Promise.resolve([])),
    log: jest.fn(() => Promise.resolve()),
    getLogs: jest.fn(() => Promise.resolve([])),
    deleteLog: jest.fn(() => Promise.resolve()),
    searchMemories: jest.fn(() => Promise.resolve([])),
    createMemory: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    updateMemory: jest.fn(() => Promise.resolve(true)),
    deleteMemory: jest.fn(() => Promise.resolve()),
    deleteManyMemories: jest.fn(() => Promise.resolve()),
    deleteAllMemories: jest.fn(() => Promise.resolve()),
    countMemories: jest.fn(() => Promise.resolve(0)),
    createWorld: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    getWorld: jest.fn(() => Promise.resolve(null)),
    removeWorld: jest.fn(() => Promise.resolve()),
    getAllWorlds: jest.fn(() => Promise.resolve([])),
    updateWorld: jest.fn(() => Promise.resolve()),
    getRoomsByIds: jest.fn(() => Promise.resolve(null)),
    createRooms: jest.fn(() => Promise.resolve([])),
    deleteRoom: jest.fn(() => Promise.resolve()),
    deleteRoomsByWorldId: jest.fn(() => Promise.resolve()),
    updateRoom: jest.fn(() => Promise.resolve()),
    getRoomsForParticipant: jest.fn(() => Promise.resolve([])),
    getRoomsForParticipants: jest.fn(() => Promise.resolve([])),
    getRoomsByWorld: jest.fn(() => Promise.resolve([])),
    removeParticipant: jest.fn(() => Promise.resolve(true)),
    getParticipantsForEntity: jest.fn(() => Promise.resolve([])),
    getParticipantsForRoom: jest.fn(() => Promise.resolve([])),
    addParticipantsRoom: jest.fn(() => Promise.resolve(true)),
    getParticipantUserState: jest.fn(() => Promise.resolve(null)),
    setParticipantUserState: jest.fn(() => Promise.resolve()),
```