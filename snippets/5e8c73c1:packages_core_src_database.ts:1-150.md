# 5e8c73c1:packages_core_src_database.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/database.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type {
  Agent,
  Component,
  Entity,
  IDatabaseAdapter,
  Log,
  Memory,
  MemoryMetadata,
  Participant,
  Relationship,
  Room,
  Task,
  UUID,
  World,
} from './types';

/**
 * Database adapter class to be extended by individual database adapters.
 *
 * @template DB - The type of the database instance.
 * @abstract
 * implements IDatabaseAdapter
 */
export abstract class DatabaseAdapter<DB = unknown> implements IDatabaseAdapter {
  /**
   * The database instance.
   */
  db!: DB;

  /**
   * Initialize the database adapter.
   * @param config - Optional configuration object
   * @returns A Promise that resolves when initialization is complete.
   */
  abstract initialize(config?: Record<string, string | number | boolean | null>): Promise<void>;

  /**
   * Initialize the database adapter.
   * @returns A Promise that resolves when initialization is complete.
   */
  abstract init(): Promise<void>;

  /**
   * Run plugin schema migrations for all registered plugins
   * @param plugins Array of plugins with their schemas
   * @param options Migration options (verbose, force, dryRun, etc.)
   * @returns A Promise that resolves when migrations are complete.
   */
  abstract runPluginMigrations(
    plugins: Array<{
      name: string;
      schema?: Record<string, string | number | boolean | null | Record<string, unknown>>;
    }>,
    options?: {
      verbose?: boolean;
      force?: boolean;
      dryRun?: boolean;
    }
  ): Promise<void>;

  /**
   * Check if the database connection is ready.
   * @returns A Promise that resolves to true if the database is ready, false otherwise.
   */
  abstract isReady(): Promise<boolean>;

  /**
   * Optional close method for the database adapter.
   * @returns A Promise that resolves when closing is complete.
   */
  abstract close(): Promise<void>;

  /**
   * Retrieves a connection to the database.
   * @returns A Promise that resolves to the database connection.
   */
  abstract getConnection(): Promise<DB>;

  /**
   * Retrieves an account by its ID.
   * @param entityIds The UUIDs of the user account to retrieve.
   * @returns A Promise that resolves to the Entity object or null if not found.
   */
  abstract getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null>;

  abstract getEntitiesForRoom(roomId: UUID, includeComponents?: boolean): Promise<Entity[]>;

  /**
   * Creates a new entities in the database.
   * @param entities The entity objects to create.
   * @returns A Promise that resolves when the account creation is complete.
   */
  abstract createEntities(entities: Entity[]): Promise<boolean>;

  /**
   * Updates an existing entity in the database.
   * @param entity The entity object with updated properties.
   * @returns A Promise that resolves when the account update is complete.
   */
  abstract updateEntity(entity: Entity): Promise<void>;

  /**
   * Retrieves a single component by entity ID and type.
   * @param entityId The UUID of the entity the component belongs to
   * @param type The type identifier for the component
   * @param worldId Optional UUID of the world the component belongs to
   * @param sourceEntityId Optional UUID of the source entity
   * @returns Promise resolving to the Component if found, null otherwise
   */
  abstract getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID
  ): Promise<Component | null>;

  /**
   * Retrieves all components for an entity.
   * @param entityId The UUID of the entity to get components for
   * @param worldId Optional UUID of the world to filter components by
   * @param sourceEntityId Optional UUID of the source entity to filter by
   * @returns Promise resolving to array of Component objects
   */
  abstract getComponents(
    entityId: UUID,
    worldId?: UUID,
    sourceEntityId?: UUID
  ): Promise<Component[]>;

  /**
   * Creates a new component in the database.
   * @param component The component object to create
   * @returns Promise resolving to true if creation was successful
   */
  abstract createComponent(component: Component): Promise<boolean>;

  /**
   * Updates an existing component in the database.
   * @param component The component object with updated properties
   * @returns Promise that resolves when the update is complete
   */
  abstract updateComponent(component: Component): Promise<void>;

  /**
   * Deletes a component from the database.
   * @param componentId The UUID of the component to delete
   * @returns Promise that resolves when the deletion is complete
   */
  abstract deleteComponent(componentId: UUID): Promise<void>;

```