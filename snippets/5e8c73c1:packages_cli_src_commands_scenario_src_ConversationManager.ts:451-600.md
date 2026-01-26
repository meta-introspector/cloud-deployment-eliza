# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationManager.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationManager.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
   * @private
   */
  private async checkConversationStuck(turns: ConversationTurn[]): Promise<boolean> {
    if (turns.length < 3) return false;

    // Check if last 2 agent responses are very similar (indicating repetition)
    const lastResponse = turns[turns.length - 1].agentResponse;
    const prevResponse = turns[turns.length - 2].agentResponse;

    // Simple similarity check - could be enhanced with more sophisticated NLP
    const similarity = this.calculateStringSimilarity(lastResponse, prevResponse);
    return similarity > 0.8;
  }

  /**
   * Check for escalation keywords
   * @private
   */
  private async checkEscalationKeywords(
    turns: ConversationTurn[],
    condition: TerminationCondition
  ): Promise<boolean> {
    const defaultKeywords = [
      'escalate',
      'supervisor',
      'manager',
      'specialist',
      'human agent',
      'transfer',
    ];
    const keywords = condition.keywords || defaultKeywords;

    if (turns.length === 0) return false;

    const lastTurn = turns[turns.length - 1];
    const agentResponse = lastTurn.agentResponse.toLowerCase();

    return keywords.some((keyword) => agentResponse.includes(keyword.toLowerCase()));
  }

  /**
   * Check if user's goal appears to be achieved
   * @private
   */
  private async checkGoalAchieved(
    turns: ConversationTurn[],
    condition: TerminationCondition
  ): Promise<boolean> {
    if (condition.llm_judge) {
      return await this.checkLLMJudgeCondition(turns, condition);
    }

    // Default goal achievement check using keyword analysis
    const goalKeywords = condition.keywords || [
      'done',
      'complete',
      'finished',
      'accomplished',
      'achieved',
    ];
    const conversationText = this.generateTranscript(turns).toLowerCase();

    return goalKeywords.some((keyword) => conversationText.includes(keyword));
  }

  /**
   * Use LLM to judge termination condition
   * @private
   */
  private async checkLLMJudgeCondition(
    turns: ConversationTurn[],
    condition: TerminationCondition
  ): Promise<boolean> {
    if (!condition.llm_judge) return false;

    const conversationText = this.generateTranscript(turns);
    const prompt = `${condition.llm_judge.prompt}\n\nConversation:\n${conversationText}\n\nShould this conversation be terminated? Respond with only 'yes' or 'no'.`;

    try {
      const response = await this.runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: prompt,
        temperature: 0.1,
      });

      return response.toLowerCase().includes('yes');
    } catch (error) {
      console.error(`❌ [ConversationManager] LLM judge termination check failed:`, error);
      return false;
    }
  }

  /**
   * Calculate string similarity using Jaccard similarity
   * @private
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Create combined execution result for final evaluations
   * @private
   */
  private createCombinedExecutionResult(turns: ConversationTurn[], totalDuration: number) {
    const combinedTrajectory = turns.flatMap((turn) => turn.trajectory || []);
    const combinedOutput = this.generateTranscript(turns);

    return {
      exitCode: 0,
      stdout: combinedOutput,
      stderr: '',
      files: {},
      startedAtMs: turns[0]?.executionResult?.startedAtMs || Date.now(),
      endedAtMs: Date.now(),
      durationMs: totalDuration,
      trajectory: combinedTrajectory,
    };
  }

  /**
   * Determine which termination condition was met
   * @private
   */
  private async getTerminationReason(
    turns: ConversationTurn[],
    conditions: TerminationCondition[]
  ): Promise<string | null> {
    if (turns.length === 0) return null;

    // Check each condition to see which one terminated the conversation
    for (const condition of conditions) {
      const recentTurns = turns.slice(-2); // Check last 2 turns for termination
      if (await this.checkTerminationConditions(recentTurns, [condition])) {
        return condition.type;
      }
    }

    return null; // Conversation ended due to max_turns_reached
  }

  /**
   * Generate a readable transcript of the conversation
   * @private
   */
```