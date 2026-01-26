# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationManager.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationManager.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      for (let turnNumber = 1; turnNumber <= config.max_turns; turnNumber++) {
        console.log(`🗣️  [ConversationManager] === TURN ${turnNumber}/${config.max_turns} ===`);

        const turn = await this.executeTurn(currentInput, turnNumber, config, turns);

        turns.push(turn);

        // Run turn-level evaluations
        if (config.turn_evaluations?.length > 0) {
          const rawTurnEvaluations = await this.evaluationEngine.runEnhancedEvaluations(
            config.turn_evaluations as Evaluation[],
            turn.executionResult
          );

          // BUGFIX: Filter out any malformed evaluation results to prevent ZodError
          const filteredTurnEvaluations = rawTurnEvaluations.filter(
            (result) =>
              result &&
              typeof result === 'object' &&
              'evaluator_type' in result &&
              'success' in result &&
              'summary' in result &&
              'details' in result
          );

          if (filteredTurnEvaluations.length !== rawTurnEvaluations.length) {
            console.warn(
              `🗣️  [ConversationManager] Turn ${turnNumber}: Filtered out ${rawTurnEvaluations.length - filteredTurnEvaluations.length} malformed turn evaluation results`
            );
          }

          turn.turnEvaluations = filteredTurnEvaluations;

          if (config.debug_options?.log_turn_decisions) {
            console.log(
              `📊 [ConversationManager] Turn ${turnNumber} evaluations:`,
              filteredTurnEvaluations.map((e) => `${e.success ? '✅' : '❌'} ${e.summary}`)
            );
          }
        }

        // Check termination conditions
        if (await this.checkTerminationConditions(turns, config.termination_conditions)) {
          console.log(`🛑 [ConversationManager] Termination condition met at turn ${turnNumber}`);
          break;
        }

        // Generate next user input (if not last turn)
        if (turnNumber < config.max_turns) {
          const simulationContext: SimulationContext = {
            turnNumber: turnNumber + 1,
            maxTurns: config.max_turns,
            debugOptions: config.debug_options,
          };

          currentInput = await this.userSimulator!.generateResponse(
            turns,
            turn.agentResponse,
            simulationContext
          );

          console.log(`👤 [ConversationManager] User (simulated): "${currentInput}"`);
        }
      }

      const endTime = Date.now();
      const totalDuration = endTime - startTime;

      // Run final evaluations
      let finalEvaluations: EnhancedEvaluationResult[] = [];
      if (config.final_evaluations?.length > 0) {
        // Create a combined execution result for final evaluations
        const combinedResult = this.createCombinedExecutionResult(turns, totalDuration);
        const rawEvaluations = await this.evaluationEngine.runEnhancedEvaluations(
          config.final_evaluations as Evaluation[],
          combinedResult
        );

        // BUGFIX: Filter out any malformed evaluation results to prevent ZodError
        finalEvaluations = rawEvaluations.filter(
          (result) =>
            result &&
            typeof result === 'object' &&
            'evaluator_type' in result &&
            'success' in result &&
            'summary' in result &&
            'details' in result
        );

        if (finalEvaluations.length !== rawEvaluations.length) {
          console.warn(
            `🗣️  [ConversationManager] Filtered out ${rawEvaluations.length - finalEvaluations.length} malformed evaluation results`
          );
        }
      }

      const result: ConversationResult = {
        turns,
        totalDuration,
        terminatedEarly: turns.length < config.max_turns,
        terminationReason: await this.getTerminationReason(turns, config.termination_conditions),
        finalEvaluations,
        conversationTranscript: this.generateTranscript(turns),
        success: this.determineOverallSuccess(turns, finalEvaluations),
      };

      console.log(`🎯 [ConversationManager] Conversation completed:`);
      console.log(`   - Turns: ${turns.length}/${config.max_turns}`);
      console.log(`   - Duration: ${(totalDuration / 1000).toFixed(1)}s`);
      console.log(`   - Success: ${result.success}`);
      console.log(`   - Termination: ${result.terminationReason || 'max_turns_reached'}`);

      return result;
    } catch (originalError) {
      console.error(
        `🗣️  [ConversationManager] Conversation failed: ${originalError instanceof Error ? originalError.message : String(originalError)}`
      );
      try {
        await this.cleanupConversationChannel();
      } catch (cleanupError) {
        console.error('🗑️  [ConversationManager] Cleanup failed:', cleanupError);
      }
      throw originalError;
    }
  }

  /**
   * Execute a single conversation turn
   * @private
   */
  private async executeTurn(
    userInput: string,
    turnNumber: number,
    _config: ConversationConfig,
    _previousTurns: ConversationTurn[]
  ): Promise<ConversationTurn> {
    const turnStartTime = Date.now();

    // NEW: Validate conversation channel exists
    if (!this.conversationChannelId) {
      throw new Error('No conversation channel available for turn execution');
    }

    console.log(`👤 [ConversationManager] Turn ${turnNumber} Input: "${userInput}"`);
    console.log(`🔗 [ConversationManager] Using channel: ${this.conversationChannelId}`);

    // NEW: Use existing conversation channel
    const { response: agentResponse, roomId } = await askAgentViaApi(
      this.server,
      this.agentId,
```