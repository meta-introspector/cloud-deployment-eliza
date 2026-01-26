# a7046c18:packages_plugin-sql_src_base.ts:1801-1950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:1801-1950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      if (runIds.length > 0) {
        const runIdArray = sql`array[${sql.join(
          runIds.map((id) => sql`${id}`),
          sql`, `,
        )}]::text[]`;

        const actionSummary = await this.db.execute(sql`
          SELECT
            body->>'runId' as "runId",
            COUNT(*)::int as "actions",
            SUM(CASE WHEN COALESCE(body->'result'->>'success', 'true') = 'false' THEN 1 ELSE 0 END)::int as "errors",
            SUM(COALESCE((body->>'promptCount')::int, 0))::int as "modelCalls"
          FROM ${logTable}
          WHERE type = 'action'
            AND body->>'runId' = ANY(${runIdArray})
          GROUP BY body->>'runId'
        `);

        const actionRows = (actionSummary.rows ?? []) as Array<{
          runId: string;
          actions: number | string;
          errors: number | string;
          modelCalls: number | string;
        }>;

        for (const row of actionRows) {
          const counts = runCounts.get(row.runId);
          if (!counts) continue;
          counts.actions += Number(row.actions ?? 0);
          counts.errors += Number(row.errors ?? 0);
          counts.modelCalls += Number(row.modelCalls ?? 0);
        }

        const evaluatorSummary = await this.db.execute(sql`
          SELECT
            body->>'runId' as "runId",
            COUNT(*)::int as "evaluators"
          FROM ${logTable}
          WHERE type = 'evaluator'
            AND body->>'runId' = ANY(${runIdArray})
          GROUP BY body->>'runId'
        `);

        const evaluatorRows = (evaluatorSummary.rows ?? []) as Array<{
          runId: string;
          evaluators: number | string;
        }>;

        for (const row of evaluatorRows) {
          const counts = runCounts.get(row.runId);
          if (!counts) continue;
          counts.evaluators += Number(row.evaluators ?? 0);
        }

        const genericSummary = await this.db.execute(sql`
          SELECT
            body->>'runId' as "runId",
            COUNT(*) FILTER (WHERE type LIKE 'useModel:%')::int as "modelLogs",
            COUNT(*) FILTER (WHERE type = 'embedding_event' AND body->>'status' = 'failed')::int as "embeddingErrors"
          FROM ${logTable}
          WHERE (type LIKE 'useModel:%' OR type = 'embedding_event')
            AND body->>'runId' = ANY(${runIdArray})
          GROUP BY body->>'runId'
        `);

        const genericRows = (genericSummary.rows ?? []) as Array<{
          runId: string;
          modelLogs: number | string;
          embeddingErrors: number | string;
        }>;

        for (const row of genericRows) {
          const counts = runCounts.get(row.runId);
          if (!counts) continue;
          counts.modelCalls += Number(row.modelLogs ?? 0);
          counts.errors += Number(row.embeddingErrors ?? 0);
        }
      }

      for (const run of limitedRuns) {
        run.counts = runCounts.get(run.runId) ?? {
          actions: 0,
          modelCalls: 0,
          errors: 0,
          evaluators: 0,
        };
      }

      return {
        runs: limitedRuns,
        total,
        hasMore,
      } satisfies AgentRunSummaryResult;
    });
  }

  /**
   * Asynchronously deletes a log from the database based on the provided parameters.
   * @param {UUID} logId - The ID of the log to delete.
   * @returns {Promise<void>} A Promise that resolves when the log is deleted.
   */
  async deleteLog(logId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.delete(logTable).where(eq(logTable.id, logId));
    });
  }

  /**
   * Asynchronously searches for memories in the database based on the provided parameters.
   * @param {Object} params - The parameters for searching for memories.
   * @param {string} params.tableName - The name of the table to search for memories in.
   * @param {number[]} params.embedding - The embedding to search for.
   * @param {number} [params.match_threshold] - The threshold for the cosine distance.
   * @param {number} [params.count] - The maximum number of memories to retrieve.
   * @param {boolean} [params.unique] - Whether to retrieve unique memories only.
   * @param {string} [params.query] - Optional query string for potential reranking.
   * @param {UUID} [params.roomId] - Optional room ID to filter by.
   * @param {UUID} [params.worldId] - Optional world ID to filter by.
   * @param {UUID} [params.entityId] - Optional entity ID to filter by.
   * @returns {Promise<Memory[]>} A Promise that resolves to an array of memories.
   */
  async searchMemories(params: {
    tableName: string;
    embedding: number[];
    match_threshold?: number;
    count?: number;
    unique?: boolean;
    query?: string;
    roomId?: UUID;
    worldId?: UUID;
    entityId?: UUID;
  }): Promise<Memory[]> {
    return await this.searchMemoriesByEmbedding(params.embedding, {
      match_threshold: params.match_threshold,
      count: params.count,
      // Pass direct scope fields down
      roomId: params.roomId,
      worldId: params.worldId,
      entityId: params.entityId,
      unique: params.unique,
      tableName: params.tableName,
    });
  }

  /**
   * Asynchronously searches for memories in the database based on the provided parameters.
   * @param {number[]} embedding - The embedding to search for.
   * @param {Object} params - The parameters for searching for memories.
   * @param {number} [params.match_threshold] - The threshold for the cosine distance.
```