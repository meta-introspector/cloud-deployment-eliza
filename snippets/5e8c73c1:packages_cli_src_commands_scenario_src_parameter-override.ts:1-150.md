# 5e8c73c1:packages_cli_src_commands_scenario_src_parameter-override.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/parameter-override.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Parameter Override System for Scenario Matrix Testing
 *
 * This module provides functionality to dynamically override parameters in scenario
 * configurations using dot-notation paths and array indexing.
 *
 * Core implementation for ticket #5780.
 */

import { parseParameterPath } from './path-parser';
import { deepClone } from './deep-clone';

// Re-export functions from modules for backward compatibility
export {
  parseParameterPath,
  isValidPathSyntax,
  normalizeParameterPath,
  ParameterPath,
} from './path-parser';
export { deepClone, hasCircularReference, deepCloneWithLimit } from './deep-clone';

/**
 * Represents a single parameter override.
 */
export interface ParameterOverride {
  /** Dot-notation path to the parameter (e.g., "character.llm.model" or "run[0].input") */
  path: string;
  /** The value to set at the specified path */
  value: unknown;
}

/**
 * Result of parameter path validation with detailed feedback.
 * Required by ticket #5780.
 */
export interface ValidationResult {
  /** Whether the path is valid and can be used for overrides */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Suggested correction for common mistakes */
  suggestion?: string;
  /** Whether the path exists in the target object */
  pathExists: boolean;
  /** Type of the value at the target path */
  targetType?: string;
}

/**
 * Details about a single parameter override operation.
 * Used for tracking and debugging override applications.
 */
export interface OverrideOperation {
  /** The dot-notation path that was modified */
  path: string;
  /** The new value that was set */
  value: unknown;
  /** The original value that was replaced (if any) */
  originalValue?: unknown;
  /** Whether this operation created new intermediate objects */
  wasCreated: boolean;
}

/**
 * Complete result of applying parameter overrides.
 * Includes the modified scenario and metadata about operations.
 */
export interface OverrideResult {
  /** The scenario object with overrides applied */
  scenario: Record<string, unknown>;
  /** Details about each override operation performed */
  operations: OverrideOperation[];
  /** Any warnings generated during override application */
  warnings: string[];
}

// ParameterPath interface is now imported from './path-parser'

// parseParameterPath function is now imported from './path-parser'

/**
 * Validates that a parameter path exists in the given object with detailed feedback.
 * This enhanced version returns ValidationResult as required by ticket #5780.
 *
 * @param obj - The object to validate against
 * @param path - The dot-notation path to validate
 * @returns ValidationResult with detailed information about the path
 *
 * @example
 * ```typescript
 * const scenario = { character: { llm: { model: "gpt-4" } } };
 * const result = validateParameterPath(scenario, "character.llm.model");
 * // result.isValid === true, result.targetType === "string"
 *
 * const invalid = validateParameterPath(scenario, "character.nonexistent");
 * // invalid.isValid === false, invalid.suggestion === "Available properties: llm"
 * ```
 */
export function validateParameterPath(obj: unknown, path: string): ValidationResult {
  if (!obj || typeof obj !== 'object') {
    return {
      isValid: false,
      error: 'Target object is null or not an object',
      pathExists: false,
      targetType: typeof obj,
    };
  }

  try {
    const parsedPath = parseParameterPath(path);
    let current: unknown = obj;
    let currentPath = '';

    for (let i = 0; i < parsedPath.segments.length; i++) {
      const segment = parsedPath.segments[i];

      if (typeof segment === 'number') {
        currentPath += `[${segment}]`;

        if (!Array.isArray(current)) {
          return {
            isValid: false,
            error: `Expected array at path '${currentPath}', but found ${typeof current}`,
            pathExists: false,
            targetType: typeof current,
          };
        }

        if (segment >= current.length || segment < 0) {
          return {
            isValid: false,
            error: `Array index ${segment} is out of bounds at path '${currentPath}' (array length: ${current.length})`,
            suggestion:
              segment >= current.length
                ? `Use index 0-${current.length - 1} or add more elements to the array`
                : 'Array indices must be non-negative',
            pathExists: false,
            targetType: 'array',
          };
        }

        current = current[segment];
      } else {
        currentPath += currentPath ? `.${segment}` : segment;

        if (!current || typeof current !== 'object') {
          return {
            isValid: false,
            error: `Expected object at path '${currentPath}', but found ${typeof current}`,
            pathExists: false,
```