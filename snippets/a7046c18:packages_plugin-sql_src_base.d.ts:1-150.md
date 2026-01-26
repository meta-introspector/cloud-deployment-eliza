# a7046c18:packages_plugin-sql_src_base.d.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.d.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type Agent,
  type AgentRunSummaryResult,
  type Component,
  DatabaseAdapter,
  type Entity,
  type Log,
  type Memory,
  type MemoryMetadata,
  type Metadata,
  type Participant,
  type Relationship,
  type Room,
  type RunStatus,
  type Task,
  type UUID,
  type World,
} from "@elizaos/core";
import type { DatabaseMigrationService } from "./migration-service";
import { type EmbeddingDimensionColumn } from "./schema/embedding";
import type { DrizzleDatabase } from "./types";
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
export declare abstract class BaseDrizzleAdapter extends DatabaseAdapter<any> {
  protected readonly maxRetries: number;
  protected readonly baseDelay: number;
  protected readonly maxDelay: number;
  protected readonly jitterMax: number;
  protected embeddingDimension: EmbeddingDimensionColumn;
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
  abstract withEntityContext<T>(
    entityId: UUID | null,
    callback: (tx: DrizzleDatabase) => Promise<T>,
  ): Promise<T>;
  abstract init(): Promise<void>;
  abstract close(): Promise<void>;
  /**
   * Initialize method that can be overridden by implementations
   */
  initialize(): Promise<void>;
  /**
   * Run plugin schema migrations for all registered plugins
   * @param plugins Array of plugins with their schemas
   * @param options Migration options (verbose, force, dryRun, etc.)
   */
  runPluginMigrations(
    plugins: Array<{
      name: string;
      schema?: Record<string, unknown>;
    }>,
    options?: {
      verbose?: boolean;
      force?: boolean;
      dryRun?: boolean;
    },
  ): Promise<void>;
  /**
   * Get the underlying database instance for testing purposes
   */
  getDatabase(): unknown;
  protected agentId: UUID;
  /**
   * Constructor for creating a new instance of Agent with the specified agentId.
   *
   * @param {UUID} agentId - The unique identifier for the agent.
   */
  constructor(agentId: UUID);
  /**
   * Normalizes entity names to ensure they are always a proper array of strings.
   * Handles strings, Sets, Maps, iterables, and non-iterable values.
   * All array elements are converted to strings to prevent database errors.
   * @param {any} names - The names value to normalize
   * @returns {string[]} A proper array of string names
   * @private
   */
  private normalizeEntityNames;
  /**
   * Executes the given operation with retry logic.
   * @template T
   * @param {() => Promise<T>} operation - The operation to be executed.
   * @returns {Promise<T>} A promise that resolves with the result of the operation.
   */
  protected withRetry<T>(operation: () => Promise<T>): Promise<T>;
  /**
   * Asynchronously ensures that the given embedding dimension is valid for the agent.
   *
   * @param {number} dimension - The dimension to ensure for the embedding.
   * @returns {Promise<void>} - Resolves once the embedding dimension is ensured.
   */
  ensureEmbeddingDimension(dimension: number): Promise<void>;
  /**
   * Asynchronously retrieves an agent by their ID from the database.
   * @param {UUID} agentId - The ID of the agent to retrieve.
   * @returns {Promise<Agent | null>} A promise that resolves to the retrieved agent or null if not found.
   */
  getAgent(agentId: UUID): Promise<Agent | null>;
  /**
   * Asynchronously retrieves a list of agents from the database.
   *
   * @returns {Promise<Partial<Agent>[]>} A Promise that resolves to an array of Agent objects.
   */
  getAgents(): Promise<Partial<Agent>[]>;
  /**
   * Asynchronously creates a new agent record in the database.
   *
   * @param {Partial<Agent>} agent The agent object to be created.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  createAgent(agent: Agent): Promise<boolean>;
  /**
   * Updates an agent in the database with the provided agent ID and data.
   * @param {UUID} agentId - The unique identifier of the agent to update.
   * @param {Partial<Agent>} agent - The partial agent object containing the fields to update.
   * @returns {Promise<boolean>} - A boolean indicating if the agent was successfully updated.
   */
  updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean>;
  /**
   * Merges updated agent settings with existing settings in the database,
   * with special handling for nested objects like secrets.
   * @param tx - The database transaction
```