# 5e8c73c1:packages_cli_src_commands_scenario_src_EnhancedEvaluationEngine.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EnhancedEvaluationEngine.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const normalize = (name: string | undefined): string =>
        (typeof name === 'string' ? name : '').toLowerCase().replace(/_/g, '');
      const target = normalize(actionName);

      // Type guard for action result content
      const isActionResultContent = (
        content: unknown
      ): content is Record<string, unknown> & { actionName?: string } => {
        return typeof content === 'object' && content !== null;
      };

      // Find matching action
      const matchingAction = actionResults.find((mem: Memory) => {
        const contentObj = isActionResultContent(mem.content) ? mem.content : null;
        const actionName = contentObj?.actionName;
        return typeof actionName === 'string' && normalize(actionName) === target;
      });

      const allActionNames = actionResults.map((mem) => {
        const contentObj = isActionResultContent(mem.content) ? mem.content : null;
        return contentObj?.actionName || 'unknown';
      });

      if (!matchingAction) {
        return {
          evaluator_type: 'trajectory_contains_action',
          success: false,
          summary: `Action check FAILED: Action '${actionName}' was not found in the execution trajectory.`,
          details: {
            expected_action: actionName,
            normalized_expected: target,
            actions_found: allActionNames,
            total_actions_in_trajectory: actionResults.length,
            search_method: 'case_insensitive_with_underscore_normalization',
          },
        };
      }

      const actionStatus = matchingAction.content?.actionStatus || 'unknown';
      const actionSucceeded = actionStatus === 'completed';

      return {
        evaluator_type: 'trajectory_contains_action',
        success: true, // Success means the action was found (regardless of its outcome)
        summary: actionSucceeded
          ? `Action check PASSED: Action '${actionName}' was executed successfully.`
          : `Action check PASSED: Action '${actionName}' was found but failed execution.`,
        details: {
          expected_action: actionName,
          found_action: matchingAction.content?.actionName,
          action_status: actionStatus,
          action_succeeded: actionSucceeded,
          action_error: matchingAction.content?.error,
          action_result: matchingAction.content?.result,
          memory_id: matchingAction.id,
          all_actions_in_trajectory: allActionNames,
        },
      };
    } catch (error) {
      return {
        evaluator_type: 'trajectory_contains_action',
        success: false,
        summary: `Action check FAILED: Error while checking trajectory: ${error instanceof Error ? error.message : String(error)}`,
        details: {
          expected_action: actionName,
          error: 'trajectory_access_failed',
          error_message: error instanceof Error ? error.message : String(error),
          runtime_available: !!runtime,
          agent_id: runtime?.agentId,
        },
      };
    }
  }
}

class EnhancedLLMJudgeEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'llm_judge') throw new Error('Mismatched evaluator');

    const prompt = params.prompt;
    const expected = params.expected;
    const candidateModels = [ModelType.OBJECT_SMALL, ModelType.TEXT_LARGE, ModelType.TEXT_SMALL];
    const temperature = params.temperature || 0.1;
    const timeoutMs = Number(process.env.LLM_JUDGE_TIMEOUT_MS || 15000);

    // Pick first available model
    let modelType: (typeof ModelType)[keyof typeof ModelType] =
      candidateModels.find((m) => runtime.getModel?.(m)) ?? ModelType.TEXT_LARGE;

    // Enhanced structured prompt for qualitative analysis with dynamic capabilities
    const paramsWithCapabilities = params as EvaluationSchema & { capabilities?: string[] };
    const capabilities = paramsWithCapabilities.capabilities; // Extract capabilities from params

    // Validate capabilities if provided - use schema validation for proper error messages
    if (capabilities !== undefined) {
      try {
        // Validate just the capabilities array using schema validation
        const capabilitiesSchema = z
          .array(z.string())
          .min(1, 'Capabilities array must not be empty');
        capabilitiesSchema.parse(capabilities);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid capabilities: ${errorMessage}`);
      }
    }

    const structuredPrompt = this.createStructuredPrompt(runResult, prompt, expected, capabilities);
    const jsonSchema = this.getStructuredJudgmentSchema();

    try {
      const modelHandler = runtime.getModel(modelType);
      if (!modelHandler) {
        return {
          evaluator_type: 'llm_judge',
          success: false,
          summary: `LLM Judge FAILED: No available model handler found.`,
          details: {
            error: 'no_model_available',
            attempted_models: candidateModels,
            models_available: [],
            prompt,
            expected,
          },
        };
      }

      const objectParams: Omit<ObjectGenerationParams, 'runtime'> = {
        prompt: structuredPrompt,
        schema: jsonSchema,
        temperature,
        output: 'object',
      } as Omit<ObjectGenerationParams, 'runtime'>;

      const response = (await Promise.race([
        runtime.useModel(modelType, objectParams),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`LLM judge timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ])) as unknown;

      // Parse and validate the structured response
      let parsedResponse;
      try {
        const responseValue =
          typeof response === 'string'
```