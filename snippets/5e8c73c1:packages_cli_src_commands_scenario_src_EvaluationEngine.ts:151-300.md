# 5e8c73c1:packages_cli_src_commands_scenario_src_EvaluationEngine.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EvaluationEngine.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    const tooFast = params.min_duration_ms != null && duration < params.min_duration_ms;
    const success = !tooSlow && !tooFast;

    return {
      success,
      message: `Execution time ${duration}ms (min=${params.min_duration_ms ?? '-'}, target=${params.target_duration_ms ?? '-'}, max=${params.max_duration_ms})`,
    };
  }
}

export class TrajectoryContainsActionEvaluator implements Evaluator {
  async evaluate(
    params: EvaluationSchema,
    _runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult> {
    if (params.type !== 'trajectory_contains_action')
      throw new Error(
        `Mismatched evaluator: expected 'trajectory_contains_action', received '${params.type}'`
      );

    const actionName = params.action;

    try {
      // Wait for action memories to be written to database (prevents race condition)
      console.log(
        `🔧 [TrajectoryContainsActionEvaluator] Waiting 2s for action memories to be written...`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get action memories from database
      const actionMemories = await runtime.getMemories({
        tableName: 'messages',
        agentId: runtime.agentId,
        count: 50, // Get recent actions
        unique: false,
      });

      // Filter for action_result memories - look for both content.type and metadata.type
      // Type guard for action result content
      const isActionResultContent = (
        content: unknown
      ): content is Record<string, unknown> & {
        actionName?: string;
        actionStatus?: string;
        error?: string;
      } => {
        return typeof content === 'object' && content !== null;
      };

      const actionResults = actionMemories.filter((mem) => {
        if (!mem || typeof mem.content !== 'object' || mem.content === null) return false;

        const contentType = isActionResultContent(mem.content)
          ? (mem.content.type as string | undefined)
          : undefined;
        const metadataType = mem.metadata?.type;
        const contentObj = isActionResultContent(mem.content) ? mem.content : null;
        const hasActionName =
          contentObj?.actionName || (mem.metadata as Record<string, unknown>)?.actionName;

        return (
          contentType === 'action_result' ||
          metadataType === 'action_result' ||
          (contentType === 'agent' && hasActionName) // Also check agent messages with action names
        );
      });

      // Normalize function to compare action names robustly (case/underscore insensitive)
      const normalize = (name: string | undefined): string =>
        (typeof name === 'string' ? name : '').toLowerCase().replace(/_/g, '');
      const target = normalize(actionName);

      // Check if any action matches the specified name (normalized) - check both content and metadata
      const matchingAction = actionResults.find((mem) => {
        const contentObj = isActionResultContent(mem.content) ? mem.content : null;
        const contentActionName =
          typeof contentObj?.actionName === 'string' ? contentObj.actionName : undefined;
        const metadataActionName =
          typeof (mem.metadata as Record<string, unknown>)?.actionName === 'string'
            ? ((mem.metadata as Record<string, unknown>).actionName as string)
            : undefined;
        const contentNormalized = normalize(contentActionName);
        const metadataNormalized = normalize(metadataActionName);

        return contentNormalized === target || metadataNormalized === target;
      });

      if (!matchingAction) {
        return {
          success: false,
          message: `Action '${actionName}' was not found in the execution trajectory`,
        };
      }

      const contentObj = isActionResultContent(matchingAction.content)
        ? matchingAction.content
        : null;
      const actionStatus = contentObj?.actionStatus || 'unknown';
      const message =
        actionStatus === 'completed'
          ? `Action '${params.action}' was executed successfully`
          : `Action '${params.action}' was executed but failed: ${contentObj?.error || 'Unknown error'}`;

      return {
        success: true, // Success means the action was found
        message,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to check action trajectory: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

class LLMJudgeEvaluator implements Evaluator {
  async evaluate(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult> {
    if (params.type !== 'llm_judge')
      throw new Error(`Mismatched evaluator: expected 'llm_judge', received '${params.type}'`);

    const prompt = params.prompt;
    const expected = params.expected;
    // Try OBJECT_SMALL first, then TEXT_LARGE/TEXT_SMALL
    const candidateModels = [ModelType.OBJECT_SMALL, ModelType.TEXT_LARGE, ModelType.TEXT_SMALL];
    const temperature = params.temperature || 0.1;
    const jsonSchema: JSONSchema =
      (params.json_schema as JSONSchema | undefined) || this.getDefaultJudgmentSchema();
    const timeoutMs = Number(process.env.LLM_JUDGE_TIMEOUT_MS || 15000);

    // Pick first available model
    let modelType = ModelType.TEXT_LARGE;

    // Create a simple, clear prompt for object generation
    const fullPrompt = `
Context: A program was executed with the following results:
- Exit Code: ${runResult.exitCode}
- Standard Output: ${runResult.stdout}
- Standard Error: ${runResult.stderr}
- Files Created: ${Object.keys(runResult.files).join(', ')}

Question: ${prompt}

Expected: ${expected}

```