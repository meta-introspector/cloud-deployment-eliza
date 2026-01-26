# a789b1dc:packages_plugin-bootstrap_src_providers_settings.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/settings.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
// File: /swarm/shared/settings/provider.ts
// Updated to use world metadata instead of cache

import {
  ChannelType,
  findWorldsForOwner,
  getSalt,
  logger,
  unsaltWorldSettings,
  World,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type ProviderResult,
  type Setting,
  type State,
  type WorldSettings,
} from '@elizaos/core';

/**
 * Formats a setting value for display, respecting privacy flags
 */
const formatSettingValue = (setting: Setting, isOnboarding: boolean): string => {
  if (setting.value === null) {
    return 'Not set';
  }
  if (setting.secret && !isOnboarding) {
    return '****************';
  }
  return String(setting.value);
};

/**
 * Generates a status message based on the current settings state
 */
function generateStatusMessage(
  runtime: IAgentRuntime,
  worldSettings: WorldSettings,
  isOnboarding: boolean,
  state?: State
): string {
  try {
    // Format settings for display
    const formattedSettings = Object.entries(worldSettings)
      .map(([key, setting]) => {
        if (typeof setting !== 'object' || !setting.name) {
          return null;
        }

        const description = setting.description || '';
        const usageDescription = setting.usageDescription || '';

        // Skip settings that should be hidden based on visibility function
        if (setting.visibleIf && !setting.visibleIf(worldSettings)) {
          return null;
        }

        return {
          key,
          name: setting.name,
          value: formatSettingValue(setting, isOnboarding),
          description,
          usageDescription,
          required: setting.required,
          configured: setting.value !== null,
        };
      })
      .filter(Boolean);

    // Count required settings that are not configured
    const requiredUnconfigured = formattedSettings.filter(
      (s) => s?.required && !s.configured
    ).length;

    // Generate appropriate message
    if (isOnboarding) {
      const settingsList = formattedSettings
        .map((s) => {
          const label = s?.required ? '(Required)' : '(Optional)';
          return `${s?.key}: ${s?.value} ${label}\n(${s?.name}) ${s?.usageDescription}`;
        })
        .join('\n\n');

      const validKeys = `Valid setting keys: ${Object.keys(worldSettings).join(', ')}`;

      const commonInstructions = `Instructions for ${runtime.character.name}:
      - Only update settings if the user is clearly responding to a setting you are currently asking about.
      - If the user's reply clearly maps to a setting and a valid value, you **must** call the UPDATE_SETTINGS action with the correct key and value. Do not just respond with a message saying it's updated — it must be an action.
      - Never hallucinate settings or respond with values not listed above.
      - Do not call UPDATE_SETTINGS just because the user has started onboarding or you think a setting needs to be configured. Only update when the user clearly provides a specific value for a setting you are currently asking about.
      - Answer setting-related questions using only the name, description, and value from the list.`;

      if (requiredUnconfigured > 0) {
        return `# PRIORITY TASK: Onboarding with ${state?.senderName}

        ${runtime.character.name} needs to help the user configure ${requiredUnconfigured} required settings:
        
        ${settingsList}
        
        ${validKeys}
        
        ${commonInstructions}
        
        - Prioritize configuring required settings before optional ones.`;
      }

      return `All required settings have been configured. Here's the current configuration:
      
        ${settingsList}
        
        ${validKeys}
        
        ${commonInstructions}`;
    }

    // Non-onboarding context - list all public settings with values and descriptions
    return `## Current Configuration\n\n${requiredUnconfigured > 0
      ? `IMPORTANT!: ${requiredUnconfigured} required settings still need configuration. ${runtime.character.name} should get onboarded with the OWNER as soon as possible.\n\n`
      : 'All required settings are configured.\n\n'
      }${formattedSettings
        .map((s) => `### ${s?.name}\n**Value:** ${s?.value}\n**Description:** ${s?.description}`)
        .join('\n\n')}`;
  } catch (error) {
    logger.error(
      {
        src: 'plugin:bootstrap:provider:settings',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error generating status message'
    );
    return 'Error generating configuration status.';
  }
}

/**
 * Creates an settings provider with the given configuration
 * Updated to use world metadata instead of cache
 */
export const settingsProvider: Provider = {
  name: 'SETTINGS',
  description: 'Current settings for the server',
  get: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<ProviderResult> => {
    try {
      // Parallelize the initial database operations to improve performance
      // These operations can run simultaneously as they don't depend on each other
      const [room, userWorlds] = await Promise.all([
        runtime.getRoom(message.roomId),
        findWorldsForOwner(runtime, message.entityId),
      ]).catch((error) => {
```