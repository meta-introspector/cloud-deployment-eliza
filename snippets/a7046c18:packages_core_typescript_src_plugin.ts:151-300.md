# a7046c18:packages_core_typescript_src_plugin.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/plugin.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  if (!plugin) {
    errors.push("Plugin is null or undefined");
    return { isValid: false, errors };
  }

  const pluginObj = plugin as Record<string, unknown>;

  if (!pluginObj.name) {
    errors.push("Plugin must have a name");
  }

  if (pluginObj.actions) {
    if (!Array.isArray(pluginObj.actions)) {
      errors.push("Plugin actions must be an array");
    } else {
      const invalidActions = pluginObj.actions.filter(
        (a) => typeof a !== "object" || !a,
      );
      if (invalidActions.length > 0) {
        errors.push("Plugin actions must be an array of action objects");
      }
    }
  }

  if (pluginObj.services) {
    if (!Array.isArray(pluginObj.services)) {
      errors.push("Plugin services must be an array");
    } else {
      const invalidServices = pluginObj.services.filter(
        (s) => typeof s !== "function" && (typeof s !== "object" || !s),
      );
      if (invalidServices.length > 0) {
        errors.push(
          "Plugin services must be an array of service classes or objects",
        );
      }
    }
  }

  if (pluginObj.providers && !Array.isArray(pluginObj.providers)) {
    errors.push("Plugin providers must be an array");
  }

  if (pluginObj.evaluators && !Array.isArray(pluginObj.evaluators)) {
    errors.push("Plugin evaluators must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Plugin Loading Utilities
// ============================================================================

/**
 * Load and prepare a plugin for use
 */
export async function loadAndPreparePlugin(
  pluginName: string,
): Promise<Plugin | null> {
  // Try to load the plugin module
  let pluginModule: unknown;

  try {
    // Attempt to dynamically import the plugin
    pluginModule = await import(pluginName);
  } catch (error: unknown) {
    logger.warn(
      { src: "core:plugin", pluginName, error },
      "Failed to load plugin",
    );
    // Attempt auto-install if allowed and not already attempted
    const attempted = await tryInstallPlugin(pluginName);
    if (!attempted) {
      return null;
    }
    // Retry import once after successful installation attempt
    try {
      pluginModule = await import(pluginName);
    } catch (secondError: unknown) {
      logger.error(
        { src: "core:plugin", pluginName, error: secondError },
        "Import failed after auto-install",
      );
      return null;
    }
  }

  if (!pluginModule) {
    logger.error(
      { src: "core:plugin", pluginName },
      "Failed to load plugin module",
    );
    return null;
  }

  // Try to find the plugin export in various locations
  const expectedFunctionName = `${pluginName
    .replace(/^@elizaos\/plugin-/, "")
    .replace(/^@elizaos\//, "")
    .replace(/-./g, (match) => match[1].toUpperCase())}Plugin`;

  const moduleObj = pluginModule as Record<string, unknown>;
  const exportsToCheck = [
    moduleObj[expectedFunctionName],
    moduleObj.default,
    ...Object.values(moduleObj),
  ];

  for (const potentialPlugin of exportsToCheck) {
    if (isValidPluginShape(potentialPlugin)) {
      return potentialPlugin as Plugin;
    }
    // Try factory functions that return a Plugin
    if (typeof potentialPlugin === "function" && potentialPlugin.length === 0) {
      const produced = potentialPlugin();
      if (isValidPluginShape(produced)) {
        return produced as Plugin;
      }
    }
  }

  logger.warn(
    { src: "core:plugin", pluginName },
    "No valid plugin export found",
  );
  return null;
}

// ============================================================================
// Plugin Name Mapping Utilities
// ============================================================================

/**
 * Normalizes a plugin name by extracting the short name from scoped packages
 * Examples:
 *  - '@elizaos/plugin-discord' -> 'discord'
 *  - '@elizaos/plugin-sql' -> 'sql'
 *  - 'bootstrap' -> 'bootstrap'
 *  - 'plugin-custom' -> 'plugin-custom'
 */
export function normalizePluginName(pluginName: string): string {
  // Match patterns like @elizaos/plugin-{name} or @{scope}/plugin-{name}
  const scopedMatch = pluginName.match(/^@[^/]+\/plugin-(.+)$/);
  if (scopedMatch) {
    return scopedMatch[1];
  }
```