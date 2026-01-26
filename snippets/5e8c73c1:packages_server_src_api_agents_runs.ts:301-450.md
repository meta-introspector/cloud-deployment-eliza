# 5e8c73c1:packages_server_src_api_agents_runs.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/runs.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          // ignore
        }
      }

      // Filter by status if specified
      let runs: RunListItem[] = Array.from(runMap.values());
      if (statusFilter && statusFilter !== 'all') {
        runs = runs.filter((run) => run.status === statusFilter);
      }

      // Sort by startedAt desc and apply limit
      runs.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
      const limitedRuns: RunListItem[] = runs.slice(0, limitNum);

      // Bulk fetch logs once per type, then aggregate per runId in memory (avoid N+1)
      const runIdSet = new Set<string>(limitedRuns.map((r) => r.runId));

      let actionLogs: Log[] = [];
      let evaluatorLogs: Log[] = [];
      let genericLogs: Log[] = [];

      if (runIdSet.size > 0) {
        const logFetchCount = Math.max(200, limitNum * 50);

        // Fetch logs with entityId for RLS filtering (user sees only their run's logs)
        const [action, evaluator, generic] = await Promise.all([
          runtime
            .getLogs({
              entityId,
              roomId: roomId ? (roomId as UUID) : undefined,
              type: 'action',
              count: logFetchCount,
            })
            .catch(() => []),
          runtime
            .getLogs({
              entityId,
              roomId: roomId ? (roomId as UUID) : undefined,
              type: 'evaluator',
              count: logFetchCount,
            })
            .catch(() => []),
          runtime
            .getLogs({
              entityId,
              roomId: roomId ? (roomId as UUID) : undefined,
              count: logFetchCount,
            })
            .catch(() => []),
        ]);

        actionLogs = action;
        evaluatorLogs = evaluator;
        genericLogs = generic;
      }

      const countsByRunId: Record<
        string,
        { actions: number; modelCalls: number; errors: number; evaluators: number }
      > = {};
      for (const run of limitedRuns) {
        countsByRunId[run.runId] = { actions: 0, modelCalls: 0, errors: 0, evaluators: 0 };
      }

      // Aggregate action logs
      for (const log of actionLogs) {
        const rid = typeof log.body.runId === 'string' ? log.body.runId : undefined;
        if (!rid || !runIdSet.has(rid)) {
          continue;
        }
        const entry = countsByRunId[rid];
        if (!entry) {
          continue;
        }
        entry.actions += 1;
        const bodyForAction = log.body as ActionLogBody;
        if (bodyForAction.result?.success === false) {
          entry.errors += 1;
        }
        const promptCount = Number(bodyForAction.promptCount || 0);
        if (promptCount > 0) {
          entry.modelCalls += promptCount;
        }
      }

      // Aggregate evaluator logs
      for (const log of evaluatorLogs) {
        const rid = typeof log.body.runId === 'string' ? log.body.runId : undefined;
        if (!rid || !runIdSet.has(rid)) {
          continue;
        }
        const entry = countsByRunId[rid];
        if (!entry) {
          continue;
        }
        entry.evaluators += 1;
      }

      // Aggregate generic logs (useModel:* and embedding_event failures)
      for (const log of genericLogs) {
        const rid = typeof log.body.runId === 'string' ? log.body.runId : undefined;
        if (!rid || !runIdSet.has(rid)) {
          continue;
        }
        const entry = countsByRunId[rid];
        if (!entry) {
          continue;
        }
        if (typeof log.type === 'string' && log.type.startsWith('useModel:')) {
          entry.modelCalls += 1;
        } else if (log.type === 'embedding_event' && log.body.status === 'failed') {
          entry.errors += 1;
        }
      }

      // Attach counts
      for (const run of limitedRuns) {
        run.counts = countsByRunId[run.runId] || {
          actions: 0,
          modelCalls: 0,
          errors: 0,
          evaluators: 0,
        };
      }

      const response = {
        runs: limitedRuns,
        total: runs.length,
        hasMore: runs.length > limitNum,
      };

      if (cacheKey) {
        runsCache.set(cacheKey, {
          payload: response,
          expiresAt: Date.now() + RUNS_CACHE_TTL,
        });
      }

      sendSuccess(res, response);
    } catch (error) {
      sendError(
        res,
        500,
        'RUNS_ERROR',
        'Error retrieving agent runs',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

```