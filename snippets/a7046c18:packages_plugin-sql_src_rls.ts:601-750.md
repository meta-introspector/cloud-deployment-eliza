# a7046c18:packages_plugin-sql_src_rls.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    BEGIN
      full_table_name := schema_name || '.' || table_name;

      -- Check which columns exist
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE information_schema.columns.table_schema = schema_name
          AND information_schema.columns.table_name = add_entity_isolation.table_name
          AND information_schema.columns.column_name = 'entity_id'
      ) INTO has_entity_id;

      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE information_schema.columns.table_schema = schema_name
          AND information_schema.columns.table_name = add_entity_isolation.table_name
          AND information_schema.columns.column_name = 'author_id'
      ) INTO has_author_id;

      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE information_schema.columns.table_schema = schema_name
          AND information_schema.columns.table_name = add_entity_isolation.table_name
          AND information_schema.columns.column_name = 'room_id'
      ) INTO has_room_id;

      -- Skip if no entity-related columns
      IF NOT (has_entity_id OR has_author_id OR has_room_id) THEN
        RAISE NOTICE '[Entity RLS] Skipping %.%: no entity columns found', schema_name, table_name;
        RETURN;
      END IF;

      -- Determine which column to use for entity filtering
      -- Priority: room_id (shared access via participants) > entity_id/author_id (direct access)
      --
      -- SPECIAL CASE: participants table must use direct entity_id to avoid infinite recursion
      IF table_name = 'participants' AND has_entity_id THEN
        entity_column_name := 'entity_id';
        room_column_name := NULL;
      ELSIF has_room_id THEN
        room_column_name := 'room_id';
        entity_column_name := NULL;
      ELSIF has_entity_id THEN
        entity_column_name := 'entity_id';
        room_column_name := NULL;
      ELSIF has_author_id THEN
        entity_column_name := 'author_id';
        room_column_name := NULL;
      ELSE
        entity_column_name := NULL;
        room_column_name := NULL;
      END IF;

      -- Enable RLS on the table
      EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);
      EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', schema_name, table_name);

      -- Drop existing entity policies if present
      EXECUTE format('DROP POLICY IF EXISTS entity_isolation_policy ON %I.%I', schema_name, table_name);

      -- CASE 1: Table has room_id (shared access via participants)
      IF room_column_name IS NOT NULL THEN
        -- Determine the corresponding column name in participants table
        -- If the table has room_id, look for room_id in participants.room_id
        -- participants table uses: entity_id (for participant), room_id (for room)
        -- RESTRICTIVE: Must pass BOTH server RLS AND entity RLS (combined with AND)

        -- Build policy with or without NULL check based on require_entity parameter
        IF require_entity THEN
          -- STRICT MODE: Entity context is REQUIRED (blocks NULL entity_id)
          EXECUTE format('
            CREATE POLICY entity_isolation_policy ON %I.%I
            AS RESTRICTIVE
            USING (
              current_entity_id() IS NOT NULL
              AND %I IN (
                SELECT room_id
                FROM participants
                WHERE entity_id = current_entity_id()
              )
            )
            WITH CHECK (
              current_entity_id() IS NOT NULL
              AND %I IN (
                SELECT room_id
                FROM participants
                WHERE entity_id = current_entity_id()
              )
            )
          ', schema_name, table_name, room_column_name, room_column_name);
          RAISE NOTICE '[Entity RLS] Applied STRICT RESTRICTIVE to %.% (via % → participants.room_id, entity REQUIRED)', schema_name, table_name, room_column_name;
        ELSE
          -- PERMISSIVE MODE: NULL entity_id allows system/admin access
          EXECUTE format('
            CREATE POLICY entity_isolation_policy ON %I.%I
            AS RESTRICTIVE
            USING (
              current_entity_id() IS NULL
              OR %I IN (
                SELECT room_id
                FROM participants
                WHERE entity_id = current_entity_id()
              )
            )
            WITH CHECK (
              current_entity_id() IS NULL
              OR %I IN (
                SELECT room_id
                FROM participants
                WHERE entity_id = current_entity_id()
              )
            )
          ', schema_name, table_name, room_column_name, room_column_name);
          RAISE NOTICE '[Entity RLS] Applied PERMISSIVE RESTRICTIVE to %.% (via % → participants.room_id, NULL allowed)', schema_name, table_name, room_column_name;
        END IF;

      -- CASE 2: Table has direct entity_id or author_id column
      ELSIF entity_column_name IS NOT NULL THEN
        -- RESTRICTIVE: Must pass BOTH server RLS AND entity RLS (combined with AND)

        IF require_entity THEN
          -- STRICT MODE: Entity context is REQUIRED
          EXECUTE format('
            CREATE POLICY entity_isolation_policy ON %I.%I
            AS RESTRICTIVE
            USING (
              current_entity_id() IS NOT NULL
              AND %I = current_entity_id()
            )
            WITH CHECK (
              current_entity_id() IS NOT NULL
              AND %I = current_entity_id()
            )
          ', schema_name, table_name, entity_column_name, entity_column_name);
          RAISE NOTICE '[Entity RLS] Applied STRICT RESTRICTIVE to %.% (direct column: %, entity REQUIRED)', schema_name, table_name, entity_column_name;
        ELSE
          -- PERMISSIVE MODE: NULL entity_id allows system/admin access
          EXECUTE format('
            CREATE POLICY entity_isolation_policy ON %I.%I
            AS RESTRICTIVE
            USING (
              current_entity_id() IS NULL
              OR %I = current_entity_id()
            )
            WITH CHECK (
              current_entity_id() IS NULL
              OR %I = current_entity_id()
            )
          ', schema_name, table_name, entity_column_name, entity_column_name);
          RAISE NOTICE '[Entity RLS] Applied PERMISSIVE RESTRICTIVE to %.% (direct column: %, NULL allowed)', schema_name, table_name, entity_column_name;
        END IF;
```