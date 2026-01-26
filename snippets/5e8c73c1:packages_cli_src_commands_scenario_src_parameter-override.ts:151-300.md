# 5e8c73c1:packages_cli_src_commands_scenario_src_parameter-override.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/parameter-override.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            targetType: typeof current,
          };
        }

        const currentObj = current as Record<string, unknown>;
        if (!(segment in currentObj)) {
          const availableProps = Object.keys(currentObj).slice(0, 5);
          const suggestion =
            availableProps.length > 0
              ? `Available properties: ${availableProps.join(', ')}${Object.keys(currentObj).length > 5 ? '...' : ''}`
              : 'Object has no properties';

          return {
            isValid: false,
            error: `Property '${segment}' does not exist at path '${currentPath}'`,
            suggestion,
            pathExists: false,
            targetType: 'object',
          };
        }

        current = currentObj[segment];
      }
    }

    return {
      isValid: true,
      pathExists: true,
      targetType: Array.isArray(current) ? 'array' : typeof current,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let suggestion = '';

    if (errorMessage.includes('bracket')) {
      suggestion = 'Use bracket notation for arrays: run[0].input instead of run.0.input';
    } else if (errorMessage.includes('invalid')) {
      suggestion = 'Check path syntax: use dots for objects and brackets for arrays';
    }

    return {
      isValid: false,
      error: `Invalid path format: ${errorMessage}`,
      suggestion,
      pathExists: false,
    };
  }
}

/**
 * Legacy function for backward compatibility.
 * Returns boolean like the original function.
 */
export function validateParameterPathLegacy(obj: unknown, path: string): boolean {
  const result = validateParameterPath(obj, path);
  return result.isValid;
}

/**
 * Gets the value at a specific parameter path in an object.
 *
 * @param obj - The object to read from
 * @param path - The dot-notation path
 * @returns The value at the path
 * @throws Error if the path doesn't exist
 */
export function getValueAtPath(obj: unknown, path: string): unknown {
  const parsedPath = parseParameterPath(path);
  let current: unknown = obj;

  for (let i = 0; i < parsedPath.segments.length; i++) {
    const segment = parsedPath.segments[i];

    if (typeof segment === 'number') {
      // Array index
      if (!Array.isArray(current)) {
        throw new Error(
          `Expected array at path segment, but found ${typeof current} in path: ${path}`
        );
      }
      if (segment >= current.length || segment < 0) {
        throw new Error(`Array index out of bounds: ${segment} in path: ${path}`);
      }
      current = current[segment];
    } else {
      // Object property
      if (!current || typeof current !== 'object') {
        throw new Error(
          `Expected object at path segment, but found ${typeof current} in path: ${path}`
        );
      }
      const currentObj = current as Record<string, unknown>;
      if (!(segment in currentObj)) {
        throw new Error(`Property '${segment}' not found in path: ${path}`);
      }
      current = currentObj[segment];
    }
  }

  return current;
}

/**
 * Sets a value at a specific parameter path in an object.
 * This function modifies the object in place.
 *
 * @param obj - The object to modify
 * @param path - The dot-notation path
 * @param value - The value to set
 * @throws Error if the path doesn't exist or is invalid
 */
export function setValueAtPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parsedPath = parseParameterPath(path);
  let current: Record<string, unknown> | unknown[] = obj;

  // Navigate to the parent of the target property
  for (let i = 0; i < parsedPath.segments.length - 1; i++) {
    const segment = parsedPath.segments[i];

    if (typeof segment === 'number') {
      // Array index
      if (!Array.isArray(current)) {
        throw new Error(
          `Expected array at path segment, but found ${typeof current} in path: ${path}`
        );
      }
      if (segment >= current.length || segment < 0) {
        throw new Error(`Array index out of bounds: ${segment} in path: ${path}`);
      }
      current = current[segment] as Record<string, unknown> | unknown[];
    } else {
      // Object property
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        throw new Error(
          `Expected object at path segment, but found ${typeof current} in path: ${path}`
        );
      }
      const currentObj = current as Record<string, unknown>;
      if (!(segment in currentObj)) {
        throw new Error(`Property '${segment}' not found in path: ${path}`);
      }
      current = currentObj[segment] as Record<string, unknown> | unknown[];
    }
  }

  // Set the final value
  const finalSegment = parsedPath.segments[parsedPath.segments.length - 1];

  if (typeof finalSegment === 'number') {
    // Array index
```