# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:301-450

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:301-450
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    return false;
  }
}

/**
 * Formats a list of settings for display
 */
function formatSettingsList(worldSettings: WorldSettings): string {
  const settings = Object.entries(worldSettings)
    .filter(([key]) => !key.startsWith('_')) // Skip internal settings
    .map(([key, setting]: [string, Setting]) => {
      const status = setting.value !== null ? 'Configured' : 'Not configured';
      const required = setting.required ? 'Required' : 'Optional';
      return `- ${setting.name} (${key}): ${status}, ${required}`;
    })
    .join('\n');

  return settings || 'No settings available';
}

/**
 * Categorizes settings by their configuration status
 */
function categorizeSettings(worldSettings: WorldSettings): {
  configured: [string, Setting][];
  requiredUnconfigured: [string, Setting][];
  optionalUnconfigured: [string, Setting][];
} {
  const configured: [string, Setting][] = [];
  const requiredUnconfigured: [string, Setting][] = [];
  const optionalUnconfigured: [string, Setting][] = [];

  for (const [key, setting] of Object.entries(worldSettings)) {
    // Skip internal settings
    if (key.startsWith('_')) {
      continue;
    }

    const typedSetting = setting as Setting;

    if (typedSetting.value !== null) {
      configured.push([key, typedSetting]);
    } else if (typedSetting.required) {
      requiredUnconfigured.push([key, typedSetting]);
    } else {
      optionalUnconfigured.push([key, typedSetting]);
    }
  }

  return { configured, requiredUnconfigured, optionalUnconfigured };
}

/**
 * Extracts setting values from user message with improved handling of multiple settings
 */
async function extractSettingValues(
  runtime: IAgentRuntime,
  _message: Memory,
  state: State,
  worldSettings: WorldSettings
): Promise<SettingUpdate[]> {
  // Find what settings need to be configured
  const { requiredUnconfigured, optionalUnconfigured } = categorizeSettings(worldSettings);

  // Generate a prompt to extract settings from the user's message
  const settingsContext = requiredUnconfigured
    .concat(optionalUnconfigured)
    .map(([key, setting]) => {
      const requiredStr = setting.required ? 'Required.' : 'Optional.';
      return `${key}: ${setting.description} ${requiredStr}`;
    })
    .join('\n');

  const basePrompt = dedent`
    I need to extract settings values from the user's message.
    
    Available settings:
    ${settingsContext}
    
    User message: ${state.text}

    For each setting mentioned in the user's message, extract the value.
    
    Only return settings that are clearly mentioned in the user's message.
    If a setting is mentioned but no clear value is provided, do not include it.
    `;

  try {
    // Use runtime.useModel directly with strong typing
    const result = await runtime.useModel<typeof ModelType.OBJECT_LARGE, SettingUpdate[]>(
      ModelType.OBJECT_LARGE,
      {
        prompt: basePrompt,
        output: 'array',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
            },
            required: ['key', 'value'],
          },
        },
      }
    );

    // Validate the extracted settings
    if (!result) {
      return [];
    }

    function extractValidSettings(obj: unknown, worldSettings: WorldSettings) {
      const extracted: SettingUpdate[] = [];

      function traverse(node: unknown): void {
        if (Array.isArray(node)) {
          for (const item of node) {
            traverse(item);
          }
        } else if (typeof node === 'object' && node !== null) {
          for (const [key, value] of Object.entries(node)) {
            if (worldSettings[key] && typeof value !== 'object') {
              extracted.push({ key, value });
            } else {
              traverse(value);
            }
          }
        }
      }

      traverse(obj);
      return extracted;
    }

    const extractedSettings = extractValidSettings(result, worldSettings);

    return extractedSettings;
  } catch (error) {
    console.error('Error extracting settings:', error);
    return [];
  }
}

/**
 * Processes multiple setting updates atomically
 */
async function processSettingUpdates(
  runtime: IAgentRuntime,
```