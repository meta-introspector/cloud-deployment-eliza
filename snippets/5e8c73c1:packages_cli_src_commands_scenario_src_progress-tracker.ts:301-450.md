# 5e8c73c1:packages_cli_src_commands_scenario_src_progress-tracker.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/progress-tracker.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  /**
   * Marks a run as timed out.
   */
  timeoutRun(runId: string, timeoutMs: number): void {
    this.completeRun(runId, false, timeoutMs, `Timeout after ${timeoutMs / 1000} seconds`);

    const message = `Run ${runId} timed out after ${timeoutMs / 1000} seconds`;
    this.emitProgress(message, 'TIMEOUT', { runId, timeoutMs });
  }

  /**
   * Marks a combination as completed.
   */
  completeCombination(combinationId: string): void {
    const combination = this.combinations.get(combinationId);
    if (!combination) return;

    combination.completionTime = new Date();

    const combIndex = Array.from(this.combinations.keys()).indexOf(combinationId) + 1;
    const successRate = Math.round(combination.successRate * 100);
    const avgDuration = this.formatDuration(combination.averageDuration);

    const message = `Combination ${combIndex}/${this.config.totalCombinations} completed (${successRate}% success rate, avg: ${avgDuration})`;
    this.emitProgress(message, 'COMBINATION_COMPLETED', combination);

    // Notify combination completion callback
    if (this.config.onCombinationComplete) {
      this.config.onCombinationComplete(combination);
    }
  }

  /**
   * Reports a resource warning.
   */
  reportResourceWarning(resource: string, usage: number, message: string): void {
    const warningMessage = `Resource warning: ${resource} at ${usage}% - ${message}`;
    this.emitProgress(warningMessage, 'RESOURCE_WARNING', { resource, usage, message });
  }

  /**
   * Gets overall progress information.
   */
  getOverallProgress(): MatrixProgress {
    const completedRuns = Array.from(this.runs.values()).filter((r) => r.completionTime).length;
    const totalRuns = this.config.totalCombinations * this.config.runsPerCombination;
    const failedRuns = Array.from(this.runs.values()).filter((r) => r.success === false).length;
    const successfulRuns = Array.from(this.runs.values()).filter((r) => r.success === true).length;
    const completedCombinations = Array.from(this.combinations.values()).filter(
      (c) => c.completionTime
    ).length;

    const averageRunDuration =
      this.runDurations.length > 0
        ? this.runDurations.reduce((sum, duration) => sum + duration, 0) / this.runDurations.length
        : 0;

    const remainingRuns = totalRuns - completedRuns;
    const estimatedTimeRemaining =
      remainingRuns > 0 && averageRunDuration > 0 ? remainingRuns * averageRunDuration : null;

    const estimatedCompletionTime = estimatedTimeRemaining
      ? new Date(Date.now() + estimatedTimeRemaining)
      : null;

    return {
      totalCombinations: this.config.totalCombinations,
      totalRuns,
      completedCombinations,
      completedRuns,
      failedRuns,
      successfulRuns,
      currentCombination: this.currentCombinationIndex,
      overallProgress: totalRuns > 0 ? completedRuns / totalRuns : 0,
      averageRunDuration,
      estimatedTimeRemaining,
      startTime: this.startTime,
      estimatedCompletionTime,
    };
  }

  /**
   * Gets progress information for a specific combination.
   */
  getCombinationProgress(combinationId: string): CombinationProgress | undefined {
    return this.combinations.get(combinationId);
  }

  /**
   * Exports all progress data for analysis or reporting.
   */
  exportProgressData(): {
    overallProgress: MatrixProgress;
    combinations: Map<string, CombinationProgress>;
    runs: Map<string, RunProgress>;
    startTime: Date;
    statistics: {
      averageRunDuration: number;
      successRate: number;
      failureRate: number;
      totalDuration: number;
    };
  } {
    const overall = this.getOverallProgress();
    const totalDuration = Date.now() - this.startTime.getTime();

    return {
      overallProgress: overall,
      combinations: this.combinations,
      runs: this.runs,
      startTime: this.startTime,
      statistics: {
        averageRunDuration: overall.averageRunDuration,
        successRate: overall.completedRuns > 0 ? overall.successfulRuns / overall.completedRuns : 0,
        failureRate: overall.completedRuns > 0 ? overall.failedRuns / overall.completedRuns : 0,
        totalDuration,
      },
    };
  }

  /**
   * Emits ETA update based on current progress.
   */
  private emitETAUpdate(): void {
    const progress = this.getOverallProgress();

    if (progress.estimatedTimeRemaining) {
      const eta = this.formatDuration(progress.estimatedTimeRemaining);
      const completionTime = progress.estimatedCompletionTime?.toLocaleTimeString() || 'unknown';

      const message = `ETA: ${eta} (completion: ${completionTime})`;
      this.emitProgress(message, 'PROGRESS_UPDATE', {
        estimatedTimeRemaining: progress.estimatedTimeRemaining,
        estimatedCompletionTime: progress.estimatedCompletionTime,
      });
    }
  }

  /**
   * Emits a progress message to the callback.
   */
  private emitProgress(message: string, eventType: ProgressEventType, data?: unknown): void {
    if (this.config.onProgress) {
      this.config.onProgress(message, eventType, data);
    }
  }

  /**
   * Formats a duration in milliseconds to human-readable format.
```