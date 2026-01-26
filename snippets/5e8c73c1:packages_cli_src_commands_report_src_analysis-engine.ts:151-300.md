# 5e8c73c1:packages_cli_src_commands_report_src_analysis-engine.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/src/analysis-engine.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    return successRates;
  }

  /**
   * Group results by each matrix parameter and calculate statistics for each group
   */
  private groupResultsByParameters(
    runs: ScenarioRunResult[],
    matrixConfig: MatrixConfig
  ): Record<string, Record<string, ReportSummaryStats>> {
    const groupedResults: Record<string, Record<string, ReportSummaryStats>> = {};

    if (runs.length === 0) {
      return groupedResults;
    }

    // Extract parameter names from matrix config AND infer additional ones from runs
    const matrixParameters = new Set(matrixConfig.matrix.map((axis) => axis.parameter));

    // Always collect all parameters from run data to ensure we don't miss any
    const allParameters = new Set<string>();
    runs.forEach((run) => {
      this.collectAllParameterPaths(run.parameters, '', allParameters);
    });

    // Combine matrix parameters with inferred parameters
    const combinedParameters = new Set([...matrixParameters, ...allParameters]);
    const parameterNames = Array.from(combinedParameters);

    // Group runs by each parameter
    parameterNames.forEach((parameterName) => {
      groupedResults[parameterName] = {};

      // Group runs by parameter value
      const runGroups: Record<string, ScenarioRunResult[]> = {};
      runs.forEach((run) => {
        const parameterValue = this.getParameterValue(run.parameters, parameterName);
        const parameterValueKey = this.serializeParameterValue(parameterValue);

        if (!runGroups[parameterValueKey]) {
          runGroups[parameterValueKey] = [];
        }
        runGroups[parameterValueKey].push(run);
      });

      // Calculate statistics for each group
      Object.entries(runGroups).forEach(([valueKey, groupRuns]) => {
        groupedResults[parameterName][valueKey] = this.calculateSummaryStats(groupRuns);
      });
    });

    return groupedResults;
  }

  /**
   * Recursively collect all parameter paths from a parameters object
   */
  private collectAllParameterPaths(
    obj: unknown,
    currentPath: string,
    paths: Set<string>,
    maxDepth = 3,
    currentDepth = 0
  ): void {
    if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      const paramPath = currentPath ? `${currentPath}.${key}` : key;

      // Always add the current path as a potential parameter
      paths.add(paramPath);

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Also recurse into nested objects to find deeper paths
        this.collectAllParameterPaths(value, paramPath, paths, maxDepth, currentDepth + 1);
      }
    });
  }

  /**
   * Extract parameter value from nested or flat parameters object
   */
  private getParameterValue(parameters: Record<string, unknown>, parameterPath: string): unknown {
    // First try the flat key (exact match)
    if (parameterPath in parameters) {
      return parameters[parameterPath];
    }

    // If not found, try navigating nested object structure
    const pathParts = parameterPath.split('.');
    let value = parameters;

    let currentValue: unknown = value;
    for (const part of pathParts) {
      if (
        currentValue &&
        typeof currentValue === 'object' &&
        currentValue !== null &&
        !Array.isArray(currentValue) &&
        part in currentValue
      ) {
        const valueObj = currentValue as Record<string, unknown>;
        currentValue = valueObj[part];
      } else {
        return undefined;
      }
    }
    return currentValue;

    return value;
  }

  /**
   * Convert parameter values to strings for consistent grouping
   */
  private serializeParameterValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'undefined';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  /**
   * Analyze trajectory patterns to find most common sequences
   */
  private analyzeTrajectoryPatterns(runs: ScenarioRunResult[]): CommonTrajectory[] {
    const trajectoryPatterns: Map<
      string,
      {
        count: number;
        totalDuration: number;
        sequence: string[];
      }
    > = new Map();

    // Extract trajectory sequences and durations
    runs.forEach((run) => {
      if (run.trajectory && run.trajectory.length > 0) {
        const sequence = run.trajectory.map((step) => step.type);
        const sequenceKey = sequence.join(',');
        const duration = run.metrics.execution_time_seconds;

        if (trajectoryPatterns.has(sequenceKey)) {
          const pattern = trajectoryPatterns.get(sequenceKey)!;
          pattern.count++;
```