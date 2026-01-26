# 5e8c73c1:packages_plugin-sql_src_base.ts:1501-1650

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1501-1650
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
            type ? eq(logTable.type, type) : undefined
          )
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
      status?: RunStatus | 'all';
      from?: number;
      to?: number;
      entityId?: UUID;
    } = {}
  ): Promise<AgentRunSummaryResult> {
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const fromDate = typeof params.from === 'number' ? new Date(params.from) : undefined;
    const toDate = typeof params.to === 'number' ? new Date(params.to) : undefined;

    // Use withEntityContext for RLS when entityId is provided
    return this.withEntityContext(params.entityId ?? null, async (tx) => {
      const runMap = new Map<string, AgentRunSummary>();

      const conditions: SQL<unknown>[] = [
        eq(logTable.type, 'run_event'),
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
          status: 'started',
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
        if (body && typeof body === 'object') {
          if (!summary.roomId && typeof body.roomId === 'string') {
            summary.roomId = body.roomId as UUID;
          }
          if (!summary.entityId && typeof body.entityId === 'string') {
            summary.entityId = body.entityId as UUID;
          }
          if (!summary.messageId && typeof body.messageId === 'string') {
            summary.messageId = body.messageId as UUID;
          }
          if (!summary.metadata || Object.keys(summary.metadata).length === 0) {
            const metadata = (body.metadata as Record<string, unknown> | undefined) ?? undefined;
            summary.metadata = metadata ? { ...metadata } : {};
          }
        }

        const createdAt = row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt);
        const timestamp = createdAt.getTime();
        const eventStatus =
          (row.status as RunStatus | undefined) ?? (body?.status as RunStatus | undefined);

        if (eventStatus === 'started') {
          summary.startedAt =
            summary.startedAt === null ? timestamp : Math.min(summary.startedAt, timestamp);
```