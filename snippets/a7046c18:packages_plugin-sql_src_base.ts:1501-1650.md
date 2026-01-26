# a7046c18:packages_plugin-sql_src_base.ts:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
            src: "plugin:sql",
            type: params.type,
            roomId: params.roomId,
            entityId: params.entityId,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to create log entry",
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
  private sanitizeJsonObject(
    value: unknown,
    seen: WeakSet<object> = new WeakSet(),
  ): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === "string") {
      // Handle multiple cases that can cause PostgreSQL/PgLite JSON parsing errors:
      // 1. Remove null bytes (U+0000) which are not allowed in PostgreSQL text fields
      // 2. Escape single backslashes that might be interpreted as escape sequences
      // 3. Fix broken Unicode escape sequences (\u not followed by 4 hex digits)
      return value
        .replace(/\u0000/g, "") // Remove null bytes
        .replace(/\\(?!["\\/bfnrtu])/g, "\\\\") // Escape single backslashes not part of valid escape sequences
        .replace(/\\u(?![0-9a-fA-F]{4})/g, "\\\\u"); // Fix malformed Unicode escape sequences
    }

    if (typeof value === "object") {
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
            typeof key === "string"
              ? key
                  .replace(/\u0000/g, "")
                  .replace(/\\u(?![0-9a-fA-F]{4})/g, "\\\\u")
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
   */
  async getLogs(params: {
    entityId?: UUID;
    roomId?: UUID;
    type?: string;
    count?: number;
    offset?: number;
  }): Promise<Log[]> {
    const { entityId, roomId, type, count, offset } = params;

    // Use withEntityContext for RLS only when entityId is provided
    // Without entityId, bypass RLS to see all logs (for non-RLS mode)
    // Note: No WHERE filter on entityId - RLS handles access control automatically
    return this.withEntityContext(entityId ?? null, async (tx) => {
      const result = await tx
        .select()
        .from(logTable)
        .where(
          and(
            roomId ? eq(logTable.roomId, roomId) : undefined,
            type ? eq(logTable.type, type) : undefined,
          ),
        )
        .orderBy(desc(logTable.createdAt))
        .limit(count ?? 10)
        .offset(offset ?? 0);

      const logs = result.map((log) => ({
        ...log,
        id: log.id as UUID,
        entityId: log.entityId as UUID,
        roomId: log.roomId as UUID,
        type: log.type as string,
        body: log.body as LogBody,
        createdAt: new Date(log.createdAt as string | number | Date),
      }));

      if (logs.length === 0) return [];

      return logs;
    });
  }

  async getAgentRunSummaries(
    params: {
      limit?: number;
      roomId?: UUID;
```