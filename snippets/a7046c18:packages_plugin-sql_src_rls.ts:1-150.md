# a7046c18:packages_plugin-sql_src_rls.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { type IDatabaseAdapter, logger, validateUuid } from "@elizaos/core";
import { eq, sql } from "drizzle-orm";
import { agentTable } from "./schema/agent";
import { serverTable } from "./schema/server";
import { getDb } from "./types";

/**
 * PostgreSQL Row-Level Security (RLS) for Multi-Server and Entity Isolation
 *
 * This module provides two layers of database-level security:
 *
 * 1. **Server RLS** - Multi-server isolation
 *    - Isolates data between different elizaOS server instances
 *    - Uses `server_id` column added dynamically to all tables
 *    - Server context set via PostgreSQL `application_name` connection parameter
 *    - Prevents data leakage between different deployments/environments
 *
 * 2. **Entity RLS** - User/agent-level privacy isolation
 *    - Isolates data between different users (Clients (plugins/API) users)
 *    - Uses `entity_id`, `author_id`, or joins via `participants` table
 *    - Entity context set via `app.entity_id` transaction-local variable
 *    - Provides DM privacy and multi-user isolation within a server
 *
 * CRITICAL SECURITY REQUIREMENTS:
 * - RLS policies DO NOT apply to PostgreSQL superuser accounts
 * - Use a REGULAR (non-superuser) database user
 * - Grant only necessary permissions (CREATE, SELECT, INSERT, UPDATE, DELETE)
 * - NEVER use the 'postgres' superuser or any superuser account
 * - Superusers bypass ALL RLS policies by design, defeating the isolation mechanism
 *
 * ARCHITECTURE:
 * - Server RLS: Uses PostgreSQL `application_name` (set at connection pool level)
 * - Entity RLS: Uses `SET LOCAL app.entity_id` (set per transaction)
 * - Policies use FORCE ROW LEVEL SECURITY to enforce even for table owners
 * - Automatic index creation for performance (`server_id`, `entity_id`, `room_id`)
 *
 * @module rls
 */

/**
 * Install PostgreSQL functions required for Server RLS and Entity RLS
 *
 * This function creates all necessary PostgreSQL stored procedures for both
 * Server RLS (multi-server isolation) and Entity RLS (user privacy isolation).
 *
 * **Server RLS Functions Created:**
 * - `current_server_id()` - Returns server UUID from `application_name`
 * - `add_server_isolation(schema, table)` - Adds Server RLS to a single table
 * - `apply_rls_to_all_tables()` - Applies Server RLS to all eligible tables
 *
 * **Entity RLS Functions Created:**
 * - `current_entity_id()` - Returns entity UUID from `app.entity_id` session variable
 * - `add_entity_isolation(schema, table)` - Adds Entity RLS to a single table
 * - `apply_entity_rls_to_all_tables()` - Applies Entity RLS to all eligible tables
 *
 * **Security Model:**
 * - Server RLS: Isolation between different elizaOS instances (environments/deployments)
 * - Entity RLS: Isolation between different users within a server instance
 * - Both layers stack - a user can only see data from their server AND their accessible entities
 *
 * **Important Notes:**
 * - Must be called before `applyRLSToNewTables()` or `applyEntityRLSToAllTables()`
 * - Creates `servers` table if it doesn't exist
 * - Automatically calls `installEntityRLS()` to set up both layers
 * - Uses `%I` identifier quoting in format() to prevent SQL injection
 * - Policies use FORCE RLS to enforce even for table owners
 *
 * @param adapter - Database adapter with access to the Drizzle ORM instance
 * @returns Promise that resolves when all RLS functions are installed
 * @throws {Error} If database connection fails or SQL execution fails
 *
 * @example
 * ```typescript
 * // Install RLS functions on server startup
 * await installRLSFunctions(database);
 * await getOrCreateRlsServer(database, serverId);
 * await setServerContext(database, serverId);
 * await applyRLSToNewTables(database);
 * ```
 */
export async function installRLSFunctions(
  adapter: IDatabaseAdapter,
): Promise<void> {
  const db = getDb(adapter);

  // Create servers table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS servers (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )
  `);

  // Function to get server_id from application_name
  // This allows multi-tenant isolation without needing superuser privileges
  // Each connection pool sets application_name = server_id
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION current_server_id() RETURNS UUID AS $$
    DECLARE
      app_name TEXT;
    BEGIN
      app_name := NULLIF(current_setting('application_name', TRUE), '');

      -- Return NULL if application_name is not set or not a valid UUID
      -- This allows admin queries to work without RLS restrictions
      BEGIN
        RETURN app_name::UUID;
      EXCEPTION WHEN OTHERS THEN
        RETURN NULL;
      END;
    END;
    $$ LANGUAGE plpgsql STABLE;
  `);

  // Function to add RLS to a table
  // SECURITY: Uses format() with %I to safely quote identifiers and prevent SQL injection
  // This function:
  // 1. Adds server_id column if it doesn't exist (with DEFAULT current_server_id())
  // 2. Backfills/reassigns orphaned data to current server
  // 3. Creates an index on server_id for query performance
  // 4. Enables FORCE ROW LEVEL SECURITY (enforces RLS even for table owners)
  // 5. Creates an isolation policy that filters rows by server_id
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION add_server_isolation(
      schema_name text,
      table_name text
    ) RETURNS void AS $$
    DECLARE
      full_table_name text;
      column_exists boolean;
      orphaned_count bigint;
    BEGIN
      full_table_name := schema_name || '.' || table_name;

      -- Check if server_id column already exists
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE information_schema.columns.table_schema = schema_name
          AND information_schema.columns.table_name = add_server_isolation.table_name
          AND information_schema.columns.column_name = 'server_id'
      ) INTO column_exists;

      -- Add server_id column if missing (DEFAULT populates it automatically for new rows)
      IF NOT column_exists THEN
        EXECUTE format('ALTER TABLE %I.%I ADD COLUMN server_id UUID DEFAULT current_server_id()', schema_name, table_name);

        -- Backfill existing rows with current server_id
        -- This ensures all existing data belongs to the server instance that is enabling RLS
        EXECUTE format('UPDATE %I.%I SET server_id = current_server_id() WHERE server_id IS NULL', schema_name, table_name);
```