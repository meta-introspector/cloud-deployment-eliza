# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-types.ts:151-206

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-types.ts:151-206
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    runIndex: number;

    /** Whether this run succeeded */
    success: boolean;

    /** Duration of this run in milliseconds */
    duration: number;

    /** Error message if the run failed */
    error?: string;

    /** Detailed evaluation results */
    evaluations?: Array<{ success: boolean; message: string; [key: string]: unknown }>;
  }>;

  /** Error message if the combination failed */
  error?: string;

  /** Timestamp when this combination was executed */
  executedAt: Date;
}

/**
 * Complete results of a matrix execution.
 */
export interface MatrixExecutionResult {
  /** The execution context */
  context: MatrixExecutionContext;

  /** Results for each combination */
  results: CombinationResult[];

  /** Summary statistics */
  summary: {
    /** Total combinations executed */
    totalCombinations: number;

    /** Number of combinations that passed */
    successfulCombinations: number;

    /** Number of combinations that failed */
    failedCombinations: number;

    /** Success rate as a percentage */
    successRate: number;

    /** Total execution time in milliseconds */
    totalDuration: number;

    /** Average time per combination in milliseconds */
    averageCombinationDuration: number;
  };

  /** Timestamp when execution completed */
  completedAt: Date;
}
```