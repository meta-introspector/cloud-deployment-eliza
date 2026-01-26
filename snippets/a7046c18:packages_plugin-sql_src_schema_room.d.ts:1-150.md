# a7046c18:packages_plugin-sql_src_schema_room.d.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/room.d.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Defines a table schema for 'rooms' in the database.
 *
 * @typedef {object} RoomTable
 * @property {string} id - The unique identifier for the room.
 * @property {string} agentId - The UUID of the agent associated with the room.
 * @property {string} source - The source of the room.
 * @property {string} type - The type of the room.
 * @property {string} messageServerId - The message server ID of the room.
 * @property {string} worldId - The UUID of the world associated with the room.
 * @property {string} name - The name of the room.
 * @property {object} metadata - Additional metadata for the room in JSON format.
 * @property {string} channelId - The channel ID of the room.
 * @property {number} createdAt - The timestamp of when the room was created.
 */
export declare const roomTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
  name: "rooms";
  schema: undefined;
  columns: {
    id: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "id";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    agentId: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "agent_id";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    source: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "source";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    type: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "type";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    messageServerId: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "message_server_id";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    worldId: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "world_id";
        tableName: "rooms";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    name: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "name";
        tableName: "rooms";
        dataType: "string";
```