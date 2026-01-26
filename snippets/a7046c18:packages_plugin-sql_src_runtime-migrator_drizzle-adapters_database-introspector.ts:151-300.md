# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_database-introspector.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/database-introspector.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        checkConstraints: checksObject,
      };

      // Track schemas
      if (tableSchema && tableSchema !== "public") {
        schemas[tableSchema] = tableSchema;
      }
    }

    // Get enums if any
    const enumsResult = await this.getEnums(schemaName);
    for (const enumInfo of enumsResult) {
      const key = `${enumInfo.schema}.${enumInfo.name}`;
      if (!enums[key]) {
        enums[key] = {
          name: enumInfo.name,
          schema: enumInfo.schema,
          values: [],
        };
      }
      enums[key].values.push(enumInfo.value);
    }

    logger.info(
      { src: "plugin:sql", tableCount: Object.keys(tables).length },
      "Database introspection complete",
    );

    return {
      version: "7",
      dialect: "postgresql",
      tables,
      schemas,
      enums,
      _meta: {
        schemas: {},
        tables: {},
        columns: {},
      },
    };
  }

  /**
   * Get all tables in a schema
   */
  private async getTables(schemaName: string): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            table_schema,
            table_name
          FROM information_schema.tables
          WHERE table_schema = ${schemaName}
            AND table_type = 'BASE TABLE'
          ORDER BY table_name`,
    );
    return result.rows;
  }

  /**
   * Get columns for a table
   */
  private async getColumns(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            a.attname AS column_name,
            CASE 
              WHEN a.attnotnull THEN 'NO'
              ELSE 'YES'
            END AS is_nullable,
            CASE 
              WHEN a.atttypid = ANY ('{int,int8,int2}'::regtype[]) 
              AND EXISTS (
                SELECT FROM pg_attrdef ad
                WHERE ad.adrelid = a.attrelid 
                AND ad.adnum = a.attnum 
                AND pg_get_expr(ad.adbin, ad.adrelid) = 'nextval(''' 
                    || pg_get_serial_sequence(a.attrelid::regclass::text, a.attname)::regclass || '''::regclass)'
              )
              THEN CASE a.atttypid
                WHEN 'int'::regtype THEN 'serial'
                WHEN 'int8'::regtype THEN 'bigserial'
                WHEN 'int2'::regtype THEN 'smallserial'
              END
              ELSE format_type(a.atttypid, a.atttypmod)
            END AS data_type,
            pg_get_expr(ad.adbin, ad.adrelid) AS column_default,
            CASE 
              WHEN con.contype = 'p' THEN true
              ELSE false
            END AS is_primary
          FROM pg_attribute a
          JOIN pg_class cls ON cls.oid = a.attrelid
          JOIN pg_namespace ns ON ns.oid = cls.relnamespace
          LEFT JOIN pg_attrdef ad ON ad.adrelid = a.attrelid AND ad.adnum = a.attnum
          LEFT JOIN pg_constraint con ON con.conrelid = a.attrelid 
            AND a.attnum = ANY(con.conkey) 
            AND con.contype = 'p'
          WHERE 
            a.attnum > 0
            AND NOT a.attisdropped
            AND ns.nspname = ${schemaName}
            AND cls.relname = ${tableName}
          ORDER BY a.attnum`,
    );
    return result.rows;
  }

  /**
   * Get indexes for a table
   */
  private async getIndexes(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            i.relname AS name,
            idx.indisunique AS is_unique,
            idx.indisprimary AS is_primary,
            con.contype = 'u' AS is_unique_constraint,
            ARRAY(
              SELECT a.attname
              FROM pg_attribute a
              WHERE a.attrelid = idx.indrelid
                AND a.attnum = ANY(idx.indkey::int[])
              ORDER BY a.attnum
            ) AS columns,
            am.amname AS method
          FROM pg_index idx
          JOIN pg_class i ON i.oid = idx.indexrelid
          JOIN pg_class c ON c.oid = idx.indrelid
          JOIN pg_namespace n ON n.oid = c.relnamespace
          JOIN pg_am am ON am.oid = i.relam
          LEFT JOIN pg_constraint con ON con.conindid = idx.indexrelid
          WHERE n.nspname = ${schemaName}
            AND c.relname = ${tableName}`,
    );
    return result.rows;
  }

  /**
   * Get foreign keys for a table
   */
  private async getForeignKeys(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
```