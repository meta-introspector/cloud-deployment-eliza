# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:751-900

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:751-900
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATE_FAILED',
        remainingRequired: requiredUnconfigured.length,
      },
      success: false,
    };
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error generating failure response'
    );
    await callback({
      text: "I couldn't understand your settings update. Please try again with a clearer format.",
      actions: ['SETTING_UPDATE_FAILED'],
      source: 'discord',
    });

    return {
      text: 'Failed to parse settings with fallback message',
      values: {
        success: false,
        settingsUpdated: false,
        fallbackUsed: true,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATE_FAILED',
        error: error instanceof Error ? error.message : String(error),
      },
      success: false,
    };
  }
}

/**
 * Generates an error response for unexpected errors
 */
async function generateErrorResponse(
  runtime: IAgentRuntime,
  state: State,
  callback: HandlerCallback
): Promise<ActionResult> {
  try {
    const prompt = composePromptFromState({
      state,
      template: errorTemplate,
    });

    const response = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt,
    });

    const responseContent = parseKeyValueXml(response) as Content;

    await callback({
      text: responseContent.text,
      actions: ['SETTING_UPDATE_ERROR'],
      source: 'discord',
    });

    return {
      text: 'Error processing settings',
      values: {
        success: false,
        error: 'PROCESSING_ERROR',
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATE_ERROR',
      },
      success: false,
    };
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error generating error response'
    );
    await callback({
      text: "I'm sorry, but I encountered an error while processing your request. Please try again or contact support if the issue persists.",
      actions: ['SETTING_UPDATE_ERROR'],
      source: 'discord',
    });

    return {
      text: 'Error with fallback message',
      values: {
        success: false,
        error: 'PROCESSING_ERROR',
        fallbackUsed: true,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATE_ERROR',
        error: error instanceof Error ? error.message : String(error),
      },
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Enhanced settings action with improved state management and logging
 * Updated to use world metadata instead of cache
 */
export const updateSettingsAction: Action = {
  name: 'UPDATE_SETTINGS',
  similes: ['UPDATE_SETTING', 'SAVE_SETTING', 'SET_CONFIGURATION', 'CONFIGURE'],
  description:
    'Saves a configuration setting during the onboarding process, or update an existing setting. Use this when you are onboarding with a world owner or admin.',

  validate: async (runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    try {
      if (message.content.channelType !== ChannelType.DM) {
        logger.debug(
          {
            src: 'plugin:bootstrap:action:settings',
            agentId: runtime.agentId,
            channelType: message.content.channelType,
          },
          'Skipping settings in non-DM channel'
        );
        return false;
      }

      // Find the server where this user is the owner
      logger.debug(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          entityId: message.entityId,
        },
        'Looking for server where user is owner'
      );
      const worlds = await findWorldsForOwner(runtime, message.entityId);
      if (!worlds) {
        return false;
      }

      const world = worlds.find((world) => world.metadata?.settings);

```