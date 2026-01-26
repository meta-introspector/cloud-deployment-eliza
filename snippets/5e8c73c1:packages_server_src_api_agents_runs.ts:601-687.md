# 5e8c73c1:packages_server_src_api_agents_runs.ts:601-687

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/runs.ts:601-687
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            promptCount: body.promptCount,
            prompts: body.prompts,
            params: body.params as Record<string, unknown> | undefined,
            response: body.response,
          },
        });
      }

      for (const e of modelLogs) {
        const body = e.body as ModelLogBody;
        events.push({
          type: 'MODEL_USED',
          timestamp: new Date(e.createdAt).getTime(),
          data: {
            modelType:
              body.modelType ||
              (typeof e.type === 'string' ? e.type.replace('useModel:', '') : undefined),
            provider: body.provider,
            executionTime: body.executionTime,
            actionContext: body.actionContext as string | undefined,
            params: body.params as Record<string, unknown> | undefined,
            response: body.response,
            usage: body.usage as Record<string, unknown> | undefined,
            prompts: body.prompts as Array<{ prompt?: string; modelType?: string }> | undefined,
            prompt: body.prompt as string | undefined,
            inputTokens: body.inputTokens as number | undefined,
            outputTokens: body.outputTokens as number | undefined,
            cost: body.cost as number | undefined,
          },
        });
      }

      for (const e of evaluatorLogs) {
        const body = e.body as EvaluatorLogBody;
        events.push({
          type: 'EVALUATOR_COMPLETED',
          timestamp: new Date(e.createdAt).getTime(),
          data: {
            evaluatorName: body.evaluator,
            success: true,
          },
        });
      }

      for (const e of embeddingLogs) {
        const body = e.body as EmbeddingLogBody;
        events.push({
          type: 'EMBEDDING_EVENT',
          timestamp: new Date(e.createdAt).getTime(),
          data: {
            status: body.status,
            memoryId: body.memoryId,
            durationMs: body.duration,
          },
        });
      }

      events.sort((a, b) => a.timestamp - b.timestamp);

      const firstRunEvent = started || runEvents[0] || related[0];
      const summary = {
        runId,
        status,
        startedAt:
          startedAt || (firstRunEvent ? new Date(firstRunEvent.createdAt).getTime() : undefined),
        endedAt,
        durationMs,
        messageId: firstRunEvent?.body?.messageId,
        roomId: firstRunEvent?.body?.roomId || (roomId as UUID | undefined),
        entityId: firstRunEvent?.body?.entityId || agentId,
        counts,
      } as const;

      sendSuccess(res, { summary, events });
    } catch (error) {
      sendError(
        res,
        500,
        'RUN_DETAIL_ERROR',
        'Error retrieving run details',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  return router;
}
```