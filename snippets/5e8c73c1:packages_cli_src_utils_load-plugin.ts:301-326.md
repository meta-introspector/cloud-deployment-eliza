# 5e8c73c1:packages_cli_src_utils_load-plugin.ts:301-326

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/load-plugin.ts:301-326
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 *
 * @param repository - The plugin repository/package name to load.
 * @returns The loaded plugin module or null if loading fails after all attempts.
 */
export async function loadPluginModule(
  repository: string
): Promise<Record<string, unknown> | null> {
  const isElizaOS = isElizaOSPackageName(repository);
  const strategies = getStrategiesForPlugin(repository);

  logger.debug(
    { src: 'cli', util: 'load-plugin', repository, isElizaOS, strategyCount: strategies.length },
    'Loading plugin'
  );

  for (const strategy of strategies) {
    const result = await strategy.tryImport(repository);
    if (result) return result;
  }

  logger.warn(
    { src: 'cli', util: 'load-plugin', repository },
    'Failed to load plugin with all strategies'
  );
  return null;
}
```