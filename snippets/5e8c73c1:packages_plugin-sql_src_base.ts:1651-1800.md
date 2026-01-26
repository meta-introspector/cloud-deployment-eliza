# 5e8c73c1:packages_plugin-sql_src_base.ts:1651-1800

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1651-1800
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        } else if (
          eventStatus === 'completed' ||
          eventStatus === 'timeout' ||
          eventStatus === 'error'
        ) {
          summary.status = eventStatus;
          summary.endedAt = timestamp;
          if (summary.startedAt !== null) {
            summary.durationMs = Math.max(timestamp - summary.startedAt, 0);
          }
        }

        runMap.set(runId, summary);
      }

      let runs = Array.from(runMap.values());
      if (params.status && params.status !== 'all') {
        runs = runs.filter((run) => run.status === params.status);
      }

      runs.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));

      const total = runs.length;
      const limitedRuns = runs.slice(0, limit);
      const hasMore = total > limit;

      const runCounts = new Map<string, AgentRunCounts>();
      for (const run of limitedRuns) {
        runCounts.set(run.runId, { actions: 0, modelCalls: 0, errors: 0, evaluators: 0 });
      }

      const runIds = limitedRuns.map((run) => run.runId).filter(Boolean);

      if (runIds.length > 0) {
        const runIdArray = sql`array[${sql.join(
          runIds.map((id) => sql`${id}`),
          sql`, `
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
```