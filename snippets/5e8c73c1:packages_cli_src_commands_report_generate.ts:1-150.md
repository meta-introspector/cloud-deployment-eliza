# 5e8c73c1:packages_cli_src_commands_report_generate.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Report Generate Command Implementation
 *
 * This module implements the 'elizaos report generate' subcommand that processes
 * raw JSON outputs from Scenario Matrix runs and generates comprehensive reports.
 *
 * Required by ticket #5787 - CLI Command Registration and Implementation.
 */

import { Command } from 'commander';
import { promises as fs, existsSync } from 'fs';
import { join, resolve } from 'path';
import { glob } from 'glob';
import { AnalysisEngine } from './src/analysis-engine';
import {
  ScenarioRunResult,
  ScenarioRunResultSchema,
  TrajectoryStep,
  EnhancedEvaluationResult,
} from '../scenario/src/schema';
import { MatrixConfig } from '../scenario/src/matrix-schema';
import { MatrixRunResult } from '../scenario/src/matrix-orchestrator';
import { ReportData, ReportDataSchema } from './src/report-schema';
import { generatePerformanceReportPdf } from './src/pdf-generator';

export interface GenerateCommandOptions {
  outputPath?: string;
  format?: string;
}

/**
 * Transform MatrixRunResult to ScenarioRunResult format for report processing
 */
function transformMatrixRunResultToScenarioRunResult(
  matrixResult: MatrixRunResult
): ScenarioRunResult {
  // Extract trajectory from scenarioResult.executionResults if available
  let trajectory: TrajectoryStep[] = [];
  let evaluations: EnhancedEvaluationResult[] = [];
  let finalResponse = '';

  // Handle successful runs with scenarioResult
  interface ScenarioExecutionResult {
    trajectory?: Array<{ type: string; timestamp: string; content: string | unknown }>;
    stdout?: string;
    [key: string]: unknown;
  }

  interface ScenarioResultWithExecution {
    executionResults?: ScenarioExecutionResult[];
    [key: string]: unknown;
  }

  const scenarioResult = matrixResult.scenarioResult as ScenarioResultWithExecution | undefined;
  if (scenarioResult && scenarioResult.executionResults) {
    const firstExecutionResult = scenarioResult.executionResults[0];
    if (firstExecutionResult) {
      // Extract trajectory
      if (firstExecutionResult.trajectory) {
        trajectory = firstExecutionResult.trajectory.map(
          (step: {
            type: string;
            timestamp: string;
            content: string | unknown;
          }): TrajectoryStep => {
            const stepType =
              step.type === 'action' || step.type === 'thought' || step.type === 'observation'
                ? step.type
                : 'observation'; // Default to observation if type is invalid
            return {
              type: stepType,
              timestamp: step.timestamp,
              content: typeof step.content === 'string' ? step.content : String(step.content || ''), // Provide default empty string if content is missing
            };
          }
        );
      }

      // Extract final response
      finalResponse = firstExecutionResult.stdout || '';
    }
  }

  // Extract evaluations from scenarioResult
  interface EvaluationResult {
    evaluator_type?: string;
    success?: boolean;
    summary?: string;
    details?: unknown;
    [key: string]: unknown;
  }

  interface ScenarioResultWithEvaluations {
    evaluations?: EvaluationResult[];
    [key: string]: unknown;
  }

  const scenarioResultWithEvaluations = scenarioResult as ScenarioResultWithEvaluations | undefined;
  if (scenarioResultWithEvaluations && scenarioResultWithEvaluations.evaluations) {
    // Keep enhanced evaluation results in their original format - ScenarioRunResult expects EnhancedEvaluationResult[]
    const filteredEvaluations = scenarioResultWithEvaluations.evaluations.filter(
      (evaluation: EvaluationResult) => {
        // Only include evaluations that have the expected enhanced format
        return (
          evaluation &&
          typeof evaluation.evaluator_type === 'string' &&
          typeof evaluation.success === 'boolean' &&
          typeof evaluation.summary === 'string' &&
          evaluation.details !== undefined &&
          typeof evaluation.details === 'object' &&
          evaluation.details !== null
        );
      }
    );
    evaluations = filteredEvaluations.map((evaluation) => ({
      evaluator_type: evaluation.evaluator_type as string,
      success: evaluation.success as boolean,
      summary: evaluation.summary as string,
      details: evaluation.details as Record<string, unknown>,
    }));
  }

  // Calculate LLM calls from trajectory data
  let llmCallCount = 0;
  if (trajectory.length > 0) {
    // Count LLM-generated thoughts and replies
    llmCallCount = trajectory.filter(
      (step) =>
        step.type === 'thought' ||
        (step.type === 'action' &&
          typeof step.content === 'object' &&
          step.content.name === 'REPLY') ||
        (step.type === 'observation' &&
          typeof step.content === 'string' &&
          step.content.includes('Generated reply:'))
    ).length;

    // At minimum, we know there was at least 1 LLM call if we have trajectory steps
    if (llmCallCount === 0 && trajectory.length > 0) {
      llmCallCount = 1;
    }
  }

  // Transform metrics to expected format - handle both successful and failed runs
  const baseMetrics = matrixResult.metrics || { memoryUsage: 0, diskUsage: 0, tokenCount: 0 };
  const transformedMetrics = {
    execution_time_seconds: matrixResult.duration / 1000, // Convert ms to seconds
    llm_calls: llmCallCount, // Use calculated LLM call count from trajectory
    total_tokens: baseMetrics.tokenCount || 0,
    // Copy any additional numeric metrics, excluding specific fields
```