# 5e8c73c1:packages_cli_src_commands_scenario_src_EnhancedEvaluationEngine.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EnhancedEvaluationEngine.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Enhanced Evaluation Engine for Ticket #5783
 *
 * This module provides structured JSON output from evaluators while maintaining
 * 100% backward compatibility with existing scenario files.
 *
 * CRITICAL: This is an ADDITIVE enhancement that does NOT break existing functionality.
 */

import { IAgentRuntime, ModelType, Memory } from '@elizaos/core';
import { ExecutionResult } from './providers';
import { Evaluation as EvaluationSchema, EnhancedEvaluationResult } from './schema';
import { Evaluator } from './EvaluationEngine'; // Import existing types
import { z } from 'zod';
import type { ObjectGenerationParams } from '@elizaos/core';

/**
 * Enhanced evaluator interface that returns structured results
 */
export interface EnhancedEvaluator {
  evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EnhancedEvaluationResult>;
}

/**
 * Adapter that can work with both legacy and enhanced evaluators
 */
export interface DualEvaluator extends Evaluator, EnhancedEvaluator {}

/**
 * Enhanced Evaluation Engine that provides structured JSON output
 * while maintaining backward compatibility with existing scenarios.
 */
export class EnhancedEvaluationEngine {
  private enhancedEvaluators = new Map<string, EnhancedEvaluator>();

  constructor(private runtime: IAgentRuntime) {
    // Register enhanced versions of all evaluators
    this.register('string_contains', new EnhancedStringContainsEvaluator());
    this.register('regex_match', new EnhancedRegexMatchEvaluator());
    this.register('file_exists', new EnhancedFileExistsEvaluator());
    this.register('trajectory_contains_action', new EnhancedTrajectoryContainsActionEvaluator());
    this.register('llm_judge', new EnhancedLLMJudgeEvaluator());
    this.register('execution_time', new EnhancedExecutionTimeEvaluator());
  }

  private register(type: string, evaluator: EnhancedEvaluator) {
    this.enhancedEvaluators.set(type, evaluator);
  }

  /**
   * NEW: Run evaluations with structured JSON output
   */
  public async runEnhancedEvaluations(
    evaluations: EvaluationSchema[],
    runResult: ExecutionResult
  ): Promise<EnhancedEvaluationResult[]> {
    const results: EnhancedEvaluationResult[] = [];

    for (const evaluation of evaluations) {
      const evaluator = this.enhancedEvaluators.get(evaluation.type);
      if (!evaluator) {
        results.push({
          evaluator_type: evaluation.type,
          success: false,
          summary: `Unknown evaluator type: '${evaluation.type}'`,
          details: {
            error: 'evaluator_not_found',
            requested_type: evaluation.type,
            available_types: Array.from(this.enhancedEvaluators.keys()),
          },
        });
        continue;
      }

      try {
        const result = await evaluator.evaluateEnhanced(evaluation, runResult, this.runtime);
        results.push(result);
      } catch (error) {
        results.push({
          evaluator_type: evaluation.type,
          success: false,
          summary: `Evaluator '${evaluation.type}' failed with error: ${error instanceof Error ? error.message : String(error)}`,
          details: {
            error: 'evaluator_execution_failed',
            error_message: error instanceof Error ? error.message : String(error),
            evaluation_config: evaluation,
          },
        });
      }
    }

    return results;
  }
}

// --- ENHANCED EVALUATOR IMPLEMENTATIONS ---

class EnhancedStringContainsEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'string_contains') throw new Error('Mismatched evaluator');

    const expectedValue = params.value;
    const actualOutput = runResult.stdout;
    const caseSensitive = params.case_sensitive ?? false;

    const searchIn = caseSensitive ? actualOutput : actualOutput.toLowerCase();
    const searchFor = caseSensitive ? expectedValue : expectedValue.toLowerCase();
    const success = searchIn.includes(searchFor);

    return {
      evaluator_type: 'string_contains',
      success,
      summary: success
        ? `Assertion PASSED: Agent response contained the expected substring "${expectedValue}".`
        : `Assertion FAILED: Agent response did not contain the expected substring "${expectedValue}".`,
      details: {
        expected_value: expectedValue,
        actual_output: actualOutput,
        case_sensitive: caseSensitive,
        search_performed: `Looking for "${searchFor}" in "${searchIn.substring(0, 100)}${searchIn.length > 100 ? '...' : ''}"`,
      },
    };
  }
}

class EnhancedRegexMatchEvaluator implements EnhancedEvaluator {
  async evaluateEnhanced(
    params: EvaluationSchema,
    runResult: ExecutionResult
  ): Promise<EnhancedEvaluationResult> {
    if (params.type !== 'regex_match') throw new Error('Mismatched evaluator');

    const pattern = params.pattern;
    const actualOutput = runResult.stdout;
    const regex = new RegExp(pattern, 'i');
    const match = regex.exec(actualOutput);
    const success = match !== null;

    return {
      evaluator_type: 'regex_match',
      success,
      summary: success
        ? `Regex PASSED: Pattern "${pattern}" matched in agent output.`
```