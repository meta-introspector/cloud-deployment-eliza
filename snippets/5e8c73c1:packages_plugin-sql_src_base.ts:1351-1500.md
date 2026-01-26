# 5e8c73c1:packages_plugin-sql_src_base.ts:1351-1500

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1351-1500
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
                        WHERE e.memory_id IS NOT NULL
                    )
                    SELECT
                        embedding,
                        levenshtein(${opts.query_input}, content_text) as levenshtein_score
                    FROM embedded_text
                    WHERE levenshtein(${opts.query_input}, content_text) <= ${opts.query_threshold}
                    ORDER BY levenshtein_score
                    LIMIT ${opts.query_match_count}
                `);

        return results.rows
          .map((row) => ({
            embedding: Array.isArray(row.embedding)
              ? row.embedding
              : typeof row.embedding === 'string'
                ? JSON.parse(row.embedding)
                : [],
            levenshtein_score: Number(row.levenshtein_score),
          }))
          .filter((row) => Array.isArray(row.embedding));
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            tableName: opts.query_table_name,
            fieldName: opts.query_field_name,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to get cached embeddings'
        );
        if (
          error instanceof Error &&
          error.message === 'levenshtein argument exceeds maximum length of 255 characters'
        ) {
          return [];
        }
        throw error;
      }
    });
  }

  /**
   * Asynchronously logs an event in the database.
   * @param {Object} params - The parameters for logging an event.
   * @param {Object} params.body - The body of the event to log.
   * @param {UUID} params.entityId - The ID of the entity associated with the event.
   * @param {UUID} params.roomId - The ID of the room associated with the event.
   * @param {string} params.type - The type of the event to log.
   * @returns {Promise<void>} A Promise that resolves when the event is logged.
   */
  async log(params: {
    body: { [key: string]: unknown };
    entityId: UUID;
    roomId: UUID;
    type: string;
  }): Promise<void> {
    return this.withDatabase(async () => {
      try {
        // Sanitize JSON body to prevent Unicode escape sequence errors
        const sanitizedBody = this.sanitizeJsonObject(params.body);

        // Serialize to JSON string first for an additional layer of protection
        // This ensures any problematic characters are properly escaped during JSON serialization
        const jsonString = JSON.stringify(sanitizedBody);

        // Use withEntityContext to set Entity RLS context before inserting
        // This ensures the log entry passes STRICT Entity RLS policy
        await this.withEntityContext(params.entityId, async (tx) => {
          await tx.insert(logTable).values({
            body: sql`${jsonString}::jsonb`,
            entityId: params.entityId,
            roomId: params.roomId,
            type: params.type,
          });
        });
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            type: params.type,
            roomId: params.roomId,
            entityId: params.entityId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to create log entry'
        );
        throw error;
      }
    });
  }

  /**
   * Sanitizes a JSON object by replacing problematic Unicode escape sequences
   * that could cause errors during JSON serialization/storage
   *
   * @param value - The value to sanitize
   * @returns The sanitized value
   */
  private sanitizeJsonObject(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      // Handle multiple cases that can cause PostgreSQL/PgLite JSON parsing errors:
      // 1. Remove null bytes (U+0000) which are not allowed in PostgreSQL text fields
      // 2. Escape single backslashes that might be interpreted as escape sequences
      // 3. Fix broken Unicode escape sequences (\u not followed by 4 hex digits)
      return value
        .replace(/\u0000/g, '') // Remove null bytes
        .replace(/\\(?!["\\/bfnrtu])/g, '\\\\') // Escape single backslashes not part of valid escape sequences
        .replace(/\\u(?![0-9a-fA-F]{4})/g, '\\\\u'); // Fix malformed Unicode escape sequences
    }

    if (typeof value === 'object') {
      if (seen.has(value as object)) {
        return null;
      } else {
        seen.add(value as object);
      }

      if (Array.isArray(value)) {
        return value.map((item) => this.sanitizeJsonObject(item, seen));
      } else {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
          // Also sanitize object keys
          const sanitizedKey =
            typeof key === 'string'
              ? key.replace(/\u0000/g, '').replace(/\\u(?![0-9a-fA-F]{4})/g, '\\\\u')
              : key;
          result[sanitizedKey] = this.sanitizeJsonObject(val, seen);
        }
        return result;
      }
    }

    return value;
  }

  /**
   * Asynchronously retrieves logs from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving logs.
   * @param {UUID} params.entityId - The ID of the entity associated with the logs.
   * @param {UUID} [params.roomId] - The ID of the room associated with the logs.
   * @param {string} [params.type] - The type of the logs to retrieve.
   * @param {number} [params.count] - The maximum number of logs to retrieve.
   * @param {number} [params.offset] - The offset to retrieve logs from.
   * @returns {Promise<Log[]>} A Promise that resolves to an array of logs.
```