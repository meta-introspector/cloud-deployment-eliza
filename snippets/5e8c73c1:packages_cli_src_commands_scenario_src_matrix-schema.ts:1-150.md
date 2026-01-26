# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-schema.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-schema.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { z } from 'zod';

/**
 * Schema for defining a single axis of variation in a scenario matrix.
 * Each axis specifies a parameter path and the values to test for that parameter.
 */
const MatrixAxisSchema = z.object({
  /**
   * The target field in the base scenario to override, specified using dot-notation.
   * Examples: "character.llm.model", "run[0].input", "setup.mocks[0].response.success"
   */
  parameter: z.string().min(1, 'Parameter path cannot be empty'),

  /**
   * A list of values to be substituted for the specified parameter.
   * Values can be of any type (string, number, boolean, object, array, null).
   */
  values: z
    .array(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
        z.record(z.string(), z.unknown()),
        z.array(z.unknown()),
      ])
    )
    .min(1, 'Values array must contain at least 1 element'),
});

/**
 * Schema for the complete scenario matrix configuration.
 * This defines how to run a base scenario across multiple parameter combinations.
 */
export const MatrixConfigSchema = z.object({
  /**
   * A human-readable name for the test matrix.
   * Example: "GitHub Issue Prompt Robustness"
   */
  name: z.string().min(1, 'Name cannot be empty'),

  /**
   * A longer description of the test's goals (optional).
   */
  description: z.string().optional(),

  /**
   * The file path (relative to the project root) to the base .scenario.yaml file
   * to be used in each run.
   */
  base_scenario: z.string().min(1, 'Base scenario path cannot be empty'),

  /**
   * The number of times to execute each unique combination of parameters
   * to check for consistency. Defaults to 1.
   */
  runs_per_combination: z
    .number()
    .int()
    .min(1, 'Runs per combination must be greater than or equal to 1')
    .default(1),

  /**
   * An array of objects defining the axes of variation.
   * Each axis specifies a parameter to vary and the values to test.
   */
  matrix: z.array(MatrixAxisSchema).min(1, 'Matrix must contain at least 1 axis'),
});

/**
 * TypeScript interface for a matrix axis, inferred from the Zod schema.
 */
export type MatrixAxis = z.infer<typeof MatrixAxisSchema>;

/**
 * TypeScript interface for the complete matrix configuration, inferred from the Zod schema.
 */
export type MatrixConfig = z.infer<typeof MatrixConfigSchema>;

/**
 * Validation result type for successful validation.
 */
interface ValidationSuccess {
  success: true;
  data: MatrixConfig;
}

/**
 * Validation result type for failed validation.
 */
interface ValidationError {
  success: false;
  error: z.ZodError<MatrixConfig>;
}

/**
 * Union type for validation results.
 */
export type ValidationResult = ValidationSuccess | ValidationError;

/**
 * Validates a matrix configuration object against the schema.
 *
 * @param config - The configuration object to validate (typically parsed from YAML)
 * @returns ValidationResult - Contains either the validated data or detailed error information
 *
 * @example
 * ```typescript
 * const config = {
 *   name: "Test Matrix",
 *   base_scenario: "test.scenario.yaml",
 *   matrix: [
 *     {
 *       parameter: "character.llm.model",
 *       values: ["gpt-4", "claude-3"]
 *     }
 *   ]
 * };
 *
 * const result = validateMatrixConfig(config);
 * if (result.success) {
 *   console.log("Valid configuration:", result.data);
 * } else {
 *   console.error("Validation errors:", result.error.format());
 * }
 * ```
 */
export function validateMatrixConfig(config: unknown): ValidationResult {
  const result = MatrixConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: result.error,
    };
  }
}

/**
 * Calculates the total number of parameter combinations in a matrix configuration.
 * This is the Cartesian product of all axis values.
 *
 * @param config - A validated matrix configuration
 * @returns The total number of combinations that will be generated
```