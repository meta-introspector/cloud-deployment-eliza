# a7046c18:packages_plugin-sql_src_pg_adapter.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/pg/adapter.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type Agent,
  type Component,
  type Entity,
  logger,
  type Memory,
  type UUID,
} from "@elizaos/core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BaseDrizzleAdapter } from "../base";
import {
  DIMENSION_MAP,
  type EmbeddingDimensionColumn,
} from "../schema/embedding";
import type { PostgresConnectionManager } from "./manager";

/**
 * Adapter class for interacting with a PostgreSQL database.
 * Extends BaseDrizzleAdapter.
 */
export class PgDatabaseAdapter extends BaseDrizzleAdapter {
  protected embeddingDimension: EmbeddingDimensionColumn = DIMENSION_MAP[384];
  private manager: PostgresConnectionManager;

  constructor(
    agentId: UUID,
    manager: PostgresConnectionManager,
    _schema?: Record<string, unknown>,
  ) {
    super(agentId);
    this.manager = manager;
    this.db = manager.getDatabase();
  }

  getManager(): PostgresConnectionManager {
    return this.manager;
  }

  /**
   * Execute a callback with entity context for Entity RLS
   * Delegates to the manager's withEntityContext method
   *
   * This is a public method because it's part of the adapter's public API
   * for operations that need entity-scoped database access.
   */
  public async withEntityContext<T>(
    entityId: UUID | null,
    callback: (tx: NodePgDatabase) => Promise<T>,
  ): Promise<T> {
    return await this.manager.withEntityContext(entityId, callback);
  }

  // Methods required by TypeScript but not in base class
  async getEntityByIds(entityIds: UUID[]): Promise<Entity[] | null> {
    // Delegate to the correct method name
    return this.getEntitiesByIds(entityIds);
  }

  async getMemoriesByServerId(_params: {
    serverId: UUID;
    count?: number;
  }): Promise<Memory[]> {
    // This method doesn't seem to exist in the base implementation
    // Provide a basic implementation that returns empty array
    logger.warn(
      { src: "plugin:sql" },
      "getMemoriesByServerId called but not implemented",
    );
    return [];
  }

  async ensureAgentExists(agent: Partial<Agent>): Promise<Agent> {
    // Check if agent exists, create if not
    const existingAgent = await this.getAgent(this.agentId);
    if (existingAgent) {
      return existingAgent;
    }

    // Create the agent with required fields
    const newAgent: Agent = {
      id: this.agentId,
      name: agent.name || "Unknown Agent",
      username: agent.username,
      bio: agent.bio || "An AI agent",
      createdAt: agent.createdAt || Date.now(),
      updatedAt: agent.updatedAt || Date.now(),
    };

    await this.createAgent(newAgent);
    const createdAgent = await this.getAgent(this.agentId);
    if (!createdAgent) {
      throw new Error("Failed to create agent");
    }
    return createdAgent;
  }

  /**
   * Executes the provided operation with a database connection.
   *
   * This method uses the shared pool-based database instance from the manager.
   * The pg Pool handles connection management internally, automatically acquiring
   * and releasing connections for each query. This avoids race conditions that
   * could occur with manual client management and shared state.
   *
   * Note: The this.db instance is set once in the constructor from manager.getDatabase()
   * and is backed by a connection pool, so concurrent operations are safe.
   *
   * @template T
   * @param {() => Promise<T>} operation - The operation to be executed with the database connection.
   * @returns {Promise<T>} A promise that resolves with the result of the operation.
   */
  protected async withDatabase<T>(operation: () => Promise<T>): Promise<T> {
    return await this.withRetry(async () => {
      // Use the pool-based database instance from the manager
      // The pool handles connection acquisition/release internally for each query
      // This avoids the race condition of manually managing this.db state
      return await operation();
    });
  }

  /**
   * Asynchronously initializes the PgDatabaseAdapter by running migrations using the manager.
   * Logs a success message if initialization is successful, otherwise logs an error message.
   *
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */
  async init(): Promise<void> {
    logger.debug({ src: "plugin:sql" }, "PgDatabaseAdapter initialized");
  }

  /**
   * Checks if the database connection is ready and active.
   * @returns {Promise<boolean>} A Promise that resolves to true if the connection is healthy.
   */
  async isReady(): Promise<boolean> {
    return this.manager.testConnection();
  }

  /**
   * Asynchronously closes the manager associated with this instance.
   *
   * @returns A Promise that resolves once the manager is closed.
   */
  async close(): Promise<void> {
    await this.manager.close();
  }

  /**
   * Asynchronously retrieves the connection from the manager.
   *
```