# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-schema.ts:151-278

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-schema.ts:151-278
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 *
 * @example
 * ```typescript
 * const config = {
 *   name: "Test",
 *   base_scenario: "test.yaml",
 *   matrix: [
 *     { parameter: "model", values: ["gpt-4", "claude-3"] },      // 2 values
 *     { parameter: "temperature", values: [0.1, 0.5, 0.9] }      // 3 values
 *   ]
 * };
 *
 * const total = calculateTotalCombinations(config); // Returns 6 (2 * 3)
 * ```
 */
export function calculateTotalCombinations(config: MatrixConfig): number {
  return config.matrix.reduce((total, axis) => total * axis.values.length, 1);
}

/**
 * Calculates the total number of test runs that will be executed.
 * This is the total combinations multiplied by runs_per_combination.
 *
 * @param config - A validated matrix configuration
 * @returns The total number of test runs that will be executed
 */
export function calculateTotalRuns(config: MatrixConfig): number {
  return calculateTotalCombinations(config) * config.runs_per_combination;
}

/**
 * Generates all possible parameter combinations from a matrix configuration.
 * Each combination is represented as a map of parameter paths to values.
 *
 * @param config - A validated matrix configuration
 * @returns An array of parameter combination objects
 *
 * @example
 * ```typescript
 * const config = {
 *   name: "Test",
 *   base_scenario: "test.yaml",
 *   matrix: [
 *     { parameter: "model", values: ["gpt-4", "claude-3"] },
 *     { parameter: "temp", values: [0.1, 0.5] }
 *   ]
 * };
 *
 * const combinations = generateParameterCombinations(config);
 * // Returns:
 * // [
 * //   { "model": "gpt-4", "temp": 0.1 },
 * //   { "model": "gpt-4", "temp": 0.5 },
 * //   { "model": "claude-3", "temp": 0.1 },
 * //   { "model": "claude-3", "temp": 0.5 }
 * // ]
 * ```
 */
export function generateParameterCombinations(
  config: MatrixConfig
): Record<string, string | number | boolean | null | Record<string, unknown> | unknown[]>[] {
  if (config.matrix.length === 0) {
    return [{}];
  }

  const combinations: Record<
    string,
    string | number | boolean | null | Record<string, unknown> | unknown[]
  >[] = [];

  function generateCombos(
    axisIndex: number,
    currentCombo: Record<
      string,
      string | number | boolean | null | Record<string, unknown> | unknown[]
    >
  ): void {
    if (axisIndex >= config.matrix.length) {
      combinations.push({ ...currentCombo });
      return;
    }

    const axis = config.matrix[axisIndex];
    for (const value of axis.values) {
      currentCombo[axis.parameter] = value;
      generateCombos(axisIndex + 1, currentCombo);
    }
  }

  generateCombos(0, {});
  return combinations;
}

/**
 * Validates that a parameter path is well-formed.
 * This is a basic validation that checks for obvious syntax errors.
 *
 * @param parameterPath - The parameter path to validate
 * @returns True if the path appears to be well-formed
 *
 * @example
 * ```typescript
 * isValidParameterPath("character.llm.model")        // true
 * isValidParameterPath("run[0].input")               // true
 * isValidParameterPath("setup.mocks[0].response")    // true
 * isValidParameterPath("")                           // false
 * isValidParameterPath("invalid..path")              // false
 * ```
 */
export function isValidParameterPath(parameterPath: string): boolean {
  if (!parameterPath || parameterPath.length === 0) {
    return false;
  }

  // Check for consecutive dots
  if (parameterPath.includes('..')) {
    return false;
  }

  // Check for leading or trailing dots
  if (parameterPath.startsWith('.') || parameterPath.endsWith('.')) {
    return false;
  }

  // Basic pattern check for valid identifiers and array notation
  const validPattern = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*|\[\d+\])*$/;
  return validPattern.test(parameterPath);
}
```