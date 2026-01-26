# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:1201-1350

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:1201-1350
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              payload.roomId,
              payload.world,
              payload.content,
              payload.messageId
            );
          }
        }
      } catch (error) {
        logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error sending refetch request'
        );
      }
    },
  ],

  [EventType.EVALUATOR_STARTED]: [
    async (payload: EvaluatorEventPayload) => {
      logger.debug(
        {
          src: 'plugin:bootstrap:evaluator',
          agentId: payload.runtime.agentId,
          evaluatorName: payload.evaluatorName,
          evaluatorId: payload.evaluatorId,
        },
        'Evaluator started'
      );
    },
  ],

  [EventType.EVALUATOR_COMPLETED]: [
    async (payload: EvaluatorEventPayload) => {
      const status = payload.error ? 'failed' : 'completed';
      logger.debug(
        {
          src: 'plugin:bootstrap:evaluator',
          agentId: payload.runtime.agentId,
          status,
          evaluatorName: payload.evaluatorName,
          evaluatorId: payload.evaluatorId,
          error: payload.error?.message,
        },
        'Evaluator completed'
      );
    },
  ],

  [EventType.RUN_STARTED]: [
    async (payload: RunEventPayload) => {
      try {
        await payload.runtime.log({
          entityId: payload.entityId,
          roomId: payload.roomId,
          type: 'run_event',
          body: {
            runId: payload.runId,
            status: payload.status,
            messageId: payload.messageId,
            roomId: payload.roomId,
            entityId: payload.entityId,
            startTime: payload.startTime,
            source: payload.source || 'unknown',
          },
        });
        logger.debug(
          { src: 'plugin:bootstrap', agentId: payload.runtime.agentId, runId: payload.runId },
          'Logged RUN_STARTED event'
        );
      } catch (error) {
        logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to log RUN_STARTED event'
        );
      }
    },
  ],

  [EventType.RUN_ENDED]: [
    async (payload: RunEventPayload) => {
      try {
        await payload.runtime.log({
          entityId: payload.entityId,
          roomId: payload.roomId,
          type: 'run_event',
          body: {
            runId: payload.runId,
            status: payload.status,
            messageId: payload.messageId,
            roomId: payload.roomId,
            entityId: payload.entityId,
            startTime: payload.startTime,
            endTime: payload.endTime,
            duration: payload.duration,
            error: payload.error,
            source: payload.source || 'unknown',
          },
        });
        logger.debug(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            runId: payload.runId,
            status: payload.status,
          },
          'Logged RUN_ENDED event'
        );
      } catch (error) {
        logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to log RUN_ENDED event'
        );
      }
    },
  ],

  [EventType.RUN_TIMEOUT]: [
    async (payload: RunEventPayload) => {
      try {
        await payload.runtime.log({
          entityId: payload.entityId,
          roomId: payload.roomId,
          type: 'run_event',
          body: {
            runId: payload.runId,
            status: payload.status,
            messageId: payload.messageId,
            roomId: payload.roomId,
            entityId: payload.entityId,
            startTime: payload.startTime,
            endTime: payload.endTime,
            duration: payload.duration,
            error: payload.error,
            source: payload.source || 'unknown',
          },
        });
        logger.debug(
          { src: 'plugin:bootstrap', agentId: payload.runtime.agentId, runId: payload.runId },
          'Logged RUN_TIMEOUT event'
```