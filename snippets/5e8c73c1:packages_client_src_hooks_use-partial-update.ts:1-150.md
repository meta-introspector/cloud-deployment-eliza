# 5e8c73c1:packages_client_src_hooks_use-partial-update.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-partial-update.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { useState, useCallback } from 'react';

/**
 * A custom hook for handling partial updates of objects with nested JSONb fields.
 * This hook ensures that updates to nested objects and arrays are properly
 * managed when sending updates to the server.
 *
 * @param initialValue The initial state object
 * @returns A tuple containing:
 *   - The current state object
 *   - A function to update a specific field (handles nested paths)
 *   - A function to add an item to an array field
 *   - A function to remove an item from an array field
 *   - A function to set the entire object
 *   - A function to reset to initial state
 */
export function usePartialUpdate<T extends object>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  /**
   * Updates a specific field in the object, handling nested paths
   *
   * @param path The path to the field to update (e.g., 'settings.voice.model')
   * @param newValue The new value for the field
   */
  const updateField = useCallback(<K>(path: string, newValue: K) => {
    setValue((prevValue) => {
      // Handle simple (non-nested) case
      if (!path.includes('.')) {
        return {
          ...prevValue,
          [path]: newValue,
        } as T;
      }

      // Handle nested paths
      const pathParts = path.split('.');
      const fieldToUpdate = pathParts[0];
      const remainingPath = pathParts.slice(1).join('.');

      // Handle arrays in path (e.g., 'style.all.0')
      const isArrayIndex = !isNaN(Number(pathParts[1]));

      if (isArrayIndex) {
        const arrayName = pathParts[0];
        const index = Number(pathParts[1]);
        // Ensure we're working with an array and handle it safely
        const currentValue = prevValue[arrayName as keyof T];
        const array = Array.isArray(currentValue) ? [...currentValue] : [];

        if (pathParts.length === 2) {
          // Direct array item update
          array[index] = newValue;
        } else {
          // Updating a property of an object in an array
          const deeperPath = pathParts.slice(2).join('.');
          array[index] = updateNestedObject(array[index], deeperPath, newValue);
        }

        return {
          ...prevValue,
          [arrayName]: array,
        } as T;
      }

      // Special case for settings.secrets path
      if (path.startsWith('settings.secrets.')) {
        const secretKey = path.split('.')[2];

        const currentSettings =
          (prevValue as Record<string, unknown> & { settings?: Record<string, unknown> })
            .settings || {};
        const currentSecrets = currentSettings.secrets || {};

        const newSecrets = {
          ...currentSecrets,
          [secretKey]: newValue,
        };

        return {
          ...prevValue,
          settings: {
            ...currentSettings,
            secrets: newSecrets,
          },
        } as T;
      }

      // Handle regular nested objects
      const result = {
        ...prevValue,
        [fieldToUpdate]: updateNestedObject(
          prevValue[fieldToUpdate as keyof T] as Record<string, unknown>,
          remainingPath,
          newValue
        ),
      } as T;

      return result;
    });
  }, []);

  /**
   * Helper function to update a nested object
   */
  const updateNestedObject = <K extends Record<string, unknown>, V>(
    obj: K,
    path: string,
    value: V
  ): K => {
    if (!path.includes('.')) {
      return {
        ...obj,
        [path]: value,
      } as K;
    }

    const [field, ...remainingPath] = path.split('.');
    const nextPath = remainingPath.join('.');

    return {
      ...obj,
      [field]: updateNestedObject((obj[field] as Record<string, unknown>) || {}, nextPath, value),
    } as K;
  };

  /**
   * Adds an item to an array field
   *
   * @param path Path to the array field
   * @param item Item to add
   */
  const addArrayItem = useCallback(<V>(path: string, item: V) => {
    setValue((prevValue) => {
      const pathParts = path.split('.');

      // Handle simple array field
      if (pathParts.length === 1) {
        const fieldName = pathParts[0];
        const fieldValue = prevValue[fieldName as keyof T];
        const currentArray = Array.isArray(fieldValue) ? [...(fieldValue as V[])] : [];

        return {
          ...prevValue,
          [fieldName]: [...currentArray, item],
        } as T;
      }

      // Handle nested array field
      const updatePath = path;
```