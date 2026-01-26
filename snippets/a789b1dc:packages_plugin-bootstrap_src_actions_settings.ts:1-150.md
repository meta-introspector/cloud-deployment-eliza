# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
import {
  type HandlerOptions,
  type Action,
  type ActionExample,
  ChannelType,
  composePrompt,
  composePromptFromState,
  type Content,
  findWorldsForOwner,
  getSalt,
  type HandlerCallback,
  type IAgentRuntime,
  logger,
  type Memory,
  ModelType,
  parseKeyValueXml,
  type Setting,
  type State,
  type UUID,
  saltWorldSettings,
  unsaltWorldSettings,
  type WorldSettings,
  type ActionResult,
} from '@elizaos/core';
import dedent from 'dedent';

/**
 * Interface representing the structure of a setting update object.
 * @interface
 * @property {string} key - The key of the setting to be updated.
 * @property {string|boolean} value - The new value for the setting, can be a string or a boolean.
 */
/**
 * Interface for updating settings.
 * @typedef {Object} SettingUpdate
 * @property {string} key - The key of the setting to update.
 * @property {string | boolean} value - The new value of the setting, can be a string or a boolean.
 */
interface SettingUpdate {
  key: string;
  value: string | boolean;
}

const messageCompletionFooter = `\n# Instructions: Write the next message for {{agentName}}. Include the appropriate action from the list: {{actionNames}}

Do NOT include any thinking, reasoning, or <think> sections in your response. 
Go directly to the XML response format without any preamble or explanation.

Response format should be formatted in XML like this:
<response>
  <name>{{agentName}}</name>
  <text>Your message text here</text>
  <thought>Your thought about the response</thought>
  <actions>ACTION1,ACTION2</actions>
</response>

Do not including any thinking or internal reflection in the "text" field.
"thought" should be a short description of what the agent is thinking about before responding, including a brief justification for the response.

IMPORTANT: Your response must ONLY contain the <response></response> XML block above. Do not include any text, thinking, or reasoning before or after this XML block. Start your response immediately with <response> and end with </response>.`;

// Template for success responses when settings are updated
/**
 * JSDoc comment for successTemplate constant
 *
 * # Task: Generate a response for successful setting updates
 * {{providers}}
 *
 * # Update Information:
 * - Updated Settings: {{updateMessages}}
 * - Next Required Setting: {{nextSetting.name}}
 * - Remaining Required Settings: {{remainingRequired}}
 *
 * # Instructions:
 * 1. Acknowledge the successful update of settings
 * 2. Maintain {{agentName}}'s personality and tone
 * 3. Provide clear guidance on the next setting that needs to be configured
 * 4. Explain what the next setting is for and how to set it
 * 5. If appropriate, mention how many required settings remain
 *
 * Write a natural, conversational response that {{agentName}} would send about the successful update and next steps.
 * Include the actions array ["SETTING_UPDATED"] in your response.
 * ${messageCompletionFooter}
 */
const successTemplate = `# Task: Generate a response for successful setting updates
{{providers}}

# Update Information:
- Updated Settings: {{updateMessages}}
- Next Required Setting: {{nextSetting.name}}
- Remaining Required Settings: {{remainingRequired}}

# Instructions:
1. Acknowledge the successful update of settings
2. Maintain {{agentName}}'s personality and tone
3. Provide clear guidance on the next setting that needs to be configured
4. Explain what the next setting is for and how to set it
5. If appropriate, mention how many required settings remain

Write a natural, conversational response that {{agentName}} would send about the successful update and next steps.
Include the actions array ["SETTING_UPDATED"] in your response.
${messageCompletionFooter}`;

// Template for failure responses when settings couldn't be updated
/**
 * Template for generating a response for failed setting updates.
 *
 * @template T
 * @param {string} failureTemplate - The failure template string to fill in with dynamic content.
 * @returns {string} - The filled-in template for generating the response.
 */
const failureTemplate = `# Task: Generate a response for failed setting updates

# About {{agentName}}:
{{bio}}

# Current Settings Status:
{{settingsStatus}}

# Next Required Setting:
- Name: {{nextSetting.name}}
- Description: {{nextSetting.description}}
- Required: Yes
- Remaining Required Settings: {{remainingRequired}}

# Recent Conversation:
{{recentMessages}}

# Instructions:
1. Express that you couldn't understand or process the setting update
2. Maintain {{agentName}}'s personality and tone
3. Provide clear guidance on what setting needs to be configured next
4. Explain what the setting is for and how to set it properly
5. Use a helpful, patient tone

Write a natural, conversational response that {{agentName}} would send about the failed update and how to proceed.
Include the actions array ["SETTING_UPDATE_FAILED"] in your response.
${messageCompletionFooter}`;

// Template for error responses when unexpected errors occur
/**
 * Template for generating a response for an error during setting updates.
 *
 * The template includes placeholders for agent name, bio, recent messages,
 * and provides instructions for crafting a response.
 *
 * Instructions:
 * 1. Apologize for the technical difficulty
 * 2. Maintain agent's personality and tone
 * 3. Suggest trying again or contacting support if the issue persists
```