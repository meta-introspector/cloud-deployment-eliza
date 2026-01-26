# 5e8c73c1:packages_cli_src_utils_load-plugin.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/load-plugin.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { logger } from '@elizaos/core';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  detectPluginContext,
  ensurePluginBuilt,
  provideLocalPluginGuidance,
} from './plugin-context';

interface PackageJson {
  module?: string;
  main?: string;
}

interface ImportStrategy {
  name: string;
  tryImport: (repository: string) => Promise<Record<string, unknown> | null>;
}

const DEFAULT_ENTRY_POINT = 'dist/index.js';

/**
 * Get the global node_modules path based on Node.js/Bun installation
 */
function getGlobalNodeModulesPath(): string {
  const execDir = path.dirname(process.execPath);
  const isBun = typeof Bun !== 'undefined';

  if (process.platform === 'win32') {
    if (isBun) {
      // For Bun on Windows, check common installation paths
      const bunPaths = [path.join(execDir, 'node_modules')];

      // Only add paths that have valid environment variables
      if (process.env.APPDATA) {
        bunPaths.push(path.join(process.env.APPDATA, 'bun', 'node_modules'));
      }
      if (process.env.LOCALAPPDATA) {
        bunPaths.push(path.join(process.env.LOCALAPPDATA, 'bun', 'node_modules'));
      }
      if (process.env.USERPROFILE) {
        bunPaths.push(path.join(process.env.USERPROFILE, '.bun', 'node_modules'));
      }

      // Return the first path that exists
      for (const potentialPath of bunPaths) {
        if (existsSync(potentialPath)) {
          return potentialPath;
        }
      }
    }

    // Default for Windows
    return path.join(execDir, 'node_modules');
  } else {
    // On Unix systems
    if (isBun) {
      // Check common locations for Bun on Unix
      const bunUnixPaths = [
        path.join(execDir, 'node_modules'),
        path.join(execDir, '..', 'lib', 'node_modules'),
      ];

      // Only add home directory path if HOME is defined
      if (process.env.HOME) {
        bunUnixPaths.unshift(path.join(process.env.HOME, '.bun', 'node_modules'));
      }

      for (const potentialPath of bunUnixPaths) {
        if (existsSync(potentialPath)) {
          return potentialPath;
        }
      }
    }

    // Default for Unix
    return path.join(execDir, '..', 'lib', 'node_modules');
  }
}

/**
 * Helper function to resolve a path within node_modules
 */
function resolveNodeModulesPath(repository: string, ...segments: string[]): string {
  return path.resolve(process.cwd(), 'node_modules', repository, ...segments);
}

/**
 * Helper function to read and parse package.json
 */
async function readPackageJson(repository: string): Promise<PackageJson | null> {
  const packageJsonPath = resolveNodeModulesPath(repository, 'package.json');
  try {
    if (existsSync(packageJsonPath)) {
      return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    }
  } catch (error) {
    logger.debug(
      {
        src: 'cli',
        util: 'load-plugin',
        repository,
        error: error instanceof Error ? error.message : String(error),
      },
      'Failed to read package.json'
    );
  }
  return null;
}

/**
 * Normalizes import paths for cross-platform compatibility.
 * On Windows, converts absolute paths to file:// URLs for dynamic imports.
 */
function normalizeImportPath(importPath: string): string {
  const normalized = path.normalize(importPath);

  // On Windows, convert absolute paths to file:// URLs for dynamic imports
  if (process.platform === 'win32' && path.isAbsolute(normalized)) {
    // Handle UNC paths (\\server\share) differently
    if (normalized.startsWith('\\\\')) {
      // UNC paths: \\server\share -> file://server/share
      return `file:${encodeURI(normalized.replace(/\\/g, '/'))}`;
    } else {
      // Regular paths: C:\path -> file:///C:/path
      return `file:///${encodeURI(normalized.replace(/\\/g, '/'))}`;
    }
  }

  return normalized;
}

/**
 * Attempts to import a module from a given path and logs the outcome.
 */
async function tryImporting(
  importPath: string,
  strategy: string,
  repository: string
): Promise<Record<string, unknown> | null> {
  try {
    const pathToImport = normalizeImportPath(importPath);
    const module = await import(pathToImport);
    logger.success(
      { src: 'cli', util: 'load-plugin', repository, strategy, path: importPath },
      'Plugin loaded'
    );
    return module as Record<string, unknown>;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
```