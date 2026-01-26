# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:601-750

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:601-750
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
        action: 'ONBOARDING_COMPLETE',
        error: error instanceof Error ? error.message : String(error),
      },
      success: true,
    };
  }
}

/**
 * Generates a success response for setting updates
 */
async function generateSuccessResponse(
  runtime: IAgentRuntime,
  worldSettings: WorldSettings,
  state: State,
  messages: string[],
  callback: HandlerCallback
): Promise<ActionResult> {
  try {
    // Check if all required settings are now configured
    const { requiredUnconfigured } = categorizeSettings(worldSettings);

    if (requiredUnconfigured.length === 0) {
      // All required settings are configured, complete settings
      return await handleOnboardingComplete(runtime, worldSettings, state, callback);
    }

    const requiredUnconfiguredString = requiredUnconfigured
      .map(([key, setting]) => `${key}: ${setting.name}`)
      .join('\n');

    // Generate success message
    const prompt = composePrompt({
      state: {
        updateMessages: messages.join('\n'),
        nextSetting: requiredUnconfiguredString,
        remainingRequired: requiredUnconfigured.length.toString(),
      },
      template: successTemplate,
    });

    const response = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt,
    });

    const responseContent = parseKeyValueXml(response) as Content;

    await callback({
      text: responseContent.text,
      actions: ['SETTING_UPDATED'],
      source: 'discord',
    });

    return {
      text: 'Settings updated successfully',
      values: {
        success: true,
        settingsUpdated: true,
        remainingRequired: requiredUnconfigured.length,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATED',
        updatedMessages: messages,
        remainingRequired: requiredUnconfigured.length,
      },
      success: true,
    };
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error generating success response'
    );
    await callback({
      text: 'Settings updated successfully. Please continue with the remaining configuration.',
      actions: ['SETTING_UPDATED'],
      source: 'discord',
    });

    return {
      text: 'Settings updated with fallback message',
      values: {
        success: true,
        settingsUpdated: true,
        fallbackUsed: true,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'SETTING_UPDATED',
        error: error instanceof Error ? error.message : String(error),
      },
      success: true,
    };
  }
}

/**
 * Generates a failure response when no settings could be updated
 */
async function generateFailureResponse(
  runtime: IAgentRuntime,
  worldSettings: WorldSettings,
  state: State,
  callback: HandlerCallback
): Promise<ActionResult> {
  try {
    // Get next required setting
    const { requiredUnconfigured } = categorizeSettings(worldSettings);

    if (requiredUnconfigured.length === 0) {
      // All required settings are configured, complete settings
      return await handleOnboardingComplete(runtime, worldSettings, state, callback);
    }

    const requiredUnconfiguredString = requiredUnconfigured
      .map(([key, setting]) => `${key}: ${setting.name}`)
      .join('\n');

    // Generate failure message
    const prompt = composePrompt({
      state: {
        nextSetting: requiredUnconfiguredString,
        remainingRequired: requiredUnconfigured.length.toString(),
      },
      template: failureTemplate,
    });

    const response = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt,
    });

    const responseContent = parseKeyValueXml(response) as Content;

    await callback({
      text: responseContent.text,
      actions: ['SETTING_UPDATE_FAILED'],
      source: 'discord',
    });

    return {
      text: 'No settings were updated',
      values: {
        success: false,
        settingsUpdated: false,
        remainingRequired: requiredUnconfigured.length,
      },
```