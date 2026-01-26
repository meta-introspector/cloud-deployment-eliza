# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:151-300

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:151-300
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
 * 4. Keep the message concise and helpful
 *
 * Actions array to include: ["SETTING_UPDATE_ERROR"]
 */
const errorTemplate = `# Task: Generate a response for an error during setting updates

# About {{agentName}}:
{{bio}}

# Recent Conversation:
{{recentMessages}}

# Instructions:
1. Apologize for the technical difficulty
2. Maintain {{agentName}}'s personality and tone
3. Suggest trying again or contacting support if the issue persists
4. Keep the message concise and helpful

Write a natural, conversational response that {{agentName}} would send about the error.
Include the actions array ["SETTING_UPDATE_ERROR"] in your response.
${messageCompletionFooter}`;

// Template for completion responses when all required settings are configured
/**
 * Task: Generate a response for settings completion
 *
 * About {{agentName}}:
 * {{bio}}
 *
 * Settings Status:
 * {{settingsStatus}}
 *
 * Recent Conversation:
 * {{recentMessages}}
 *
 * Instructions:
 * 1. Congratulate the user on completing the settings process
 * 2. Maintain {{agentName}}'s personality and tone
 * 3. Summarize the key settings that have been configured
 * 4. Explain what functionality is now available
 * 5. Provide guidance on what the user can do next
 * 6. Express enthusiasm about working together
 *
 * Write a natural, conversational response that {{agentName}} would send about the successful completion of settings.
 * Include the actions array ["ONBOARDING_COMPLETE"] in your response.
 */
const completionTemplate = `# Task: Generate a response for settings completion

# About {{agentName}}:
{{bio}}

# Settings Status:
{{settingsStatus}}

# Recent Conversation:
{{recentMessages}}

# Instructions:
1. Congratulate the user on completing the settings process
2. Maintain {{agentName}}'s personality and tone
3. Summarize the key settings that have been configured
4. Explain what functionality is now available
5. Provide guidance on what the user can do next
6. Express enthusiasm about working together

Write a natural, conversational response that {{agentName}} would send about the successful completion of settings.
Include the actions array ["ONBOARDING_COMPLETE"] in your response.
${messageCompletionFooter}`;

/**
 * Gets settings state from world metadata
 */
/**
 * Retrieves the settings for a specific world from the database.
 * Settings are stored encrypted; this function decrypts secret values before returning.
 * @param {IAgentRuntime} runtime - The Agent Runtime instance.
 * @param {UUID} worldId - The UUID of the world.
 * @returns {Promise<WorldSettings | null>} The settings of the world (decrypted), or null if not found.
 */
export async function getWorldSettings(
  runtime: IAgentRuntime,
  worldId: UUID
): Promise<WorldSettings | null> {
  try {
    const world = await runtime.getWorld(worldId);

    if (!world || !world.metadata?.settings) {
      return null;
    }

    // Decrypt secret values before returning (settings are stored encrypted)
    const salt = getSalt();
    return unsaltWorldSettings(world.metadata.settings as WorldSettings, salt);
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error getting settings state'
    );
    return null;
  }
}

/**
 * Updates settings state in world metadata
 */
export async function updateWorldSettings(
  runtime: IAgentRuntime,
  worldId: UUID,
  worldSettings: WorldSettings
): Promise<boolean> {
  try {
    const world = await runtime.getWorld(worldId);

    if (!world) {
      logger.error(
        { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId, worldId },
        'No world found'
      );
      return false;
    }

    // Initialize metadata if it doesn't exist
    if (!world.metadata) {
      world.metadata = {};
    }

    // Encrypt secret values before saving (settings must be stored encrypted)
    const salt = getSalt();
    const saltedSettings = saltWorldSettings(worldSettings, salt);

    // Update settings state
    world.metadata.settings = saltedSettings;

    // Save updated world
    await runtime.updateWorld(world);

    return true;
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:action:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error updating settings state'
    );
```