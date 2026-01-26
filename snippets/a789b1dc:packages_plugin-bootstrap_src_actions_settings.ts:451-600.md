# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:451-600

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:451-600
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
  worldId: UUID,
  worldSettings: WorldSettings,
  updates: SettingUpdate[]
): Promise<{ updatedAny: boolean; messages: string[] }> {
  if (!updates.length) {
    return { updatedAny: false, messages: [] };
  }

  const messages: string[] = [];
  let updatedAny = false;

  try {
    // Create a copy of the state for atomic updates
    const updatedState = { ...worldSettings };

    // Process all updates
    for (const update of updates) {
      const setting = updatedState[update.key];
      if (!setting) {
        continue;
      }

      // Check dependencies if they exist
      if (setting.dependsOn?.length) {
        const dependenciesMet = setting.dependsOn.every((dep) => updatedState[dep]?.value !== null);
        if (!dependenciesMet) {
          messages.push(`Cannot update ${setting.name} - dependencies not met`);
          continue;
        }
      }

      // Update the setting
      updatedState[update.key] = {
        ...setting,
        value: update.value,
      };

      messages.push(`Updated ${setting.name} successfully`);
      updatedAny = true;

      // Execute onSetAction if defined
      if (setting.onSetAction) {
        const actionMessage = setting.onSetAction(update.value);
        if (actionMessage) {
          messages.push(actionMessage);
        }
      }
    }

    // If any updates were made, save the entire state to world metadata
    if (updatedAny) {
      // Save to world metadata
      const saved = await updateWorldSettings(runtime, worldId, updatedState);

      if (!saved) {
        throw new Error('Failed to save updated state to world metadata');
      }

      // Verify save by retrieving it again
      const savedState = await getWorldSettings(runtime, worldId);
      if (!savedState) {
        throw new Error('Failed to verify state save');
      }
    }

    return { updatedAny, messages };
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error processing setting updates'
    );
    return {
      updatedAny: false,
      messages: ['Error occurred while updating settings'],
    };
  }
}

/**
 * Handles the completion of settings when all required settings are configured
 */
async function handleOnboardingComplete(
  runtime: IAgentRuntime,
  worldSettings: WorldSettings,
  _state: State,
  callback: HandlerCallback
): Promise<ActionResult> {
  try {
    // Generate completion message
    const prompt = composePrompt({
      state: {
        settingsStatus: formatSettingsList(worldSettings),
      },
      template: completionTemplate,
    });

    const response = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt,
    });

    const responseContent = parseKeyValueXml(response) as Content;

    await callback({
      text: responseContent.text,
      actions: ['ONBOARDING_COMPLETE'],
      source: 'discord',
    });

    return {
      text: 'Onboarding completed successfully',
      values: {
        success: true,
        onboardingComplete: true,
        allRequiredConfigured: true,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
        action: 'ONBOARDING_COMPLETE',
        settingsStatus: formatSettingsList(worldSettings),
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
      'Error handling settings completion'
    );
    await callback({
      text: 'Great! All required settings have been configured. Your server is now fully set up and ready to use.',
      actions: ['ONBOARDING_COMPLETE'],
      source: 'discord',
    });

    return {
      text: 'Onboarding completed with fallback message',
      values: {
        success: true,
        onboardingComplete: true,
        fallbackUsed: true,
      },
      data: {
        actionName: 'UPDATE_SETTINGS',
```