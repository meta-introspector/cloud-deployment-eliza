# a7046c18:packages_core_typescript_src_plugin.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/plugin.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { logger } from "./logger";
import type { Plugin } from "./types";
import { detectEnvironment } from "./utils/environment";

// ============================================================================
// Plugin Installation Utilities
// ============================================================================

/**
 * Track attempted plugin installations per process
 */
const attemptedInstalls = new Set<string>();

/**
 * Check if auto-install is allowed in current environment
 */
function isAutoInstallAllowed(): boolean {
  if (process.env.ELIZA_NO_AUTO_INSTALL === "true") return false;
  if (process.env.ELIZA_NO_PLUGIN_AUTO_INSTALL === "true") return false;
  if (process.env.CI === "true") return false;
  if (process.env.ELIZA_TEST_MODE === "true") return false;
  if (process.env.NODE_ENV === "test") return false;
  return true;
}

/**
 * Attempt to install a plugin using Bun
 * Returns true if installation succeeded, false otherwise
 */
export async function tryInstallPlugin(pluginName: string): Promise<boolean> {
  try {
    if (!isAutoInstallAllowed()) {
      logger.debug(
        { src: "core:plugin", pluginName },
        "Auto-install disabled, skipping",
      );
      return false;
    }

    if (attemptedInstalls.has(pluginName)) {
      logger.debug(
        { src: "core:plugin", pluginName },
        "Auto-install already attempted, skipping",
      );
      return false;
    }
    attemptedInstalls.add(pluginName);

    // Check if Bun is available before trying to use it
    if (typeof Bun === "undefined" || typeof Bun.spawn !== "function") {
      logger.warn(
        { src: "core:plugin", pluginName },
        "Bun runtime not available, cannot auto-install",
      );
      return false;
    }

    // Verify Bun availability on PATH
    try {
      const check = Bun.spawn(["bun", "--version"], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const code = await check.exited;
      if (code !== 0) {
        logger.warn(
          { src: "core:plugin", pluginName },
          "Bun not available on PATH, cannot auto-install",
        );
        return false;
      }
    } catch {
      logger.warn(
        { src: "core:plugin", pluginName },
        "Bun not available on PATH, cannot auto-install",
      );
      return false;
    }

    logger.info(
      { src: "core:plugin", pluginName },
      "Auto-installing missing plugin",
    );
    const install = Bun.spawn(["bun", "add", pluginName], {
      cwd: process.cwd(),
      env: process.env as Record<string, string>,
      stdout: "inherit",
      stderr: "inherit",
    });
    const exit = await install.exited;

    if (exit === 0) {
      logger.info(
        { src: "core:plugin", pluginName },
        "Plugin installed, retrying import",
      );
      return true;
    }

    logger.error(
      { src: "core:plugin", pluginName, exitCode: exit },
      "Plugin installation failed",
    );
    return false;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error(
      { src: "core:plugin", pluginName, error: message },
      "Unexpected error during auto-install",
    );
    return false;
  }
}

// ============================================================================
// Plugin Validation Utilities
// ============================================================================

/**
 * Check if an object has a valid plugin shape
 */
export function isValidPluginShape(obj: unknown): obj is Plugin {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const plugin = obj as Record<string, unknown>;
  if (!plugin.name) {
    return false;
  }

  return !!(
    plugin.init ||
    plugin.services ||
    plugin.providers ||
    plugin.actions ||
    plugin.evaluators ||
    plugin.description
  );
}

/**
 * Validate a plugin's structure
 */
export function validatePlugin(plugin: unknown): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

```