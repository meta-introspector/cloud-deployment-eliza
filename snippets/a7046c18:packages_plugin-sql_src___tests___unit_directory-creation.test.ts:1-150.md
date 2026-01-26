# a7046c18:packages_plugin-sql_src___tests___unit_directory-creation.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/directory-creation.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Test that the .eliza directory is automatically created when using PGLite with a file path
 */
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { stringToUuid } from "@elizaos/core";
import { createDatabaseAdapter } from "../../index";

/**
 * Type for PGLite client manager singleton
 */
interface PGLiteClientManager {
  getConnection?: () => { close?: () => Promise<void> } | undefined;
}

/**
 * Type for Postgres connection manager singleton
 */
interface PostgresConnectionManager {
  close?: () => Promise<void>;
}

/**
 * Type for the global singletons registry
 */
interface GlobalSingletons {
  pgLiteClientManager?: PGLiteClientManager;
  postgresConnectionManager?: PostgresConnectionManager;
}

/**
 * Symbol key for accessing global singletons
 */
const GLOBAL_SINGLETONS = Symbol.for("@elizaos/plugin-sql/global-singletons");

/**
 * Type-safe access to global singleton storage
 */
function getGlobalSingletons(): GlobalSingletons | undefined {
  return (globalThis as Record<symbol, GlobalSingletons | undefined>)[
    GLOBAL_SINGLETONS
  ];
}

/**
 * Helper to clean up global singletons between tests.
 * This is necessary because createDatabaseAdapter uses global singletons
 * to share database connections, but tests use different temp directories.
 */
async function cleanupGlobalSingletons() {
  const singletons = getGlobalSingletons();

  if (singletons?.pgLiteClientManager) {
    try {
      // Get the actual PGlite client and close it properly
      const client = singletons.pgLiteClientManager.getConnection?.();
      if (client?.close) {
        await client.close();
      }
    } catch {
      // Ignore errors during cleanup
    }
    delete singletons.pgLiteClientManager;
  }

  if (singletons?.postgresConnectionManager) {
    try {
      await singletons.postgresConnectionManager.close?.();
    } catch {
      // Ignore errors during cleanup
    }
    delete singletons.postgresConnectionManager;
  }
}

describe("Directory Creation", () => {
  let tempDir: string;

  beforeEach(async () => {
    // Clean up any existing singletons from previous tests
    await cleanupGlobalSingletons();
    tempDir = mkdtempSync(path.join(tmpdir(), "eliza-test-"));
  });

  afterEach(async () => {
    // Clean up singletons BEFORE deleting the directory
    await cleanupGlobalSingletons();

    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("should automatically create directory for PGLite when it does not exist", () => {
    const dataDir = path.join(tempDir, ".eliza", ".elizadb");
    const agentId = stringToUuid("test-agent");

    // Directory should not exist yet
    expect(existsSync(dataDir)).toBe(false);

    // Create adapter - should create the directory
    const adapter = createDatabaseAdapter({ dataDir }, agentId);

    // Directory should now exist
    expect(existsSync(dataDir)).toBe(true);
    expect(adapter).toBeDefined();
  });

  it("should not fail if directory already exists", () => {
    const dataDir = path.join(tempDir, ".eliza", ".elizadb");
    const agentId = stringToUuid("test-agent");

    // Create directory first
    const { mkdirSync } = require("node:fs");
    mkdirSync(dataDir, { recursive: true });
    expect(existsSync(dataDir)).toBe(true);

    // Create adapter - should not fail
    const adapter = createDatabaseAdapter({ dataDir }, agentId);

    // Directory should still exist
    expect(existsSync(dataDir)).toBe(true);
    expect(adapter).toBeDefined();
  });

  it("should not create directory for memory:// URIs", () => {
    const agentId = stringToUuid("test-agent");

    // This should not try to create a directory
    const adapter = createDatabaseAdapter({ dataDir: "memory://" }, agentId);

    // No directory should be created
    expect(existsSync("memory://")).toBe(false);
    expect(adapter).toBeDefined();
  });

  it("should not create directory for idb:// URIs", () => {
    const agentId = stringToUuid("test-agent");

    // This should not try to create a directory
    const adapter = createDatabaseAdapter(
      { dataDir: "idb://test-db" },
      agentId,
    );

    // No directory should be created
    expect(existsSync("idb://test-db")).toBe(false);
    expect(adapter).toBeDefined();
```