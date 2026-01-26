# a7046c18:packages_core_typescript_src_plugin.ts:451-582

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/plugin.ts:451-582
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 * @param depName - The dependency name to queue (can be scoped or short name)
 * @param seenDependencies - Set tracking all dependency names that have been processed
 * @param pluginMap - Map of already loaded plugins keyed by their canonical names
 * @param queue - The resolution queue to add the dependency to if not already present
 *
 * @remarks
 * The function normalizes the dependency name and checks multiple sources to determine if it's
 * already queued:
 * - Direct name match in seenDependencies
 * - Normalized name match in seenDependencies
 * - Normalized name match against pluginMap keys
 * - Name match against plugin names in pluginMap values
 *
 * If the dependency is not found in any of these sources, it's added to both seenDependencies
 * (with both original and normalized names) and the resolution queue.
 */
function queueDependency(
  depName: string,
  seenDependencies: Set<string>,
  pluginMap: Map<string, Plugin>,
  queue: (string | Plugin)[],
): void {
  const normalizedDepName = normalizePluginName(depName);

  // Check if already queued or loaded (by any name variant)
  // Normalize both dependency name and plugin names for consistent matching
  const alreadyQueued =
    seenDependencies.has(depName) ||
    seenDependencies.has(normalizedDepName) ||
    // Check if any plugin map key normalizes to the same name
    Array.from(pluginMap.keys()).some(
      (key) => normalizePluginName(key) === normalizedDepName,
    ) ||
    // Check if any plugin's name normalizes to the same name
    Array.from(pluginMap.values()).some(
      (p) =>
        normalizePluginName(p.name) === normalizedDepName ||
        p.name === depName ||
        p.name === normalizedDepName,
    );

  if (!alreadyQueued) {
    seenDependencies.add(depName);
    seenDependencies.add(normalizedDepName);
    queue.push(depName);
  }
}

/**
 * Internal implementation of plugin resolution
 * @param plugins - Array of plugin names or Plugin objects
 * @param isTestMode - Whether to include test dependencies
 * @returns Ordered array of resolved plugins
 */
async function resolvePluginsImpl(
  plugins: (string | Plugin)[],
  isTestMode: boolean = false,
): Promise<Plugin[]> {
  const pluginMap = new Map<string, Plugin>();
  const queue: (string | Plugin)[] = [...plugins];
  const seenDependencies = new Set<string>();

  while (queue.length > 0) {
    const next = queue.shift()!;
    const loaded = await loadPlugin(next);
    if (!loaded) continue;

    const canonicalName = loaded.name;

    if (!pluginMap.has(canonicalName)) {
      pluginMap.set(canonicalName, loaded);

      // Queue regular dependencies
      for (const depName of loaded.dependencies ?? []) {
        queueDependency(depName, seenDependencies, pluginMap, queue);
      }

      // Queue test dependencies if in test mode
      if (isTestMode) {
        for (const depName of loaded.testDependencies ?? []) {
          queueDependency(depName, seenDependencies, pluginMap, queue);
        }
      }
    }
  }

  return resolvePluginDependencies(pluginMap, isTestMode);
}

/**
 * Resolve multiple plugins with dependency ordering
 * Browser-compatible wrapper that handles Node.js-only plugin loading
 *
 * @param plugins - Array of plugin names or Plugin objects
 * @param isTestMode - Whether to include test dependencies
 * @returns Ordered array of resolved plugins
 *
 * Note: In browser environments, string plugin names are not supported.
 * Only pre-resolved Plugin objects can be used.
 */
export async function resolvePlugins(
  plugins: (string | Plugin)[],
  isTestMode: boolean = false,
): Promise<Plugin[]> {
  const env = detectEnvironment();

  // In Node.js, use full implementation
  if (env === "node") {
    return resolvePluginsImpl(plugins, isTestMode);
  }

  // In browser, only Plugin objects are supported
  const pluginObjects = plugins.filter(
    (p): p is Plugin => typeof p !== "string",
  );

  if (plugins.some((p) => typeof p === "string")) {
    const skippedPlugins = plugins.filter((p) => typeof p === "string");
    logger.warn(
      { src: "core:plugin", skippedPlugins },
      "Browser environment: String plugin references not supported",
    );
  }

  // Still resolve dependencies for Plugin objects
  const pluginMap = new Map<string, Plugin>();
  for (const plugin of pluginObjects) {
    pluginMap.set(plugin.name, plugin);
  }

  return resolvePluginDependencies(pluginMap, isTestMode);
}
```