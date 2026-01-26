# 5e8c73c1:packages_server_src_api_agents_runs.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/runs.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        roomId?: UUID;
        entityId?: UUID;
        metadata?: Record<string, unknown>;
        counts?: { actions: number; modelCalls: number; errors: number; evaluators: number };
      };

      const runMap = new Map<string, RunListItem>();

      const ingestRunEvents = (logs: Log[]) => {
        for (const log of logs) {
          const body = log.body;
          const runId = typeof body.runId === 'string' ? body.runId : undefined;
          if (!runId) {
            continue;
          }

          const logTime = new Date(log.createdAt).getTime();
          if (fromTime && logTime < fromTime) {
            continue;
          }
          if (toTime && logTime > toTime) {
            continue;
          }

          if (!runMap.has(runId)) {
            runMap.set(runId, {
              runId,
              status: 'started',
              startedAt: null,
              endedAt: null,
              durationMs: null,
              messageId: body.messageId,
              roomId: body.roomId,
              entityId: body.entityId,
              metadata: body.metadata || ({} as Record<string, unknown>),
            });
          }

          const run = runMap.get(runId)!;
          const eventStatus = body.status;

          if (eventStatus === 'started') {
            run.startedAt = logTime;
          } else if (
            eventStatus === 'completed' ||
            eventStatus === 'timeout' ||
            eventStatus === 'error'
          ) {
            run.status = eventStatus;
            run.endedAt = logTime;
            if (run.startedAt) {
              run.durationMs = logTime - run.startedAt;
            }
          }
        }
      };

      ingestRunEvents(directRunEvents);

      const needsMoreRuns = () => runMap.size < limitNum;

      // 2) Recent message authors (only if more runs needed)
      if (needsMoreRuns()) {
        try {
          const recentMessages = await runtime.getMemories({
            tableName: 'messages',
            roomId: roomId ? (roomId as UUID) : undefined,
            count: 200,
            entityId,
          });
          const authorIds = Array.from(
            new Set(
              recentMessages
                .map((m) => m.entityId)
                .filter((eid): eid is UUID => Boolean(eid) && (eid as UUID) !== agentId)
            )
          ).slice(0, 10); // cap to avoid huge fan-out

          const authorRunEvents = entityId
            ? []
            : await Promise.all(
                authorIds.map(() =>
                  runtime
                    .getLogs({
                      roomId: roomId ? (roomId as UUID) : undefined,
                      type: 'run_event',
                      count: 500,
                    })
                    .catch(() => [])
                )
              );

          for (const logs of authorRunEvents) {
            ingestRunEvents(logs);
            if (!needsMoreRuns()) {
              break;
            }
          }
        } catch {
          // swallow
        }
      }

      // 3) Broader participant scan (only if still not enough and no explicit room filter)
      if (!roomId && !entityId && needsMoreRuns()) {
        try {
          const worlds = await runtime.getAllWorlds();
          const roomIds: UUID[] = [];
          for (const w of worlds) {
            try {
              const rooms = await runtime.getRooms(w.id);
              roomIds.push(...rooms.map((r) => r.id));
            } catch {
              // ignore
            }
            if (roomIds.length > 20) {
              break;
            } // guardrail
          }

          const participantLogs = await Promise.all(
            roomIds.map(async (rId) => {
              try {
                const participants: UUID[] = await runtime.getParticipantsForRoom(rId);
                const otherParticipants = participants.filter((pid) => pid !== agentId).slice(0, 5);
                const logsPerParticipant = await Promise.all(
                  otherParticipants.map(() =>
                    runtime
                      .getLogs({
                        roomId: rId,
                        type: 'run_event',
                        count: 300,
                      })
                      .catch(() => [])
                  )
                );
                return logsPerParticipant.flat();
              } catch {
                return [];
              }
            })
          );

          for (const logs of participantLogs) {
            ingestRunEvents(logs);
            if (!needsMoreRuns()) {
              break;
            }
          }
        } catch {
```