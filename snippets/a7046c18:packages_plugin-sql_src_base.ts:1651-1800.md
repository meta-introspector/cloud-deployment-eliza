# a7046c18:packages_plugin-sql_src_base.ts:1651-1800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:1651-1800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      status?: RunStatus | "all";
      from?: number;
      to?: number;
      entityId?: UUID;
    } = {},
  ): Promise<AgentRunSummaryResult> {
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const fromDate =
      typeof params.from === "number" ? new Date(params.from) : undefined;
    const toDate =
      typeof params.to === "number" ? new Date(params.to) : undefined;

    // Use withEntityContext for RLS when entityId is provided
    return this.withEntityContext(params.entityId ?? null, async (tx) => {
      const runMap = new Map<string, AgentRunSummary>();

      const conditions: SQL<unknown>[] = [
        eq(logTable.type, "run_event"),
        sql`${logTable.body} ? 'runId'`,
        eq(roomTable.agentId, this.agentId),
      ];

      // Note: No WHERE filter on entityId - RLS handles access control automatically

      if (params.roomId) {
        conditions.push(eq(logTable.roomId, params.roomId));
      }
      if (fromDate) {
        conditions.push(gte(logTable.createdAt, fromDate));
      }
      if (toDate) {
        conditions.push(lte(logTable.createdAt, toDate));
      }

      const whereClause = and(...conditions);

      const eventLimit = Math.max(limit * 20, 200);

      const runEventRows = await tx
        .select({
          runId: sql<string>`(${logTable.body} ->> 'runId')`,
          status: sql<string | null>`(${logTable.body} ->> 'status')`,
          messageId: sql<string | null>`(${logTable.body} ->> 'messageId')`,
          rawBody: logTable.body,
          createdAt: logTable.createdAt,
          roomId: logTable.roomId,
          entityId: logTable.entityId,
        })
        .from(logTable)
        .innerJoin(roomTable, eq(roomTable.id, logTable.roomId))
        .where(whereClause)
        .orderBy(desc(logTable.createdAt))
        .limit(eventLimit);

      for (const row of runEventRows) {
        const runId = row.runId;
        if (!runId) continue;

        const summary: AgentRunSummary = runMap.get(runId) ?? {
          runId,
          status: "started",
          startedAt: null,
          endedAt: null,
          durationMs: null,
          messageId: undefined,
          roomId: undefined,
          entityId: undefined,
          metadata: {},
        };

        if (!summary.messageId && row.messageId) {
          summary.messageId = row.messageId as UUID;
        }
        if (!summary.roomId && row.roomId) {
          summary.roomId = row.roomId as UUID;
        }
        if (!summary.entityId && row.entityId) {
          summary.entityId = row.entityId as UUID;
        }

        const body = row.rawBody as Record<string, unknown> | undefined;
        if (body && typeof body === "object") {
          if (!summary.roomId && typeof body.roomId === "string") {
            summary.roomId = body.roomId as UUID;
          }
          if (!summary.entityId && typeof body.entityId === "string") {
            summary.entityId = body.entityId as UUID;
          }
          if (!summary.messageId && typeof body.messageId === "string") {
            summary.messageId = body.messageId as UUID;
          }
          if (!summary.metadata || Object.keys(summary.metadata).length === 0) {
            const metadata =
              (body.metadata as Record<string, unknown> | undefined) ??
              undefined;
            summary.metadata = metadata ? { ...metadata } : {};
          }
        }

        const createdAt =
          row.createdAt instanceof Date
            ? row.createdAt
            : new Date(row.createdAt);
        const timestamp = createdAt.getTime();
        const eventStatus =
          (row.status as RunStatus | undefined) ??
          (body?.status as RunStatus | undefined);

        if (eventStatus === "started") {
          summary.startedAt =
            summary.startedAt === null
              ? timestamp
              : Math.min(summary.startedAt, timestamp);
        } else if (
          eventStatus === "completed" ||
          eventStatus === "timeout" ||
          eventStatus === "error"
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
      if (params.status && params.status !== "all") {
        runs = runs.filter((run) => run.status === params.status);
      }

      runs.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));

      const total = runs.length;
      const limitedRuns = runs.slice(0, limit);
      const hasMore = total > limit;

      const runCounts = new Map<string, AgentRunCounts>();
      for (const run of limitedRuns) {
        runCounts.set(run.runId, {
          actions: 0,
          modelCalls: 0,
          errors: 0,
          evaluators: 0,
        });
      }

      const runIds = limitedRuns.map((run) => run.runId).filter(Boolean);
```