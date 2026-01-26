# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Matrix Orchestrator - Main Execution Engine
 *
 * This module orchestrates the execution of all matrix combinations, ensures
 * complete isolation between runs, manages cleanup, and provides comprehensive
 * result collection. This is the core execution engine for the matrix testing system.
 *
 * Required by ticket #5782 - All acceptance criteria.
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import {
  createIsolatedEnvironment,
  writeTemporaryScenario,
  IsolationContext,
} from './run-isolation';
import { createProgressTracker, ProgressTracker, ProgressEventType } from './progress-tracker';
import { createResourceMonitor, ResourceMonitor, ResourceAlert } from './resource-monitor';
import { generateRunFilename } from './file-naming-utils';
import { processManager } from './process-manager';
import { MatrixCombination } from './matrix-types';
import { MatrixConfig } from './matrix-schema';
import { IAgentRuntime, UUID, logger } from '@elizaos/core';
import { AgentServer } from '@elizaos/server';
import { Scenario, EnhancedEvaluationResult } from './schema';
import { ExecutionResult } from './providers';

/**
 * Results from executing a single matrix run.
 */
export interface MatrixRunResult {
  /** Unique identifier for this run */
  runId: string;
  /** ID of the combination this run belongs to */
  combinationId: string;
  /** Parameters that were applied for this run */
  parameters: Record<string, unknown>;
  /** When the run started */
  startTime: Date;
  /** When the run ended */
  endTime: Date;
  /** Duration in milliseconds */
  duration: number;
  /** Whether the run completed successfully */
  success: boolean;
  /** Results from the scenario execution */
  scenarioResult?: unknown;
  /** Error message if the run failed */
  error?: string;
  /** Performance and resource metrics */
  metrics: {
    /** Peak memory usage during run */
    memoryUsage: number;
    /** Disk space used during run */
    diskUsage: number;
    /** Number of tokens used (if applicable) */
    tokenCount?: number;
    /** Peak CPU usage during run */
    cpuUsage?: number;
  };
}

/**
 * Summary of the entire matrix execution.
 */
export interface MatrixExecutionSummary {
  /** Total number of runs executed */
  totalRuns: number;
  /** Number of successful runs */
  successfulRuns: number;
  /** Number of failed runs */
  failedRuns: number;
  /** Total execution time in milliseconds */
  totalDuration: number;
  /** Average time per run in milliseconds */
  averageRunTime: number;
  /** Success rate as percentage */
  successRate: number;
  /** Summary for each combination */
  combinations: CombinationSummary[];
  /** When the matrix execution started */
  startTime: Date;
  /** When the matrix execution completed */
  endTime: Date;
  /** Resource usage statistics */
  resourceUsage: {
    peakMemoryUsage: number;
    peakDiskUsage: number;
    peakCpuUsage: number;
    averageMemoryUsage: number;
    averageDiskUsage: number;
    averageCpuUsage: number;
  };
}

/**
 * Summary for a specific combination.
 */
export interface CombinationSummary {
  /** Combination identifier */
  combinationId: string;
  /** Parameters for this combination */
  parameters: Record<string, unknown>;
  /** Number of runs for this combination */
  totalRuns: number;
  /** Successful runs */
  successfulRuns: number;
  /** Failed runs */
  failedRuns: number;
  /** Success rate */
  successRate: number;
  /** Average duration */
  averageDuration: number;
  /** Individual run results */
  runs: MatrixRunResult[];
}

/**
 * Configuration options for matrix execution.
 */
export interface MatrixExecutionOptions {
  /** Output directory for results */
  outputDir: string;
  /** Maximum number of parallel runs */
  maxParallel?: number;
  /** Whether to continue on individual run failures */
  continueOnFailure?: boolean;
  /** Timeout for individual runs in milliseconds */
  runTimeout?: number;
  /** Callback for progress updates */
  onProgress?: (message: string, eventType: ProgressEventType, data?: unknown) => void;
  /** Callback when a combination completes */
  onCombinationComplete?: (summary: CombinationSummary) => void;
  /** Callback for resource warnings */
  onResourceWarning?: (alert: ResourceAlert) => void;
  /** Callback for resource updates */
  onResourceUpdate?: (resources: unknown) => void;
  /** Whether to show detailed progress information */
  verbose?: boolean;
}

/**
 * Active run tracking information.
 */
interface ActiveRun {
  runId: string;
  combinationId: string;
  parameters: Record<string, unknown>;
  context: IsolationContext;
```