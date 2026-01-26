# 5e8c73c1:packages_cli_src_commands_report_src_analysis-engine.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/src/analysis-engine.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Analysis Engine - Core Data Aggregation Logic
 *
 * This module contains the AnalysisEngine class that processes arrays of
 * ScenarioRunResult objects and transforms them into structured ReportData
 * with comprehensive statistics, groupings, and trajectory analysis.
 *
 * Required by ticket #5787 - Data Aggregation Logic section.
 */

import { ScenarioRunResult } from '../../scenario/src/schema';
import { MatrixConfig } from '../../scenario/src/matrix-schema';
import { ReportData, ReportSummaryStats, CommonTrajectory } from './report-schema';

export interface FileProcessingStats {
  processed: number;
  skipped: number;
}

/**
 * Core analysis engine that processes raw scenario run data into structured reports
 */
export class AnalysisEngine {
  constructor() {
    // Initialize any necessary state or configuration
  }

  /**
   * Main processing method that transforms raw run results into structured report data
   *
   * @param runs Array of ScenarioRunResult objects to analyze
   * @param matrixConfig The original matrix configuration
   * @param inputDirectory Path to the input directory that was processed
   * @param fileStats Statistics about file processing (processed vs skipped)
   * @returns Complete ReportData object ready for serialization
   */
  processRunResults(
    runs: ScenarioRunResult[],
    matrixConfig: MatrixConfig,
    inputDirectory: string,
    fileStats: FileProcessingStats
  ): ReportData {
    // Calculate summary statistics across all runs
    const summaryStats = this.calculateSummaryStats(runs);

    // Group results by each matrix parameter
    const resultsByParameter = this.groupResultsByParameters(runs, matrixConfig);

    // Analyze trajectory patterns
    const commonTrajectories = this.analyzeTrajectoryPatterns(runs);

    // Build complete report data structure
    const reportData: ReportData = {
      metadata: {
        report_generated_at: new Date().toISOString(),
        matrix_config: matrixConfig,
        input_directory: inputDirectory,
        processed_files: fileStats.processed,
        skipped_files: fileStats.skipped,
      },
      summary_stats: summaryStats,
      results_by_parameter: resultsByParameter,
      common_trajectories: commonTrajectories,
      raw_results: runs,
    };

    return reportData;
  }

  /**
   * Calculate high-level summary statistics across all runs
   */
  private calculateSummaryStats(runs: ScenarioRunResult[]): ReportSummaryStats {
    if (runs.length === 0) {
      return {
        total_runs: 0,
        total_failed_runs: 0,
        average_execution_time: 0,
        median_execution_time: 0,
        average_llm_calls: 0,
        average_total_tokens: 0,
        capability_success_rates: {},
        overall_success_rate: 0,
      };
    }

    const totalRuns = runs.length;
    const failedRuns = runs.filter((run) => run.error !== null).length;
    const successfulRuns = runs.filter((run) => run.error === null);

    // Calculate execution time statistics
    const executionTimes = runs.map((run) => run.metrics.execution_time_seconds);
    const averageExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0) / totalRuns;
    const sortedExecutionTimes = [...executionTimes].sort((a, b) => a - b);
    const medianExecutionTime = this.calculateMedian(sortedExecutionTimes);

    // Calculate LLM usage statistics
    const averageLlmCalls = runs.reduce((sum, run) => sum + run.metrics.llm_calls, 0) / totalRuns;
    const averageTotalTokens =
      runs.reduce((sum, run) => sum + run.metrics.total_tokens, 0) / totalRuns;

    // Calculate capability success rates
    const capabilitySuccessRates = this.calculateCapabilitySuccessRates(runs);

    // Overall success rate
    const overallSuccessRate = successfulRuns.length / totalRuns;

    return {
      total_runs: totalRuns,
      total_failed_runs: failedRuns,
      average_execution_time: averageExecutionTime,
      median_execution_time: medianExecutionTime,
      average_llm_calls: averageLlmCalls,
      average_total_tokens: averageTotalTokens,
      capability_success_rates: capabilitySuccessRates,
      overall_success_rate: overallSuccessRate,
    };
  }

  /**
   * Calculate success rates for each evaluation capability
   */
  private calculateCapabilitySuccessRates(runs: ScenarioRunResult[]): Record<string, number> {
    const capabilityStats: Record<string, { total: number; passed: number }> = {};

    // Collect all capability results
    runs.forEach((run) => {
      run.evaluations.forEach((evaluation) => {
        // Extract capability from evaluation details or use evaluator_type as fallback
        const capabilityRaw = evaluation.details?.capability || evaluation.evaluator_type;
        const capability =
          typeof capabilityRaw === 'string' ? capabilityRaw : String(capabilityRaw || 'unknown');
        if (capability && capability !== 'unknown') {
          if (!capabilityStats[capability]) {
            capabilityStats[capability] = { total: 0, passed: 0 };
          }
          capabilityStats[capability].total++;
          if (evaluation.success) {
            capabilityStats[capability].passed++;
          }
        }
      });
    });

    // Calculate success rates
    const successRates: Record<string, number> = {};
    Object.entries(capabilityStats).forEach(([capability, stats]) => {
      successRates[capability] = stats.total > 0 ? stats.passed / stats.total : 0;
    });

```