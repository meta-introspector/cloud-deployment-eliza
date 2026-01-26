# 5e8c73c1:packages_cli_src_utils_load-plugin.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/load-plugin.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    logger.debug(
      { src: 'cli', util: 'load-plugin', strategy, path: importPath, error: errorMessage },
      'Import failed'
    );
    return null;
  }
}

/**
 * Collection of import strategies
 */
const importStrategies: ImportStrategy[] = [
  // Try local development first - this is the most important for plugin testing
  {
    name: 'local development plugin',
    tryImport: async (repository: string) => {
      const context = detectPluginContext(repository);

      if (context.isLocalDevelopment) {
        logger.debug(
          { src: 'cli', util: 'load-plugin', repository },
          'Detected local development plugin'
        );

        // Ensure the plugin is built
        const isBuilt = await ensurePluginBuilt(context);
        if (!isBuilt) {
          provideLocalPluginGuidance(repository, context);
          return null;
        }

        // Try to load from built output
        if (context.localPath && existsSync(context.localPath)) {
          logger.info(
            { src: 'cli', util: 'load-plugin', repository },
            'Loading local development plugin'
          );
          return tryImporting(context.localPath, 'local development plugin', repository);
        }

        // This shouldn't happen if ensurePluginBuilt succeeded, but handle it gracefully
        logger.warn(
          { src: 'cli', util: 'load-plugin', repository, expectedPath: context.localPath },
          'Plugin built but output not found'
        );
        provideLocalPluginGuidance(repository, context);
        return null;
      }

      return null;
    },
  },
  // Try workspace dependencies (for monorepo packages)
  {
    name: 'workspace dependency',
    tryImport: async (repository: string) => {
      if (repository.startsWith('@elizaos/plugin-')) {
        // Try to find the plugin in the workspace
        const pluginName = repository.replace('@elizaos/', '');
        const workspacePath = path.resolve(process.cwd(), '..', pluginName, 'dist', 'index.js');
        if (existsSync(workspacePath)) {
          return tryImporting(workspacePath, 'workspace dependency', repository);
        }
      }
      return null;
    },
  },
  {
    name: 'direct path',
    tryImport: async (repository: string) => tryImporting(repository, 'direct path', repository),
  },
  {
    name: 'local node_modules',
    tryImport: async (repository: string) =>
      tryImporting(resolveNodeModulesPath(repository), 'local node_modules', repository),
  },
  {
    name: 'global node_modules',
    tryImport: async (repository: string) => {
      const globalPath = path.resolve(getGlobalNodeModulesPath(), repository);
      if (!existsSync(path.dirname(globalPath))) {
        logger.debug(
          { src: 'cli', util: 'load-plugin', repository, globalPath: path.dirname(globalPath) },
          'Global node_modules not found, skipping'
        );
        return null;
      }
      return tryImporting(globalPath, 'global node_modules', repository);
    },
  },
  {
    name: 'package.json entry',
    tryImport: async (repository: string) => {
      const packageJson = await readPackageJson(repository);
      if (!packageJson) return null;

      const entryPoint = packageJson.module || packageJson.main || DEFAULT_ENTRY_POINT;
      return tryImporting(
        resolveNodeModulesPath(repository, entryPoint),
        `package.json entry (${entryPoint})`,
        repository
      );
    },
  },
  {
    name: 'common dist pattern',
    tryImport: async (repository: string) => {
      const packageJson = await readPackageJson(repository);
      if (packageJson?.main === DEFAULT_ENTRY_POINT) return null;

      return tryImporting(
        resolveNodeModulesPath(repository, DEFAULT_ENTRY_POINT),
        'common dist pattern',
        repository
      );
    },
  },
];

/**
 * Determines if a package name is from the ElizaOS ecosystem
 */
function isElizaOSPackageName(repository: string): boolean {
  return repository.startsWith('@elizaos/') || repository.startsWith('@elizaos-plugins/');
}

/**
 * Get relevant import strategies based on plugin type
 */
function getStrategiesForPlugin(repository: string): ImportStrategy[] {
  const isElizaOS = isElizaOSPackageName(repository);

  if (isElizaOS) {
    // ElizaOS ecosystem plugins: try all strategies
    return importStrategies;
  } else {
    // Third-party plugins: only try relevant strategies
    return importStrategies.filter(
      (strategy) =>
        strategy.name === 'local development plugin' ||
        strategy.name === 'package.json entry' ||
        strategy.name === 'common dist pattern'
    );
  }
}

/**
 * Attempts to load a plugin module using relevant strategies based on plugin type.
 * ElizaOS ecosystem plugins (@elizaos/*) use all strategies,
 * while third-party plugins use only relevant strategies to avoid noise.
```