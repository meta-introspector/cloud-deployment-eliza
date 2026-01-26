# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_database-introspector.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/database-introspector.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const result = await this.db.execute(
      sql`SELECT
            con.conname AS name,
            att.attname AS column_name,
            fnsp.nspname AS foreign_table_schema,
            frel.relname AS foreign_table_name,
            fatt.attname AS foreign_column_name,
            CASE con.confupdtype
              WHEN 'a' THEN 'NO ACTION'
              WHEN 'r' THEN 'RESTRICT'
              WHEN 'n' THEN 'SET NULL'
              WHEN 'c' THEN 'CASCADE'
              WHEN 'd' THEN 'SET DEFAULT'
            END AS update_rule,
            CASE con.confdeltype
              WHEN 'a' THEN 'NO ACTION'
              WHEN 'r' THEN 'RESTRICT'
              WHEN 'n' THEN 'SET NULL'
              WHEN 'c' THEN 'CASCADE'
              WHEN 'd' THEN 'SET DEFAULT'
            END AS delete_rule
          FROM pg_catalog.pg_constraint con
          JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
          JOIN pg_catalog.pg_namespace nsp ON nsp.oid = con.connamespace
          LEFT JOIN pg_catalog.pg_attribute att ON att.attnum = ANY (con.conkey)
            AND att.attrelid = con.conrelid
          LEFT JOIN pg_catalog.pg_class frel ON frel.oid = con.confrelid
          LEFT JOIN pg_catalog.pg_namespace fnsp ON fnsp.oid = frel.relnamespace
          LEFT JOIN pg_catalog.pg_attribute fatt ON fatt.attnum = ANY (con.confkey)
            AND fatt.attrelid = con.confrelid
          WHERE con.contype = 'f'
            AND nsp.nspname = ${schemaName}
            AND rel.relname = ${tableName}`,
    );
    return result.rows;
  }

  /**
   * Get primary keys for a table
   */
  private async getPrimaryKeys(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            con.conname AS name,
            ARRAY(
              SELECT a.attname
              FROM pg_attribute a
              WHERE a.attrelid = con.conrelid
                AND a.attnum = ANY(con.conkey)
              ORDER BY a.attnum
            ) AS columns
          FROM pg_constraint con
          JOIN pg_class rel ON rel.oid = con.conrelid
          JOIN pg_namespace nsp ON nsp.oid = con.connamespace
          WHERE con.contype = 'p'
            AND nsp.nspname = ${schemaName}
            AND rel.relname = ${tableName}`,
    );
    return result.rows;
  }

  /**
   * Get unique constraints for a table
   */
  private async getUniqueConstraints(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            con.conname AS name,
            ARRAY(
              SELECT a.attname
              FROM pg_attribute a
              WHERE a.attrelid = con.conrelid
                AND a.attnum = ANY(con.conkey)
              ORDER BY a.attnum
            ) AS columns
          FROM pg_constraint con
          JOIN pg_class rel ON rel.oid = con.conrelid
          JOIN pg_namespace nsp ON nsp.oid = con.connamespace
          WHERE con.contype = 'u'
            AND nsp.nspname = ${schemaName}
            AND rel.relname = ${tableName}`,
    );
    return result.rows;
  }

  /**
   * Get check constraints for a table
   */
  private async getCheckConstraints(
    schemaName: string,
    tableName: string,
  ): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            con.conname AS name,
            pg_get_constraintdef(con.oid) AS definition
          FROM pg_constraint con
          JOIN pg_class rel ON rel.oid = con.conrelid
          JOIN pg_namespace nsp ON nsp.oid = con.connamespace
          WHERE con.contype = 'c'
            AND nsp.nspname = ${schemaName}
            AND rel.relname = ${tableName}`,
    );
    return result.rows;
  }

  /**
   * Get enums in a schema
   */
  private async getEnums(schemaName: string): Promise<any[]> {
    const result = await this.db.execute(
      sql`SELECT 
            n.nspname AS schema,
            t.typname AS name,
            e.enumlabel AS value,
            e.enumsortorder AS sort_order
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = ${schemaName}
          ORDER BY schema, name, sort_order`,
    );
    return result.rows;
  }

  /**
   * Parse default value for a column
   */
  private parseDefault(
    defaultValue: string,
    dataType: string,
  ): string | undefined {
    if (!defaultValue) return undefined;

    // Remove the type cast if present (e.g., "'value'::text" -> "'value'")
    const match = defaultValue.match(/^'(.*)'::/);
    if (match) {
      return `'${match[1]}'`;
    }

    // Handle nextval for sequences
    if (defaultValue.includes("nextval(")) {
      return undefined; // Serial types handle this automatically
    }
```