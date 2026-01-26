# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationEvaluators.ts:301-448

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationEvaluators.ts:301-448
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
Consider:
- Did the user's problem get resolved?
- Was the user's tone positive or negative?
- Did the user express gratitude or frustration?
- Was the conversation helpful to the user?
- Did the user seem to achieve their objective?

Conversation:
${conversationText}

Respond with only a number between 0.0 and 1.0:`;

    try {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: prompt,
        temperature: 0.1,
      });

      const score = parseFloat(response.trim());
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('[UserSatisfactionEvaluator] LLM judgment failed:', error);
      return 0.5; // Default to neutral on error
    }
  }
}

/**
 * Evaluates agent's ability to retain context across conversation turns
 */
interface ContextRetentionParams {
  type: 'context_retention';
  test_memory_of: string[];
  retention_turns?: number;
  memory_accuracy_threshold?: number;
}

export class ContextRetentionEvaluator implements Evaluator {
  async evaluate(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult> {
    const typedParams = params as ContextRetentionParams;
    const { test_memory_of, retention_turns, memory_accuracy_threshold } = typedParams;
    const conversationText = runResult.stdout;

    const turns = this.parseConversationTurns(conversationText);
    const retentionTurns = retention_turns || 3;
    const threshold = memory_accuracy_threshold || 0.8;

    const memoryTests = [];

    for (const memoryItem of test_memory_of) {
      const accuracy = await this.testMemoryRetention(memoryItem, turns, retentionTurns, runtime);
      memoryTests.push({ item: memoryItem, accuracy });
    }

    const averageAccuracy =
      memoryTests.reduce((sum, test) => sum + test.accuracy, 0) / memoryTests.length;
    const success = averageAccuracy >= threshold;

    const itemResults = memoryTests
      .map((t) => `${t.item}: ${(t.accuracy * 100).toFixed(1)}%`)
      .join(', ');

    const message = `Context retention: ${(averageAccuracy * 100).toFixed(1)}% average (${itemResults})`;

    return { success, message };
  }

  private parseConversationTurns(conversationText: string): string[] {
    const turns = conversationText.split(/Turn \d+:/).filter((turn) => turn.trim());
    return turns;
  }

  private async testMemoryRetention(
    memoryItem: string,
    turns: string[],
    retentionTurns: number,
    runtime: IAgentRuntime
  ): Promise<number> {
    // Find where the memory item is first mentioned
    let mentionTurn = -1;
    for (let i = 0; i < turns.length; i++) {
      if (turns[i].toLowerCase().includes(memoryItem.toLowerCase())) {
        mentionTurn = i;
        break;
      }
    }

    if (mentionTurn === -1) return 0; // Item never mentioned

    // Check retention in subsequent turns
    let retentionScore = 0;
    let testsCount = 0;

    const endTurn = Math.min(turns.length, mentionTurn + retentionTurns + 1);
    for (let i = mentionTurn + 1; i < endTurn; i++) {
      const retained = await this.checkMemoryInTurn(
        memoryItem,
        turns[i],
        turns.slice(0, i + 1),
        runtime
      );
      if (retained) retentionScore += 1;
      testsCount += 1;
    }

    return testsCount > 0 ? retentionScore / testsCount : 0;
  }

  private async checkMemoryInTurn(
    memoryItem: string,
    currentTurn: string,
    previousTurns: string[],
    runtime: IAgentRuntime
  ): Promise<boolean> {
    const context = previousTurns.slice(0, -1).join('\n'); // All turns except current

    const prompt = `Based on the previous conversation context, does the agent demonstrate memory/awareness of "${memoryItem}" in the current turn?

Previous context:
${context}

Current turn:
${currentTurn}

The agent shows memory if they:
- Reference the specific item
- Use information related to the item
- Show understanding of previous mentions

Respond with only 'yes' or 'no'.`;

    try {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: prompt,
        temperature: 0.1,
      });

      return response.toLowerCase().includes('yes');
    } catch (error) {
      console.error(`[ContextRetentionEvaluator] Memory check failed for ${memoryItem}:`, error);
      return false;
    }
  }
}
```