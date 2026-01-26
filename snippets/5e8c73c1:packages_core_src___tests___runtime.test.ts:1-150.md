# 5e8c73c1:packages_core_src___tests___runtime.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { beforeEach, afterEach, describe, expect, it } from 'bun:test';
import { mock, spyOn } from 'bun:test';

// Helper type for bun:test mocks with additional methods
interface BunMockFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => BunMockFunction<T>;
  mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => BunMockFunction<T>;
  mock: {
    calls: Parameters<T>[][];
    results: ReturnType<T>[];
  };
}
import { AgentRuntime } from '../runtime';
import { MemoryType, ModelType, isStreamableModelType } from '../types';
import type {
  Action,
  Character,
  IDatabaseAdapter,
  Memory,
  ModelTypeName,
  Plugin,
  Provider,
  State,
  UUID,
  TextStreamResult,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
const stringToUuid = (id: string): UUID => id as UUID;

// --- Mocks ---

// Use hoisted for prompts mock
const mockSplitChunks = mock();
mock.module('../src/utils', () => ({
  splitChunks: mockSplitChunks,
}));

// Use hoisted for ./index mock (safeReplacer)
const mockSafeReplacer = mock((_key, value) => value); // Simple replacer mock
// Don't mock the entire index module to avoid interfering with other tests

// Track adapter readiness across init/close to properly test idempotent initialization
let adapterReady = false;

// Mock IDatabaseAdapter (inline style matching your example)
const mockDatabaseAdapter: IDatabaseAdapter = {
  isRoomParticipant: mock().mockResolvedValue(true),
  db: {},
  init: mock().mockImplementation(async () => {
    adapterReady = true;
  }),
  initialize: mock().mockResolvedValue(undefined),
  isReady: mock().mockImplementation(async () => adapterReady),
  close: mock().mockImplementation(async () => {
    adapterReady = false;
  }),
  getConnection: mock().mockResolvedValue({}),
  getEntitiesByIds: mock().mockResolvedValue([]),
  createEntities: mock().mockResolvedValue(true),
  getMemories: mock().mockResolvedValue([]),
  getMemoryById: mock().mockResolvedValue(null),
  getMemoriesByRoomIds: mock().mockResolvedValue([]),
  getMemoriesByIds: mock().mockResolvedValue([]),
  getCachedEmbeddings: mock().mockResolvedValue([]),
  log: mock().mockResolvedValue(undefined),
  searchMemories: mock().mockResolvedValue([]),
  createMemory: mock().mockResolvedValue(stringToUuid(uuidv4())),
  deleteMemory: mock().mockResolvedValue(undefined),
  deleteManyMemories: mock().mockResolvedValue(undefined),
  deleteAllMemories: mock().mockResolvedValue(undefined),
  countMemories: mock().mockResolvedValue(0),
  getRoomsByIds: mock().mockResolvedValue([]),
  createRooms: mock().mockResolvedValue([stringToUuid(uuidv4())]),
  deleteRoom: mock().mockResolvedValue(undefined),
  getRoomsForParticipant: mock().mockResolvedValue([]),
  getRoomsForParticipants: mock().mockResolvedValue([]),
  addParticipantsRoom: mock().mockResolvedValue(true),
  removeParticipant: mock().mockResolvedValue(true),
  getParticipantsForEntity: mock().mockResolvedValue([]),
  getParticipantsForRoom: mock().mockResolvedValue([]),
  getParticipantUserState: mock().mockResolvedValue(null),
  setParticipantUserState: mock().mockResolvedValue(undefined),
  createRelationship: mock().mockResolvedValue(true),
  getRelationship: mock().mockResolvedValue(null),
  getRelationships: mock().mockResolvedValue([]),
  getAgent: mock().mockResolvedValue(null),
  getAgents: mock().mockResolvedValue([]),
  createAgent: mock().mockResolvedValue(true),
  updateAgent: mock().mockResolvedValue(true),
  deleteAgent: mock().mockResolvedValue(true),
  ensureEmbeddingDimension: mock().mockResolvedValue(undefined),
  getEntitiesForRoom: mock().mockResolvedValue([]),
  updateEntity: mock().mockResolvedValue(undefined),
  getComponent: mock().mockResolvedValue(null),
  getComponents: mock().mockResolvedValue([]),
  createComponent: mock().mockResolvedValue(true),
  updateComponent: mock().mockResolvedValue(undefined),
  deleteComponent: mock().mockResolvedValue(undefined),
  createWorld: mock().mockResolvedValue(stringToUuid(uuidv4())),
  getWorld: mock().mockResolvedValue(null),
  getAllWorlds: mock().mockResolvedValue([]),
  updateWorld: mock().mockResolvedValue(undefined),
  updateRoom: mock().mockResolvedValue(undefined),
  getRoomsByWorld: mock().mockResolvedValue([]),
  updateRelationship: mock().mockResolvedValue(undefined),
  getCache: mock().mockResolvedValue(undefined),
  setCache: mock().mockResolvedValue(true),
  deleteCache: mock().mockResolvedValue(true),
  createTask: mock().mockResolvedValue(stringToUuid(uuidv4())),
  getTasks: mock().mockResolvedValue([]),
  getTask: mock().mockResolvedValue(null),
  getTasksByName: mock().mockResolvedValue([]),
  updateTask: mock().mockResolvedValue(undefined),
  deleteTask: mock().mockResolvedValue(undefined),
  updateMemory: mock().mockResolvedValue(true),
  getLogs: mock().mockResolvedValue([]),
  deleteLog: mock().mockResolvedValue(undefined),
  removeWorld: mock().mockResolvedValue(undefined),
  deleteRoomsByWorldId: function (_worldId: UUID): Promise<void> {
    throw new Error('Function not implemented.');
  },
  getMemoriesByWorldId: function (_params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]> {
    throw new Error('Function not implemented.');
  },
};

// Mock action creator (matches your example)
const createMockAction = (name: string): Action => ({
  name,
  description: `Test action ${name}`,
  similes: [`like ${name}`],
  examples: [],
  handler: mock().mockResolvedValue(undefined),
  validate: mock().mockImplementation(async () => true),
});

// Mock Memory creator
const createMockMemory = (
  text: string,
  id?: UUID,
  entityId?: UUID,
  roomId?: UUID,
  agentId?: UUID
): Memory => ({
  id: id ?? stringToUuid(uuidv4()),
```