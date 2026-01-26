# 5e8c73c1:packages_cli_src_commands_scenario_src_EvaluationEngine.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EvaluationEngine.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { IAgentRuntime, ModelType } from '@elizaos/core';
import { ExecutionResult } from './providers';
import { Evaluation as EvaluationSchema } from './schema';
import { z } from 'zod';
import type { ObjectGenerationParams, JSONSchema } from '@elizaos/core';
import {
  ConversationLengthEvaluator,
  ConversationFlowEvaluator,
  UserSatisfactionEvaluator,
  ContextRetentionEvaluator,
} from './ConversationEvaluators';

export interface EvaluationResult {
  success: boolean;
  message: string;
}

export interface Evaluator {
  evaluate(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult>;
}

export class EvaluationEngine {
  private evaluators = new Map<string, Evaluator>();

  constructor(private runtime: IAgentRuntime) {
    // Register all known evaluators
    this.register('string_contains', new StringContainsEvaluator());
    this.register('regex_match', new RegexMatchEvaluator());
    this.register('file_exists', new FileExistsEvaluator());
    this.register('trajectory_contains_action', new TrajectoryContainsActionEvaluator());
    this.register('llm_judge', new LLMJudgeEvaluator());
    this.register('execution_time', new ExecutionTimeEvaluator());

    // NEW: Register conversation evaluators
    this.register('conversation_length', new ConversationLengthEvaluator());
    this.register('conversation_flow', new ConversationFlowEvaluator());
    this.register('user_satisfaction', new UserSatisfactionEvaluator());
    this.register('context_retention', new ContextRetentionEvaluator());
  }

  private register(type: string, evaluator: Evaluator) {
    this.evaluators.set(type, evaluator);
  }

  public async runEvaluations(
    evaluations: EvaluationSchema[],
    runResult: ExecutionResult
  ): Promise<EvaluationResult[]> {
    const results: EvaluationResult[] = [];

    for (const evaluation of evaluations) {
      const evaluator = this.evaluators.get(evaluation.type);
      if (!evaluator) {
        results.push({
          success: false,
          message: `Unknown evaluator type: '${evaluation.type}'`,
        });
        continue;
      }

      const result = await evaluator.evaluate(evaluation, runResult, this.runtime);
      results.push(result);
    }

    return results;
  }

  /**
   * NEW: Enhanced evaluation method for ticket #5783
   * Returns structured JSON output using the enhanced evaluation engine
   */
  public async runEnhancedEvaluations(
    evaluations: EvaluationSchema[],
    runResult: ExecutionResult
  ): Promise<import('./schema').EnhancedEvaluationResult[]> {
    // Use enhanced evaluation engine directly
    const { EnhancedEvaluationEngine } = await import('./EnhancedEvaluationEngine');
    const enhancedEngine = new EnhancedEvaluationEngine(this.runtime);
    return enhancedEngine.runEnhancedEvaluations(evaluations, runResult);
  }
}

// --- IMPLEMENTATIONS ---

class StringContainsEvaluator implements Evaluator {
  async evaluate(params: EvaluationSchema, runResult: ExecutionResult): Promise<EvaluationResult> {
    if (params.type !== 'string_contains')
      throw new Error(
        `Mismatched evaluator: expected 'string_contains', received '${params.type}'`
      );

    const success = runResult.stdout.includes(params.value);
    return {
      success,
      message: `Checked if stdout contains "${params.value}". Result: ${success}`,
    };
  }
}

class RegexMatchEvaluator implements Evaluator {
  async evaluate(params: EvaluationSchema, runResult: ExecutionResult): Promise<EvaluationResult> {
    if (params.type !== 'regex_match')
      throw new Error(`Mismatched evaluator: expected 'regex_match', received '${params.type}'`);

    const success = new RegExp(params.pattern, 'i').test(runResult.stdout);
    return {
      success,
      message: `Checked if stdout matches regex "${params.pattern}". Result: ${success}`,
    };
  }
}

class FileExistsEvaluator implements Evaluator {
  async evaluate(params: EvaluationSchema, runResult: ExecutionResult): Promise<EvaluationResult> {
    if (params.type !== 'file_exists')
      throw new Error(`Mismatched evaluator: expected 'file_exists', received '${params.type}'`);

    // Check for both exact path and relative path (with ./ prefix)
    const filePaths = Object.keys(runResult.files);
    const success =
      filePaths.includes(params.path) ||
      filePaths.includes(`./${params.path}`) ||
      filePaths.includes(params.path.replace(/^\.\//, ''));

    return {
      success,
      message: `Checked if file "${params.path}" exists. Result: ${success}`,
    };
  }
}

class ExecutionTimeEvaluator implements Evaluator {
  async evaluate(params: EvaluationSchema, runResult: ExecutionResult): Promise<EvaluationResult> {
    if (params.type !== 'execution_time')
      throw new Error(`Mismatched evaluator: expected 'execution_time', received '${params.type}'`);

    const duration =
      runResult.durationMs ?? (runResult.endedAtMs ?? 0) - (runResult.startedAtMs ?? 0);
    if (duration == null || Number.isNaN(duration)) {
      return {
        success: false,
        message: 'No timing information available for this step',
      };
    }

    const tooSlow = duration > params.max_duration_ms;
```