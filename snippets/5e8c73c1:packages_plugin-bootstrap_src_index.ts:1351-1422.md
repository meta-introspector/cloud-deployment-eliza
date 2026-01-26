# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:1351-1422

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:1351-1422
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        );
      } catch (error) {
        logger.error(
          {
            src: 'plugin:bootstrap',
            agentId: payload.runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to log RUN_TIMEOUT event'
        );
      }
    },
  ],

  [EventType.CONTROL_MESSAGE]: [
    async (payload: ControlMessagePayload) => {
      if (!payload.message) {
        payload.runtime.logger.warn(
          { src: 'plugin:bootstrap' },
          'CONTROL_MESSAGE received without message property'
        );
        return;
      }
      await controlMessageHandler(payload);
    },
  ],
};

export const bootstrapPlugin: Plugin = {
  name: 'bootstrap',
  description: 'Agent bootstrap with basic actions and evaluators',
  actions: [
    actions.replyAction,
    actions.followRoomAction,
    actions.unfollowRoomAction,
    actions.ignoreAction,
    actions.noneAction,
    actions.muteRoomAction,
    actions.unmuteRoomAction,
    actions.sendMessageAction,
    actions.updateEntityAction,
    actions.choiceAction,
    actions.updateRoleAction,
    actions.updateSettingsAction,
    actions.generateImageAction,
  ],
  events,
  evaluators: [evaluators.reflectionEvaluator],
  providers: [
    providers.evaluatorsProvider,
    providers.anxietyProvider,
    providers.timeProvider,
    providers.entitiesProvider,
    providers.relationshipsProvider,
    providers.choiceProvider,
    providers.factsProvider,
    providers.roleProvider,
    providers.settingsProvider,
    // there is given no reason for this - odi
    //providers.capabilitiesProvider,
    providers.attachmentsProvider,
    providers.providersProvider,
    providers.actionsProvider,
    providers.actionStateProvider,
    providers.characterProvider,
    providers.recentMessagesProvider,
    providers.worldProvider,
  ],
  services: [TaskService, EmbeddingGenerationService],
};

export default bootstrapPlugin;
```