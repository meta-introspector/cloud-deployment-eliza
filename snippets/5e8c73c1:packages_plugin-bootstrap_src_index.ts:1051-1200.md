# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:1051-1200

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:1051-1200
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      await syncSingleUser(
        payload.entityId,
        payload.runtime,
        payload.worldId,
        payload.roomId,
        channelType as ChannelType,
        payload.source
      );
    },
  ],

  [EventType.ENTITY_LEFT]: [
    async (payload: EntityPayload) => {
      try {
        // Update entity to inactive
        const entity = await payload.runtime.getEntityById(payload.entityId);
        if (entity) {
          entity.metadata = {
            ...entity.metadata,
            status: 'INACTIVE',
            leftAt: Date.now(),
          };
          await payload.runtime.updateEntity(entity);
        }
        payload.runtime.logger.info(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            entityId: payload.entityId,
            worldId: payload.worldId,
          },
          'User left world'
        );
      } catch (error: unknown) {
        payload.runtime.logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error handling user left'
        );
      }
    },
  ],

  [EventType.ACTION_STARTED]: [
    async (payload: ActionEventPayload) => {
      try {
        // Only notify for client_chat messages
        if (payload.content?.source === 'client_chat') {
          interface MessageBusServiceWithNotify {
            notifyActionStart: (
              roomId: UUID,
              worldId: UUID,
              content: Content,
              messageId?: UUID
            ) => Promise<void>;
            notifyActionUpdate: (
              roomId: UUID,
              worldId: UUID,
              content: Content,
              messageId?: UUID
            ) => Promise<void>;
          }
          const messageBusService = payload.runtime.getService(
            'message-bus-service'
          ) as MessageBusServiceWithNotify | null;
          if (messageBusService) {
            await messageBusService.notifyActionStart(
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
    async (payload: ActionEventPayload) => {
      try {
        await payload.runtime.log({
          entityId: payload.runtime.agentId,
          roomId: payload.roomId,
          type: 'action_event',
          body: {
            runId: payload.content?.runId,
            actionId: payload.content?.actionId,
            actionName: payload.content?.actions?.[0],
            roomId: payload.roomId,
            messageId: payload.messageId,
            timestamp: Date.now(),
            planStep: payload.content?.planStep,
            source: 'actionHandler',
          },
        });
        logger.debug(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            actionName: payload.content?.actions?.[0],
          },
          'Logged ACTION_STARTED event'
        );
      } catch (error) {
        logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to log ACTION_STARTED event'
        );
      }
    },
  ],

  [EventType.ACTION_COMPLETED]: [
    async (payload: ActionEventPayload) => {
      try {
        // Only notify for client_chat messages
        if (payload.content?.source === 'client_chat') {
          interface MessageBusServiceWithNotify {
            notifyActionStart: (
              roomId: UUID,
              worldId: UUID,
              content: Content,
              messageId?: UUID
            ) => Promise<void>;
            notifyActionUpdate: (
              roomId: UUID,
              worldId: UUID,
              content: Content,
              messageId?: UUID
            ) => Promise<void>;
          }
          const messageBusService = payload.runtime.getService(
            'message-bus-service'
          ) as MessageBusServiceWithNotify | null;
          if (messageBusService) {
            await messageBusService.notifyActionUpdate(
```