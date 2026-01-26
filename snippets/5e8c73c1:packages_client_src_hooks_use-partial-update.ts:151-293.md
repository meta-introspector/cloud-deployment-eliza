# 5e8c73c1:packages_client_src_hooks_use-partial-update.ts:151-293

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-partial-update.ts:151-293
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const currentValue = getNestedValue(prevValue as Record<string, unknown>, updatePath);
      const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];

      return setNestedValue(prevValue, updatePath, [...currentArray, item]);
    });
  }, []);

  /**
   * Removes an item from an array field
   *
   * @param path Path to the array field
   * @param index Index of the item to remove
   */
  const removeArrayItem = useCallback((path: string, index: number) => {
    setValue((prevValue) => {
      const pathParts = path.split('.');

      // Handle simple array field
      if (pathParts.length === 1) {
        const fieldName = pathParts[0];
        const fieldValue = prevValue[fieldName as keyof T];
        const currentArray = Array.isArray(fieldValue) ? [...fieldValue] : [];

        if (index < 0 || index >= currentArray.length) return prevValue;

        return {
          ...prevValue,
          [fieldName]: [...currentArray.slice(0, index), ...currentArray.slice(index + 1)],
        } as T;
      }

      // Handle nested array field
      const updatePath = path;
      const currentValue = getNestedValue(prevValue as Record<string, unknown>, updatePath);

      if (!Array.isArray(currentValue) || index < 0 || index >= currentValue.length) {
        return prevValue;
      }

      const newArray = [...currentValue.slice(0, index), ...currentValue.slice(index + 1)];
      return setNestedValue(prevValue, updatePath, newArray);
    });
  }, []);

  /**
   * Helper function to get a nested value from an object
   */
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  };

  /**
   * Helper function to set a nested value in an object
   */
  const setNestedValue = <O, V>(obj: O, path: string, value: V): O => {
    const parts = path.split('.');

    if (parts.length === 1) {
      return {
        ...obj,
        [parts[0]]: value,
      } as O;
    }

    const [first, ...rest] = parts;
    const nextObj = ((obj as Record<string, unknown>)[first] as Record<string, unknown>) || {};

    return {
      ...obj,
      [first]: setNestedValue(nextObj, rest.join('.'), value),
    } as O;
  };

  /**
   * Resets to the initial state
   */
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Special handling for updating the entire settings object
  const updateSettings = useCallback(
    (settings: Record<string, unknown>) => {
      setValue((prevValue) => {
        // Extract settings but remove 'secrets' key to avoid duplication
        const { secrets, avatar, ...otherSettings } = settings;

        // Create the updated settings object
        const updatedSettings = {
          ...(prevValue as Record<string, unknown> & { settings?: Record<string, unknown> })
            .settings, // Start with existing settings
          ...otherSettings, // Add other settings (not secrets)
        };

        if (typeof avatar === 'string') {
          updatedSettings.avatar = avatar;
        }

        // Only add secrets if it was included in the update
        if (secrets) {
          // Create a new secrets object that only contains non-null values
          const filteredSecrets: Record<string, any> = {};

          Object.entries(secrets).forEach(([key, value]) => {
            // If value is null, don't include it (this is how we delete)
            if (value !== null) {
              filteredSecrets[key] = value;
            }
          });

          updatedSettings.secrets = filteredSecrets;
        }

        const result = {
          ...prevValue,
          settings: updatedSettings,
        } as T;

        return result;
      });
    },
    [] // Remove value from dependencies to avoid unnecessary rerenders
  );

  return {
    value,
    updateField,
    addArrayItem,
    removeArrayItem,
    reset,
    updateSettings,
  };
}
```