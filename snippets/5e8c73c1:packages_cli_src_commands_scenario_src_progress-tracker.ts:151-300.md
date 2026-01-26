# 5e8c73c1:packages_cli_src_commands_scenario_src_progress-tracker.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/progress-tracker.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      ...config,
    };
    this.startTime = new Date();
  }

  /**
   * Starts tracking a new run.
   */
  startRun(runId: string, combinationId: string, parameters: Record<string, unknown>): void {
    // Initialize combination if not exists
    if (!this.combinations.has(combinationId)) {
      this.combinations.set(combinationId, {
        combinationId,
        parameters,
        totalRuns: this.config.runsPerCombination,
        completedRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        successRate: 0,
        averageDuration: 0,
        startTime: new Date(),
        completionTime: null,
      });
    }

    // Create run progress entry
    const runProgress: RunProgress = {
      runId,
      combinationId,
      parameters,
      startTime: new Date(),
      completionTime: null,
      progress: 0,
      status: 'Starting...',
      success: null,
      error: null,
      duration: 0,
    };

    this.runs.set(runId, runProgress);

    // Calculate run position
    const completedRuns = this.getOverallProgress().completedRuns;
    const totalRuns = this.config.totalCombinations * this.config.runsPerCombination;
    const runNumber = completedRuns + 1;

    // Get combination info for the message
    const combination = this.combinations.get(combinationId)!;
    const combIndex = Array.from(this.combinations.keys()).indexOf(combinationId) + 1;
    const runInCombination = combination.completedRuns + 1;

    // Format parameter information
    let parameterInfo = '';
    if (this.config.showParameters && Object.keys(parameters).length > 0) {
      const paramPairs = Object.entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      parameterInfo = ` (${paramPairs})`;
    }

    const message = `Executing run ${runNumber} of ${totalRuns} (Combination ${combIndex}/${this.config.totalCombinations}, Run ${runInCombination}/${this.config.runsPerCombination})${parameterInfo}`;

    this.emitProgress(message, 'RUN_STARTED', {
      runId,
      combinationId,
      parameters,
      runNumber,
      totalRuns,
    });
  }

  /**
   * Updates progress for a currently running scenario.
   */
  updateRunProgress(runId: string, progress: number, status: string): void {
    const run = this.runs.get(runId);
    if (!run) return;

    run.progress = progress;
    run.status = status;

    const percentage = Math.round(progress * 100);
    const message = `Run ${runId}: ${percentage}% - ${status}`;

    this.emitProgress(message, 'PROGRESS_UPDATE', {
      runId,
      progress,
      status,
    });
  }

  /**
   * Marks a run as completed successfully.
   */
  completeRun(runId: string, success: boolean, duration: number, error?: string): void {
    const run = this.runs.get(runId);
    if (!run) return;

    run.completionTime = new Date();
    run.success = success;
    run.duration = duration;
    run.error = error || null;
    run.progress = 1;

    // Update combination statistics
    const combination = this.combinations.get(run.combinationId)!;
    combination.completedRuns++;

    if (success) {
      combination.successfulRuns++;
    } else {
      combination.failedRuns++;
    }

    combination.successRate = combination.successfulRuns / combination.completedRuns;

    // Update duration tracking
    this.runDurations.push(duration);
    if (this.runDurations.length > 100) {
      this.runDurations = this.runDurations.slice(-100); // Keep last 100 for rolling average
    }

    // Calculate average duration for combination
    const combinationRuns = Array.from(this.runs.values()).filter(
      (r) => r.combinationId === run.combinationId && r.duration > 0
    );
    combination.averageDuration =
      combinationRuns.reduce((sum, r) => sum + r.duration, 0) / combinationRuns.length;

    // Emit completion message
    const completedRuns = this.getOverallProgress().completedRuns;

    if (success) {
      const message = `Run ${completedRuns} completed successfully in ${this.formatDuration(duration)}`;
      this.emitProgress(message, 'RUN_COMPLETED', { runId, duration, success: true });
    } else {
      const message = `Run ${completedRuns} failed: ${error || 'Unknown error'}`;
      this.emitProgress(message, 'RUN_FAILED', { runId, duration, success: false, error });
    }

    // Emit ETA update if we have enough data
    if (this.config.calculateETA && this.runDurations.length >= 3) {
      this.emitETAUpdate();
    }

    // Check if combination is complete
    if (combination.completedRuns === combination.totalRuns) {
      this.completeCombination(run.combinationId);
    }
  }
```