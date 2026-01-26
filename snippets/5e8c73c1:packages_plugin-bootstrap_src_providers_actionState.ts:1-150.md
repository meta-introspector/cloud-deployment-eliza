# 5e8c73c1:packages_plugin-bootstrap_src_providers_actionState.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/actionState.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import {
  addHeader,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type State,
  logger,
} from '@elizaos/core';

/**
 * Working memory entry from action execution
 */
interface WorkingMemoryEntry {
  actionName?: string;
  result?: {
    text?: string;
    data?: unknown;
  };
  timestamp?: number;
}

/**
 * Provider for sharing action execution state and plan between actions
 * Makes previous action results and execution plan available to subsequent actions
 */
export const actionStateProvider: Provider = {
  name: 'ACTION_STATE',
  description:
    'Previous action results, working memory, and action plan from the current execution run',
  position: 150,
  get: async (runtime: IAgentRuntime, message: Memory, state: State) => {
    // Get action results, plan, and working memory from the incoming state
    const actionResults = state.data?.actionResults || [];
    const actionPlan = state.data?.actionPlan || null;
    const workingMemory = state.data?.workingMemory || {};

    // Format action plan for display
    let planText = '';
    if (actionPlan && actionPlan.totalSteps > 1) {
      const completedSteps = actionPlan.steps.filter((s) => s.status === 'completed').length;
      const failedSteps = actionPlan.steps.filter((s) => s.status === 'failed').length;

      planText = addHeader(
        '# Action Execution Plan',
        [
          `**Plan:** ${actionPlan.thought}`,
          `**Progress:** Step ${actionPlan.currentStep} of ${actionPlan.totalSteps}`,
          `**Status:** ${completedSteps} completed, ${failedSteps} failed`,
          '',
          '## Steps:',
          ...actionPlan.steps.map((step, index: number) => {
            const icon =
              step.status === 'completed'
                ? '✓'
                : step.status === 'failed'
                  ? '✗'
                  : index < actionPlan.currentStep - 1
                    ? '○'
                    : index === actionPlan.currentStep - 1
                      ? '→'
                      : '○';
            const status =
              step.status === 'pending' && index === actionPlan.currentStep - 1
                ? 'in progress'
                : step.status;
            let stepText = `${icon} **Step ${index + 1}:** ${step.action} (${status})`;

            if (step.error) {
              stepText += `\n   Error: ${step.error}`;
            }
            if (step.result?.text) {
              stepText += `\n   Result: ${step.result.text}`;
            }

            return stepText;
          }),
          '',
        ].join('\n')
      );
    }

    // Format previous action results
    let resultsText = '';
    if (actionResults.length > 0) {
      const formattedResults = actionResults
        .map((result, index) => {
          const actionName =
            (result.data as { actionName?: string } | undefined)?.actionName || 'Unknown Action';
          const success = result.success;
          const status = success ? 'Success' : 'Failed';

          let resultText = `**${index + 1}. ${actionName}** - ${status}`;

          if (result.text) {
            resultText += `\n   Output: ${result.text}`;
          }

          if (result.error) {
            const errorMsg = result.error instanceof Error ? result.error.message : result.error;
            resultText += `\n   Error: ${errorMsg}`;
          }

          if (result.values && Object.keys(result.values).length > 0) {
            const values = Object.entries(result.values)
              .map(([key, value]) => `   - ${key}: ${JSON.stringify(value)}`)
              .join('\n');
            resultText += `\n   Values:\n${values}`;
          }

          return resultText;
        })
        .join('\n\n');

      resultsText = addHeader('# Previous Action Results', formattedResults);
    } else {
      resultsText = 'No previous action results available.';
    }

    // Format working memory
    let memoryText = '';
    if (Object.keys(workingMemory).length > 0) {
      const memoryEntries = Object.entries(workingMemory)
        .sort((a, b) => {
          const aTimestamp =
            a[1] &&
            typeof a[1] === 'object' &&
            'timestamp' in a[1] &&
            typeof a[1].timestamp === 'number'
              ? a[1].timestamp
              : 0;
          const bTimestamp =
            b[1] &&
            typeof b[1] === 'object' &&
            'timestamp' in b[1] &&
            typeof b[1].timestamp === 'number'
              ? b[1].timestamp
              : 0;
          return bTimestamp - aTimestamp;
        })
        .slice(0, 10) // Show last 10 entries
        .map(([key, value]: [string, unknown]) => {
          const valueObj =
            value && typeof value === 'object' ? (value as WorkingMemoryEntry) : null;
          if (valueObj?.actionName && valueObj.result) {
            return `**${valueObj.actionName}**: ${valueObj.result.text || JSON.stringify(valueObj.result.data)}`;
          }
          return `**${key}**: ${JSON.stringify(value)}`;
        })
        .join('\n');

```