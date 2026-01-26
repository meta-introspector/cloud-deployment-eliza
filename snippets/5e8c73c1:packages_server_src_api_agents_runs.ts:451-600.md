# 5e8c73c1:packages_server_src_api_agents_runs.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/runs.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  // Get Specific Run Detail
  router.get('/:agentId/runs/:runId', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    const runId = validateUuid(req.params.runId);
    const { roomId } = req.query;

    if (!agentId || !runId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent or run ID format');
    }
    if (roomId && !validateUuid(roomId as string)) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid room ID format');
    }

    const runtime = elizaOS.getAgent(agentId);
    if (!runtime) {
      return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
    }

    try {
      // Get entityId from X-Entity-Id header for RLS context
      const entityId = validateUuid(req.headers['x-entity-id'] as string) || undefined;

      const logs: Log[] = await runtime.getLogs({
        entityId,
        roomId: roomId ? (roomId as UUID) : undefined,
        count: 5000,
      });

      // Include logs that have this runId OR have this runId as parentRunId (for actions)
      const directlyRelated = logs.filter((l) => {
        const body = l.body;
        return body.runId === runId || body.parentRunId === runId;
      });

      // Get all action runIds from matched action logs
      const actionRunIds = new Set(
        directlyRelated
          .filter((l) => l.type === 'action')
          .map((l) => {
            const runId = l.body.runId;
            return typeof runId === 'string' ? (runId as UUID) : undefined;
          })
          .filter((id): id is UUID => !!id)
      );

      // Also include action_event logs that share runId with matched actions
      // (action_event logs have the action's runId but no parentRunId)
      const related = logs.filter((l) => {
        const body = l.body;
        // Include if directly related to the main run
        if (body.runId === runId || body.parentRunId === runId) {
          return true;
        }
        // Also include action_event logs that match action runIds
        if (l.type === 'action_event' && body.runId && actionRunIds.has(body.runId as UUID)) {
          return true;
        }
        return false;
      });

      const runEvents = related
        .filter((l) => l.type === 'run_event')
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const started = runEvents.find((e) => e.body.status === 'started');
      const last = runEvents[runEvents.length - 1];

      const startedAt = started ? new Date(started.createdAt).getTime() : undefined;
      const endedAt =
        last && last.body.status !== 'started' ? new Date(last.createdAt).getTime() : undefined;
      const status = last?.body.status || 'started';
      const durationMs = startedAt && endedAt ? endedAt - startedAt : undefined;

      const actionLogs = related.filter((l) => l.type === 'action');
      const actionEventLogs = related.filter((l) => l.type === 'action_event');
      const evaluatorLogs = related.filter((l) => l.type === 'evaluator');
      const embeddingLogs = related.filter((l) => l.type === 'embedding_event');
      const modelLogs = related.filter(
        (l) => typeof l.type === 'string' && l.type.startsWith('useModel:')
      );

      const counts = {
        actions: actionEventLogs.length || actionLogs.length,
        modelCalls:
          (actionLogs.reduce((sum: number, l: Log) => {
            const body = l.body as ActionLogBody;
            return sum + Number(body.promptCount || 0);
          }, 0) || 0) + modelLogs.length,
        errors:
          actionLogs.filter((l: Log) => {
            const body = l.body as ActionLogBody;
            return body.result?.success === false;
          }).length +
          embeddingLogs.filter((l: Log) => {
            const body = l.body as EmbeddingLogBody;
            return body.status === 'failed';
          }).length,
        evaluators: evaluatorLogs.length,
      };

      const events: Array<{ type: string; timestamp: number; data: Record<string, unknown> }> = [];

      for (const e of runEvents) {
        const t = new Date(e.createdAt).getTime();
        const body = e.body;
        const st = body.status;
        if (st === 'started') {
          events.push({
            type: 'RUN_STARTED',
            timestamp: t,
            data: { source: body.source as string | undefined, messageId: body.messageId },
          });
        } else {
          events.push({
            type: 'RUN_ENDED',
            timestamp: t,
            data: {
              status: st,
              error: body.error as string | undefined,
              durationMs: body.duration as number | undefined,
            },
          });
        }
      }

      for (const e of actionEventLogs) {
        const body = e.body as ActionLogBody;
        const content = body.content;
        events.push({
          type: 'ACTION_STARTED',
          timestamp: new Date(e.createdAt).getTime(),
          data: {
            actionId: typeof body.actionId === 'string' ? body.actionId : undefined,
            actionName: (body.actionName as string | undefined) || content?.actions?.[0],
            messageId: body.messageId,
            planStep: body.planStep as string | undefined,
          },
        });
      }

      for (const e of actionLogs) {
        const body = e.body as ActionLogBody;
        events.push({
          type: 'ACTION_COMPLETED',
          timestamp: new Date(e.createdAt).getTime(),
          data: {
            actionId: body.actionId as string | undefined,
            actionName: body.action,
            success: body.result?.success !== false,
            result: body.result as Record<string, unknown> | undefined,
```