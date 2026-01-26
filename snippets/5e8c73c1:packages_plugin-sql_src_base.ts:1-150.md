# 5e8c73c1:packages_plugin-sql_src_base.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import {
  type Agent,
  ChannelType,
  type Component,
  DatabaseAdapter,
  type Entity,
  type Log,
  type LogBody,
  logger,
  type Memory,
  type MemoryMetadata,
  type Metadata,
  type Participant,
  type Relationship,
  type Room,
  RoomMetadata,
  type Task,
  TaskMetadata,
  type UUID,
  type World,
  type AgentRunSummary,
  type AgentRunSummaryResult,
  type RunStatus,
  type AgentRunCounts,
} from '@elizaos/core';
import type { DatabaseMigrationService } from './migration-service';
import {
  and,
  cosineDistance,
  count,
  desc,
  eq,
  gte,
  inArray,
  lt,
  lte,
  or,
  SQL,
  sql,
} from 'drizzle-orm';
import { v4 } from 'uuid';
import { DIMENSION_MAP, type EmbeddingDimensionColumn } from './schema/embedding';
import {
  agentTable,
  cacheTable,
  channelParticipantsTable,
  channelTable,
  componentTable,
  embeddingTable,
  entityTable,
  logTable,
  memoryTable,
  messageServerTable,
  messageTable,
  participantTable,
  relationshipTable,
  roomTable,
  messageServerAgentsTable,
  taskTable,
  worldTable,
} from './schema/index';
import type { DrizzleDatabase } from './types';

// Define the metadata type inline since we can't import it
/**
 * Represents metadata information about memory.
 * @typedef {Object} MemoryMetadata
 * @property {string} type - The type of memory.
 * @property {string} [source] - The source of the memory.
 * @property {UUID} [sourceId] - The ID of the source.
 * @property {string} [scope] - The scope of the memory.
 * @property {number} [timestamp] - The timestamp of the memory.
 * @property {string[]} [tags] - The tags associated with the memory.
 * @property {UUID} [documentId] - The ID of the document associated with the memory.
 * @property {number} [position] - The position of the memory.
 */

/**
 * Abstract class representing a base Drizzle adapter for working with databases.
 * This adapter provides a comprehensive set of methods for interacting with a database
 * using Drizzle ORM. It implements the DatabaseAdapter interface and handles operations
 * for various entity types including agents, entities, components, memories, rooms,
 * participants, relationships, tasks, and more.
 *
 * The adapter includes built-in retry logic for database operations, embedding dimension
 * management, and transaction support. Concrete implementations must provide the
 * withDatabase method to execute operations against their specific database.
 */
export abstract class BaseDrizzleAdapter extends DatabaseAdapter<any> {
  protected readonly maxRetries: number = 3;
  protected readonly baseDelay: number = 1000;
  protected readonly maxDelay: number = 10000;
  protected readonly jitterMax: number = 1000;
  protected embeddingDimension: EmbeddingDimensionColumn = DIMENSION_MAP[384];
  protected migrationService?: DatabaseMigrationService;

  protected abstract withDatabase<T>(operation: () => Promise<T>): Promise<T>;

  /**
   * Execute a callback with entity context for Entity RLS.
   * Must be implemented by concrete adapters to handle their specific RLS mechanisms.
   *
   * @param entityId - The entity UUID to set as context (or null for system operations)
   * @param callback - The database operations to execute with the entity context
   * @returns The result of the callback
   */
  public abstract withEntityContext<T>(
    entityId: UUID | null,
    callback: (tx: DrizzleDatabase) => Promise<T>
  ): Promise<T>;

  public abstract init(): Promise<void>;
  public abstract close(): Promise<void>;

  /**
   * Initialize method that can be overridden by implementations
   */
  public async initialize(): Promise<void> {
    await this.init();
  }

  /**
   * Run plugin schema migrations for all registered plugins
   * @param plugins Array of plugins with their schemas
   * @param options Migration options (verbose, force, dryRun, etc.)
   */
  public async runPluginMigrations(
    plugins: Array<{ name: string; schema?: Record<string, unknown> }>,
    options?: {
      verbose?: boolean;
      force?: boolean;
      dryRun?: boolean;
    }
  ): Promise<void> {
    // Initialize migration service if not already done
    if (!this.migrationService) {
      const { DatabaseMigrationService } = await import('./migration-service');
      this.migrationService = new DatabaseMigrationService();
      await this.migrationService.initializeWithDatabase(this.db);
    }

    // Register plugin schemas
    for (const plugin of plugins) {
      if (plugin.schema) {
        this.migrationService.registerSchema(plugin.name, plugin.schema);
      }
    }

    // Run migrations with options
    await this.migrationService.runAllPluginMigrations(options);
```