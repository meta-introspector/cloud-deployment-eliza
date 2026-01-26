# a7046c18:packages_core_typescript_src_types_database.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/database.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

export interface AgentRunSummaryResult {
  runs: AgentRunSummary[];
  total: number;
  hasMore: boolean;
}

/**
 * Interface for database operations
 */
export interface IDatabaseAdapter {
  /** Database instance */
  db: unknown;

  /** Initialize database connection */
  initialize(
    config?: Record<string, string | number | boolean | null>,
  ): Promise<void>;

  /** Initialize database connection */
  init(): Promise<void>;

  /**
   * Run plugin schema migrations for all registered plugins
   * @param plugins Array of plugins with their schemas
   * @param options Migration options (verbose, force, dryRun, etc.)
   */
  runPluginMigrations?(
    plugins: Array<{
      name: string;
      schema?: Record<
        string,
        string | number | boolean | null | Record<string, unknown>
      >;
    }>,
    options?: {
      verbose?: boolean;
      force?: boolean;
      dryRun?: boolean;
    },
  ): Promise<void>;

  /**
   * Run database migrations from migration files
   * @param migrationsPaths Optional array of migration file paths
   */
  runMigrations?(migrationsPaths?: string[]): Promise<void>;

  /** Check if the database connection is ready */
  isReady(): Promise<boolean>;

  /** Close database connection */
  close(): Promise<void>;

  getConnection(): Promise<unknown>;

  /**
   * Execute a callback with entity context for Entity RLS
   * @param entityId - The entity ID to set as context
   * @param callback - The callback to execute within the entity context
   * @returns The result of the callback
   */
  withEntityContext?<T>(
    entityId: UUID | null,
    callback: () => Promise<T>,
  ): Promise<T>;

  getAgent(agentId: UUID): Promise<Agent | null>;

  /** Get all agents */
  getAgents(): Promise<Partial<Agent>[]>;

  createAgent(agent: Partial<Agent>): Promise<boolean>;

  updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean>;

  deleteAgent(agentId: UUID): Promise<boolean>;

  ensureEmbeddingDimension(dimension: number): Promise<void>;

  /** Get entity by IDs */
  getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null>;

  /** Get entities for room */
  getEntitiesForRoom(
    roomId: UUID,
    includeComponents?: boolean,
  ): Promise<Entity[]>;

  /** Create new entities */
  createEntities(entities: Entity[]): Promise<boolean>;

  /** Update entity */
  updateEntity(entity: Entity): Promise<void>;

  /** Get component by ID */
  getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component | null>;

  /** Get all components for an entity */
  getComponents(
    entityId: UUID,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component[]>;

  /** Create component */
  createComponent(component: Component): Promise<boolean>;

  /** Update component */
  updateComponent(component: Component): Promise<void>;

  /** Delete component */
  deleteComponent(componentId: UUID): Promise<void>;

  /** Get memories matching criteria */
  getMemories(params: {
    entityId?: UUID;
    agentId?: UUID;
    count?: number;
    offset?: number;
    unique?: boolean;
    tableName: string;
    start?: number;
    end?: number;
    roomId?: UUID;
    worldId?: UUID;
  }): Promise<Memory[]>;

  getMemoryById(id: UUID): Promise<Memory | null>;

  getMemoriesByIds(ids: UUID[], tableName?: string): Promise<Memory[]>;

  getMemoriesByRoomIds(params: {
    tableName: string;
    roomIds: UUID[];
    limit?: number;
  }): Promise<Memory[]>;

  getCachedEmbeddings(params: {
    query_table_name: string;
    query_threshold: number;
    query_input: string;
    query_field_name: string;
    query_field_sub_name: string;
    query_match_count: number;
```