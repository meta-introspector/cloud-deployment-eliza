# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-runner.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-runner.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    string | number | boolean | null | Record<string, unknown> | unknown[]
  >,
  index: number
): string {
  // Create a stable hash of the parameters for uniqueness
  const parameterKeys = Object.keys(parameters).sort();
  const parameterHash = parameterKeys
    .map((key) => `${key}=${JSON.stringify(parameters[key])}`)
    .join('&');

  // Use index as primary identifier with parameter hash for verification
  return `combo-${index.toString().padStart(3, '0')}-${hashString(parameterHash).slice(0, 8)}`;
}

/**
 * Simple string hashing function for generating combination IDs.
 *
 * @param str - String to hash
 * @returns Hexadecimal hash string
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Creates an execution context for a matrix run.
 *
 * @param config - Matrix configuration
 * @param combinations - Generated combinations to execute
 * @param settings - Execution settings
 * @returns Execution context for tracking matrix execution
 */
export function createExecutionContext(
  config: MatrixConfig,
  combinations: MatrixCombination[],
  settings: {
    parallelism: number;
    dryRun: boolean;
    filter?: string;
    verbose: boolean;
  }
): MatrixExecutionContext {
  const runtimeConfig = createRuntimeConfig(config);

  return {
    config: runtimeConfig,
    combinations,
    settings,
    state: {
      phase: 'initializing',
      completedCombinations: 0,
      failedCombinations: 0,
    },
  };
}

/**
 * Applies filter to combinations based on a pattern.
 *
 * @param combinations - All combinations
 * @param filter - Filter pattern to match against
 * @returns Filtered combinations
 */
export function filterCombinations(
  combinations: MatrixCombination[],
  filter: string
): MatrixCombination[] {
  return combinations.filter((combination) => {
    // Simple string matching - can be enhanced with regex or more sophisticated filtering
    const combinationStr = JSON.stringify(combination.parameters);
    return combinationStr.toLowerCase().includes(filter.toLowerCase());
  });
}

/**
 * Validates that all combinations have valid parameter paths.
 * This is a placeholder for integration with the parameter override system.
 *
 * @param combinations - Combinations to validate
 * @param baseScenario - Base scenario object to validate against
 * @returns Validation result with any invalid combinations
 */
export function validateCombinations(
  combinations: MatrixCombination[],
  _baseScenario: Scenario
): { valid: boolean; invalidCombinations: string[]; errors: string[] } {
  // This will be fully implemented when integrated with the parameter override system
  // For now, we'll do basic validation

  const invalidCombinations: string[] = [];
  const errors: string[] = [];

  for (const combination of combinations) {
    // Basic validation - check that parameters object is valid
    if (!combination.parameters || typeof combination.parameters !== 'object') {
      invalidCombinations.push(combination.id);
      errors.push(`Combination ${combination.id} has invalid parameters object`);
      continue;
    }

    // Check that all parameter values are serializable
    try {
      JSON.stringify(combination.parameters);
    } catch (error) {
      invalidCombinations.push(combination.id);
      errors.push(`Combination ${combination.id} has non-serializable parameter values`);
    }
  }

  return {
    valid: invalidCombinations.length === 0,
    invalidCombinations,
    errors,
  };
}

/**
 * Calculates execution statistics for planning purposes.
 *
 * @param combinations - Combinations to execute
 * @param runsPerCombination - Number of runs per combination
 * @returns Execution statistics
 */
export function calculateExecutionStats(
  combinations: MatrixCombination[],
  runsPerCombination: number
): {
  totalCombinations: number;
  totalRuns: number;
  estimatedDuration: {
    optimistic: number; // seconds
    realistic: number; // seconds
    pessimistic: number; // seconds
  };
} {
  const totalCombinations = combinations.length;
  const totalRuns = totalCombinations * runsPerCombination;

  // Rough estimates based on typical scenario execution times
  const averageScenarioTime = 30; // seconds per scenario run
  const setupOverhead = 5; // seconds per combination for setup

  const optimistic = totalRuns * averageScenarioTime * 0.5 + totalCombinations * setupOverhead;
  const realistic = totalRuns * averageScenarioTime + totalCombinations * setupOverhead;
```