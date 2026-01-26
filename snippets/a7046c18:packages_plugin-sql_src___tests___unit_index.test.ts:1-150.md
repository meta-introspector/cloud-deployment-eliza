# a7046c18:packages_plugin-sql_src___tests___unit_index.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/index.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  mock,
} from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IAgentRuntime, IDatabaseAdapter, UUID } from "@elizaos/core";
import { createDatabaseAdapter, plugin } from "../../index";

/**
 * Type for the global singletons object used by plugin-sql.
 */
interface PluginSqlSingletons {
  pgLiteClientManager?: {
    getConnection?: () => { close?: () => Promise<void> };
  };
  postgresConnectionManager?: {
    close?: () => Promise<void>;
  };
}

/**
 * Augment globalThis to include the plugin-sql singletons symbol.
 */
interface GlobalWithSingletons {
  [key: symbol]: PluginSqlSingletons | undefined;
}

/**
 * Minimal mock runtime interface for testing plugin-sql initialization.
 * This interface only includes the properties that plugin.init actually uses.
 */
interface MockRuntimeForTesting {
  agentId: UUID;
  getSetting: Mock<(key: string) => string | boolean | number | null>;
  registerDatabaseAdapter: Mock<(adapter: IDatabaseAdapter) => void>;
  registerService: Mock<() => void>;
  getService: Mock<() => void>;
  databaseAdapter: IDatabaseAdapter | undefined;
  hasElizaOS: Mock<() => boolean>;
  logger: {
    info: Mock<() => void>;
    debug: Mock<() => void>;
    warn: Mock<() => void>;
    error: Mock<() => void>;
  };
}

/**
 * Creates a mock runtime for testing plugin-sql.
 * The mock is typed to satisfy IAgentRuntime for use with plugin.init.
 */
function createMockRuntime(
  overrides: Partial<MockRuntimeForTesting> = {},
): MockRuntimeForTesting & IAgentRuntime {
  const baseMock: MockRuntimeForTesting = {
    agentId: "00000000-0000-0000-0000-000000000000" as UUID,
    getSetting: mock(() => null),
    registerDatabaseAdapter: mock(() => {}),
    registerService: mock(() => {}),
    getService: mock(() => {}),
    databaseAdapter: undefined,
    hasElizaOS: mock(() => false),
    logger: {
      info: mock(() => {}),
      debug: mock(() => {}),
      warn: mock(() => {}),
      error: mock(() => {}),
    },
    ...overrides,
  };

  // Return the mock as IAgentRuntime - the plugin only uses the properties defined above.
  // This is safe because plugin.init only accesses these specific properties.
  return baseMock as MockRuntimeForTesting & IAgentRuntime;
}

/**
 * Helper to clean up global singletons between tests.
 * This is necessary because createDatabaseAdapter uses global singletons
 * to share database connections, but tests use different temp directories.
 * IMPORTANT: Must close connections BEFORE deleting temp directories.
 */
async function cleanupGlobalSingletons() {
  const GLOBAL_SINGLETONS = Symbol.for("@elizaos/plugin-sql/global-singletons");
  const globalSymbols = globalThis as GlobalWithSingletons;
  const singletons = globalSymbols[GLOBAL_SINGLETONS];

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

describe("SQL Plugin", () => {
  let mockRuntime: MockRuntimeForTesting & IAgentRuntime;
  let tempDir: string;

  beforeEach(async () => {
    // Clean up any existing singletons from previous tests
    await cleanupGlobalSingletons();

    // Create a temporary directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eliza-plugin-sql-test-"));

    // Reset environment variables
    delete process.env.POSTGRES_URL;
    delete process.env.POSTGRES_USER;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.PGLITE_DATA_DIR;

    mockRuntime = createMockRuntime();
  });

  afterEach(async () => {
    // Clean up singletons BEFORE deleting the directory
    await cleanupGlobalSingletons();

    // Clean up temporary directory
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Reset environment variables
    delete process.env.PGLITE_DATA_DIR;
  });

```