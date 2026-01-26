# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-runner.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-runner.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Matrix Runner Implementation
 *
 * This module implements the core logic for matrix test execution,
 * including combination generation, execution planning, and result collection.
 */

import { MatrixConfig } from './matrix-schema';
import { Scenario } from './schema';
import {
  MatrixCombination,
  MatrixConfigRuntime,
  MatrixAxisRuntime,
  MatrixExecutionContext,
} from './matrix-types';

/**
 * Generates all parameter combinations from a matrix configuration.
 *
 * This is the main function required by ticket #5779. It takes a validated
 * matrix configuration and generates a Cartesian product of all parameter
 * variations, returning an array of MatrixCombination objects.
 *
 * @param config - The validated matrix configuration
 * @returns Array of MatrixCombination objects, each representing a unique set of parameter overrides
 *
 * @example
 * ```typescript
 * const config = {
 *   name: "Test Matrix",
 *   base_scenario: "test.scenario.yaml",
 *   runs_per_combination: 1,
 *   matrix: [
 *     { parameter: "character.llm.model", values: ["gpt-4", "gpt-3.5"] },
 *     { parameter: "run[0].input", values: ["Hello", "Hi"] }
 *   ]
 * };
 *
 * const combinations = generateMatrixCombinations(config);
 * // Returns 4 combinations: all combinations of 2 models × 2 inputs
 * ```
 */
export function generateMatrixCombinations(config: MatrixConfig): MatrixCombination[] {
  // Convert basic config to runtime config for processing
  const runtimeConfig = createRuntimeConfig(config);

  // Generate the Cartesian product of all parameter values
  const combinations = generateCartesianProduct(runtimeConfig.matrix);

  // Convert to MatrixCombination objects with proper metadata
  return combinations.map((parameterSet, index) => {
    const id = generateCombinationId(parameterSet, index);

    return {
      id,
      parameters: parameterSet,
      metadata: {
        combinationIndex: index,
        totalCombinations: combinations.length,
        // runIndex will be set during execution
      },
    };
  });
}

/**
 * Creates a runtime configuration from a basic matrix configuration.
 * Adds computed values and metadata needed for execution.
 *
 * @param config - Basic matrix configuration
 * @returns Runtime configuration with additional metadata
 */
export function createRuntimeConfig(config: MatrixConfig): MatrixConfigRuntime {
  // Calculate total combinations
  const totalCombinations = config.matrix.reduce((total, axis) => total * axis.values.length, 1);
  const totalRuns = totalCombinations * config.runs_per_combination;

  // Create runtime axes with metadata
  const runtimeMatrix: MatrixAxisRuntime[] = config.matrix.map((axis, index) => ({
    parameter: axis.parameter,
    values: axis.values,
    metadata: {
      axisIndex: index,
      valueCount: axis.values.length,
    },
  }));

  return {
    name: config.name,
    description: config.description,
    base_scenario: config.base_scenario,
    runs_per_combination: config.runs_per_combination,
    matrix: runtimeMatrix,
    computed: {
      totalCombinations,
      totalRuns,
      createdAt: new Date(),
    },
  };
}

/**
 * Generates the Cartesian product of matrix axes values.
 *
 * @param axes - Array of matrix axes with their values
 * @returns Array of parameter sets, each representing one combination
 */
function generateCartesianProduct(
  axes: MatrixAxisRuntime[]
): Array<Record<string, string | number | boolean | null | Record<string, unknown> | unknown[]>> {
  if (axes.length === 0) {
    return [];
  }

  if (axes.length === 1) {
    return axes[0].values.map((value) => ({
      [axes[0].parameter]: value,
    }));
  }

  // Recursive Cartesian product generation
  const [firstAxis, ...remainingAxes] = axes;
  const remainingProduct = generateCartesianProduct(remainingAxes);

  const result: Array<
    Record<string, string | number | boolean | null | Record<string, unknown> | unknown[]>
  > = [];

  for (const value of firstAxis.values) {
    for (const combination of remainingProduct) {
      result.push({
        [firstAxis.parameter]: value,
        ...combination,
      });
    }
  }

  return result;
}

/**
 * Generates a unique identifier for a parameter combination.
 *
 * @param parameters - The parameter set for this combination
 * @param index - The index of this combination in the matrix
 * @returns A unique string identifier
 */
function generateCombinationId(
  parameters: Record<
    string,
```