# a7046c18:packages_core_typescript_src_plugin.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/plugin.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  return pluginName;
}

// ============================================================================
// Plugin Dependency Resolution
// ============================================================================

/**
 * Resolve plugin dependencies with circular dependency detection
 * Performs topological sorting of plugins to ensure dependencies are loaded in the correct order
 *
 * Supports both scoped package names (@elizaos/plugin-discord) and short names (discord)
 */
export function resolvePluginDependencies(
  availablePlugins: Map<string, Plugin>,
  isTestMode: boolean = false,
): Plugin[] {
  const resolutionOrder: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  // Create enhanced lookup map supporting both naming conventions
  // Allows finding plugins by short name ('discord') or scoped name ('@elizaos/plugin-discord')
  const lookupMap = new Map<string, Plugin>();
  for (const [key, plugin] of availablePlugins.entries()) {
    lookupMap.set(key, plugin);
    if (plugin.name !== key) {
      lookupMap.set(plugin.name, plugin);
    }
    // Only add scoped name if plugin.name is not already scoped
    if (!plugin.name.startsWith("@")) {
      lookupMap.set(`@elizaos/plugin-${plugin.name}`, plugin);
    }
    const normalizedKey = normalizePluginName(key);
    if (normalizedKey !== key) {
      lookupMap.set(normalizedKey, plugin);
    }
  }

  function visit(pluginName: string) {
    // Try to find the plugin using the lookup map
    const plugin = lookupMap.get(pluginName);

    if (!plugin) {
      // Try normalized name as fallback
      const normalizedName = normalizePluginName(pluginName);
      const pluginByNormalized = lookupMap.get(normalizedName);

      if (!pluginByNormalized) {
        logger.warn(
          { src: "core:plugin", pluginName },
          "Plugin dependency not found, skipping",
        );
        return;
      }

      // Use the normalized name for the rest of the resolution
      return visit(pluginByNormalized.name);
    }

    // Use the actual plugin.name for tracking to ensure consistency
    const canonicalName = plugin.name;

    if (visited.has(canonicalName)) return;
    if (visiting.has(canonicalName)) {
      logger.error(
        { src: "core:plugin", pluginName: canonicalName },
        "Circular dependency detected",
      );
      return;
    }

    visiting.add(canonicalName);

    const deps = [...(plugin.dependencies || [])];
    if (isTestMode) {
      deps.push(...(plugin.testDependencies || []));
    }
    for (const dep of deps) {
      visit(dep);
    }

    visiting.delete(canonicalName);
    visited.add(canonicalName);
    resolutionOrder.push(canonicalName);
  }

  // Visit all plugins using their canonical names
  for (const plugin of availablePlugins.values()) {
    if (!visited.has(plugin.name)) {
      visit(plugin.name);
    }
  }

  // Map back to actual plugin objects using the original availablePlugins map
  const finalPlugins = resolutionOrder
    .map((name) => {
      // Find by name in the original map
      for (const plugin of availablePlugins.values()) {
        if (plugin.name === name) {
          return plugin;
        }
      }
      return null;
    })
    .filter((p): p is Plugin => Boolean(p));

  logger.debug(
    { src: "core:plugin", plugins: finalPlugins.map((p) => p.name) },
    "Plugins resolved",
  );

  return finalPlugins;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Load a plugin by name or validate a provided plugin object
 * @param nameOrPlugin - Plugin name string or Plugin object
 * @returns Loaded Plugin or null if failed
 */
export async function loadPlugin(
  nameOrPlugin: string | Plugin,
): Promise<Plugin | null> {
  if (typeof nameOrPlugin === "string") {
    return loadAndPreparePlugin(nameOrPlugin);
  }

  // Validate the provided plugin object
  const validation = validatePlugin(nameOrPlugin);
  if (!validation.isValid) {
    logger.error(
      { src: "core:plugin", errors: validation.errors },
      "Invalid plugin provided",
    );
    return null;
  }

  return nameOrPlugin;
}

/**
 * Helper function to queue a plugin dependency for resolution if it hasn't been queued or loaded already.
 *
 * This function handles plugin name normalization to prevent duplicate queuing when dependencies
 * are specified using different naming conventions (e.g., '@elizaos/plugin-discord' vs 'discord').
 *
```