# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationManager.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationManager.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      userInput,
      90000,
      this.serverPort,
      this.conversationChannelId // NEW: Pass existing channel ID
    );

    // NEW: Verify we're still using the same channel
    if (roomId !== this.conversationChannelId) {
      console.warn(
        `⚠️  [ConversationManager] Channel mismatch: expected ${this.conversationChannelId}, got ${roomId}`
      );
    }

    console.log(`🤖 [ConversationManager] Turn ${turnNumber} Response: "${agentResponse}"`);

    // Give time for trajectory to be written to database
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reconstruct trajectory for this turn
    const trajectory = await this.trajectoryReconstructor.getLatestTrajectory(roomId);

    const turnEndTime = Date.now();
    const turnDuration = turnEndTime - turnStartTime;

    // Create execution result for this turn (following existing pattern)
    const executionResult = {
      exitCode: 0,
      stdout: agentResponse,
      stderr: '',
      files: {}, // No file operations in conversation turns
      startedAtMs: turnStartTime,
      endedAtMs: turnEndTime,
      durationMs: turnDuration,
      trajectory,
    };

    return {
      turnNumber,
      userInput,
      agentResponse,
      roomId,
      trajectory,
      duration: turnDuration,
      executionResult,
      turnEvaluations: [], // Will be populated later
    };
  }

  /**
   * Check if any termination conditions are met
   * @private
   */
  private async checkTerminationConditions(
    turns: ConversationTurn[],
    conditions: TerminationCondition[]
  ): Promise<boolean> {
    if (!conditions || conditions.length === 0) return false;

    for (const condition of conditions) {
      let shouldTerminate = false;

      switch (condition.type) {
        case 'user_expresses_satisfaction':
          shouldTerminate = await this.checkSatisfactionKeywords(turns, condition);
          break;
        case 'agent_provides_solution':
          shouldTerminate = await this.checkSolutionKeywords(turns, condition);
          break;
        case 'conversation_stuck':
          shouldTerminate = await this.checkConversationStuck(turns);
          break;
        case 'escalation_needed':
          shouldTerminate = await this.checkEscalationKeywords(turns, condition);
          break;
        case 'goal_achieved':
          shouldTerminate = await this.checkGoalAchieved(turns, condition);
          break;
        case 'custom_condition':
          if (condition.llm_judge) {
            shouldTerminate = await this.checkLLMJudgeCondition(turns, condition);
          }
          break;
      }

      if (shouldTerminate) {
        console.log(`🛑 [ConversationManager] Termination condition met: ${condition.type}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Check for user satisfaction keywords
   * @private
   */
  private async checkSatisfactionKeywords(
    turns: ConversationTurn[],
    condition: TerminationCondition
  ): Promise<boolean> {
    const defaultKeywords = [
      'thank you',
      'thanks',
      'perfect',
      'great',
      'that works',
      'solved',
      'fixed',
      'resolved',
    ];
    const keywords = condition.keywords || defaultKeywords;

    if (turns.length === 0) return false;

    // Check both the last user input and agent response for satisfaction indicators
    const lastTurn = turns[turns.length - 1];
    const textToCheck = `${lastTurn.userInput} ${lastTurn.agentResponse}`.toLowerCase();

    return keywords.some((keyword) => textToCheck.includes(keyword.toLowerCase()));
  }

  /**
   * Check for agent solution keywords
   * @private
   */
  private async checkSolutionKeywords(
    turns: ConversationTurn[],
    condition: TerminationCondition
  ): Promise<boolean> {
    const defaultKeywords = [
      'solution',
      'try this',
      'follow these steps',
      "here's how",
      'you can',
      'to fix this',
    ];
    const keywords = condition.keywords || defaultKeywords;

    if (turns.length === 0) return false;

    const lastTurn = turns[turns.length - 1];
    const agentResponse = lastTurn.agentResponse.toLowerCase();

    return keywords.some((keyword) => agentResponse.includes(keyword.toLowerCase()));
  }

  /**
   * Check if conversation appears stuck (repetitive responses)
```