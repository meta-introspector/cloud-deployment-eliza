# 5e8c73c1:packages_cli_src_commands_scenario_src_parameter-override.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/parameter-override.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    if (!Array.isArray(current)) {
      throw new Error(
        `Expected array for final segment, but found ${typeof current} in path: ${path}`
      );
    }
    if (finalSegment >= current.length || finalSegment < 0) {
      throw new Error(`Array index out of bounds: ${finalSegment} in path: ${path}`);
    }
    current[finalSegment] = value;
  } else {
    // Object property
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      throw new Error(
        `Expected object for final segment, but found ${typeof current} in path: ${path}`
      );
    }
    const currentObj = current as Record<string, unknown>;
    currentObj[finalSegment] = value;
  }
}

// deepClone function is now imported from './deep-clone'

/**
 * Applies a single parameter override to a scenario object.
 * This is the core function required by ticket #5780.
 *
 * @param scenario - The scenario object to modify
 * @param path - Dot-notation path to the parameter (e.g., "character.llm.model")
 * @param value - The value to set at the specified path
 * @returns A deep clone of the scenario with the override applied
 * @throws Error if the path is invalid or cannot be applied
 *
 * @example
 * ```typescript
 * const scenario = { character: { llm: { model: "gpt-4" } } };
 * const result = applyParameterOverride(scenario, "character.llm.model", "gpt-3.5-turbo");
 * // result.character.llm.model === "gpt-3.5-turbo"
 * // original scenario is unchanged
 * ```
 */
export function applyParameterOverride(
  scenario: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  // Create a deep clone to avoid mutating the original
  const clonedScenario = deepClone(scenario);

  // Apply the single override
  setValueAtPath(clonedScenario, path, value);

  return clonedScenario;
}

/**
 * Applies a set of parameter overrides from a Record<string, unknown> format.
 * This is the batch function required by ticket #5780.
 *
 * @param baseScenario - The base scenario object to modify
 * @param overrides - Record mapping parameter paths to values
 * @returns A deep clone of the scenario with all overrides applied
 * @throws Error if any path is invalid or cannot be applied
 *
 * @example
 * ```typescript
 * const overrides = {
 *   "character.llm.model": "gpt-3.5-turbo",
 *   "run[0].input": "Hello world"
 * };
 * const result = applyMatrixOverrides(baseScenario, overrides);
 * ```
 */
export function applyMatrixOverrides(
  baseScenario: Record<string, unknown>,
  overrides: Record<string, unknown>
): Record<string, unknown> {
  // Convert Record to ParameterOverride array
  const parameterOverrides: ParameterOverride[] = Object.entries(overrides).map(
    ([path, value]) => ({
      path,
      value,
    })
  );

  // Use the existing batch function
  return applyParameterOverrides(baseScenario, parameterOverrides);
}

/**
 * Applies parameter overrides to a base scenario object.
 *
 * This is the main function for the parameter override system. It takes a base
 * scenario object and an array of parameter overrides, and returns a new scenario
 * object with the overrides applied.
 *
 * The function:
 * 1. Creates a deep copy of the base scenario to ensure immutability
 * 2. Validates each override path exists in the scenario
 * 3. Applies each override in order
 * 4. Returns the modified scenario
 *
 * @param baseScenario - The base scenario object to modify
 * @param overrides - Array of parameter overrides to apply
 * @returns A new scenario object with overrides applied
 * @throws Error if any override path is invalid
 *
 * @example
 * ```typescript
 * const baseScenario = {
 *   character: { llm: { model: "gpt-4" } },
 *   run: [{ input: "original" }]
 * };
 *
 * const overrides = [
 *   { path: "character.llm.model", value: "gpt-3.5-turbo" },
 *   { path: "run[0].input", value: "modified" }
 * ];
 *
 * const result = applyParameterOverrides(baseScenario, overrides);
 * // result.character.llm.model === "gpt-3.5-turbo"
 * // result.run[0].input === "modified"
 * // baseScenario is unchanged
 * ```
 */
export function applyParameterOverrides(
  baseScenario: Record<string, unknown>,
  overrides: ParameterOverride[]
): Record<string, unknown> {
  if (!baseScenario || typeof baseScenario !== 'object') {
    throw new Error('Base scenario must be a valid object');
  }

  if (!Array.isArray(overrides)) {
    throw new Error('Overrides must be an array');
  }

  // Create a deep copy to ensure immutability
  const modifiedScenario = deepClone(baseScenario);

  // Apply each override
  for (const override of overrides) {
    if (!override || typeof override !== 'object') {
      throw new Error('Each override must be an object with path and value properties');
    }

    if (!override.path || typeof override.path !== 'string') {
      throw new Error('Override path must be a non-empty string');
    }

```