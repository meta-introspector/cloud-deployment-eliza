# 5e8c73c1:packages_cli_src_commands_scenario_src_parameter-override.ts:451-551

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/parameter-override.ts:451-551
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // Validate that the path exists in the base scenario
    // For more specific error messages, check manually
    try {
      const parsedPath = parseParameterPath(override.path);
      let current = modifiedScenario;

      for (let i = 0; i < parsedPath.segments.length; i++) {
        const segment = parsedPath.segments[i];

        if (typeof segment === 'number') {
          // Array index
          if (!Array.isArray(current)) {
            throw new Error(`Expected array but found ${typeof current} at path: ${override.path}`);
          }
          if (segment >= current.length || segment < 0) {
            throw new Error(`Array index out of bounds: ${segment} in path: ${override.path}`);
          }
          current = current[segment] as Record<string, unknown>;
        } else {
          // Object property
          if (!current || typeof current !== 'object' || !(segment in current)) {
            throw new Error(`Invalid parameter path: ${override.path}`);
          }
          current = (current as Record<string, unknown>)[segment] as Record<string, unknown>;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Invalid parameter path: ${override.path}`);
    }

    try {
      // Apply the override
      setValueAtPath(modifiedScenario, override.path, override.value);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to apply override for path '${override.path}': ${error.message}`);
      }
      throw error;
    }
  }

  return modifiedScenario;
}

/**
 * Converts a parameter combinations object to ParameterOverride array.
 * This is a utility function for integrating with the matrix system.
 *
 * @param combination - Object mapping parameter paths to values
 * @returns Array of ParameterOverride objects
 *
 * @example
 * ```typescript
 * const combination = {
 *   "character.llm.model": "gpt-4",
 *   "run[0].input": "test input"
 * };
 *
 * const overrides = combinationToOverrides(combination);
 * // Returns: [
 * //   { path: "character.llm.model", value: "gpt-4" },
 * //   { path: "run[0].input", value: "test input" }
 * // ]
 * ```
 */
export function combinationToOverrides(combination: Record<string, unknown>): ParameterOverride[] {
  return Object.entries(combination).map(([path, value]) => ({
    path,
    value,
  }));
}

/**
 * Validates that all parameter paths in a matrix configuration are valid
 * for a given base scenario.
 *
 * @param baseScenario - The base scenario to validate against
 * @param matrixAxes - Array of matrix axes with parameter paths
 * @returns Validation result with any invalid paths
 */
export function validateMatrixParameterPaths(
  baseScenario: Record<string, unknown>,
  matrixAxes: Array<{ parameter: string; values: unknown[] }>
): { valid: boolean; invalidPaths: string[] } {
  const invalidPaths: string[] = [];

  for (const axis of matrixAxes) {
    const validation = validateParameterPath(baseScenario, axis.parameter);
    if (!validation.isValid) {
      invalidPaths.push(axis.parameter);
    }
  }

  return {
    valid: invalidPaths.length === 0,
    invalidPaths,
  };
}
```