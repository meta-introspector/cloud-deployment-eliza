# 5e8c73c1:packages_cli_src_commands_scenario_src_EnhancedEvaluationEngine.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EnhancedEvaluationEngine.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        : `Regex FAILED: Pattern "${pattern}" did not match in agent output.`,
      details: {
        pattern,
        regex_flags: 'i',
        actual_output: actualOutput,
        match_found: match,
        match_index: match?.index,
        matched_text: match?.[0],
      },
    };
  }
}

class EnhancedFileExistsEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'file_exists') throw new Error('Mismatched evaluator');

    const expectedPath = params.path;
    const createdFiles = Object.keys(runResult.files);

    // Check for both exact path and relative path variations
    const success =
      createdFiles.includes(expectedPath) ||
      createdFiles.includes(`./${expectedPath}`) ||
      createdFiles.includes(expectedPath.replace(/^\.\//, ''));

    const matchingPath = createdFiles.find(
      (path) =>
        path === expectedPath ||
        path === `./${expectedPath}` ||
        path === expectedPath.replace(/^\.\//, '')
    );

    return {
      evaluator_type: 'file_exists',
      success,
      summary: success
        ? `File check PASSED: File "${expectedPath}" was created by the agent.`
        : `File check FAILED: File "${expectedPath}" was not created by the agent.`,
      details: {
        expected_path: expectedPath,
        created_files: createdFiles,
        matching_path: matchingPath,
        total_files_created: createdFiles.length,
      },
    };
  }
}

class EnhancedExecutionTimeEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'execution_time') throw new Error('Mismatched evaluator');

    const duration =
      runResult.durationMs ?? (runResult.endedAtMs ?? 0) - (runResult.startedAtMs ?? 0);

    if (
      duration == null ||
      Number.isNaN(duration) ||
      (runResult.durationMs === undefined &&
        (runResult.startedAtMs === undefined || runResult.endedAtMs === undefined))
    ) {
      return {
        evaluator_type: 'execution_time',
        success: false,
        summary: 'Timing check FAILED: No timing information available for this step.',
        details: {
          error: 'no_timing_data',
          runResult_timing: {
            durationMs: runResult.durationMs,
            startedAtMs: runResult.startedAtMs,
            endedAtMs: runResult.endedAtMs,
          },
          constraints: params,
        },
      };
    }

    const tooSlow = duration > params.max_duration_ms;
    const tooFast = params.min_duration_ms != null && duration < params.min_duration_ms;
    const success = !tooSlow && !tooFast;

    let summary: string;
    if (success) {
      summary = `Timing check PASSED: Execution took ${duration}ms (within expected range).`;
    } else if (tooSlow) {
      summary = `Timing check FAILED: Execution took ${duration}ms (exceeded maximum of ${params.max_duration_ms}ms).`;
    } else {
      summary = `Timing check FAILED: Execution took ${duration}ms (below minimum of ${params.min_duration_ms}ms).`;
    }

    return {
      evaluator_type: 'execution_time',
      success,
      summary,
      details: {
        actual_duration_ms: duration,
        max_duration_ms: params.max_duration_ms,
        min_duration_ms: params.min_duration_ms,
        target_duration_ms: params.target_duration_ms,
        performance_rating: params.target_duration_ms
          ? Math.abs(duration - params.target_duration_ms) / params.target_duration_ms
          : null,
        timing_breakdown: {
          started_at: runResult.startedAtMs,
          ended_at: runResult.endedAtMs,
          calculated_duration: runResult.durationMs,
        },
      },
    };
  }
}

class EnhancedTrajectoryContainsActionEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    _runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'trajectory_contains_action') throw new Error('Mismatched evaluator');

    const actionName = params.action;

    try {
      // Wait for action memories to be written to database (prevents race condition)
      console.log(
        `🔧 [EnhancedTrajectoryContainsActionEvaluator] Waiting 2s for action memories to be written...`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get action memories from database
      const actionMemories = await runtime.getMemories({
        tableName: 'messages',
        agentId: runtime.agentId,
        count: 50,
        unique: false,
      });

      // Filter for action_result memories
      const actionResults = actionMemories.filter(
        (mem: Memory) => mem.content?.type === 'action_result'
      );

      // Normalize function to compare action names robustly
```