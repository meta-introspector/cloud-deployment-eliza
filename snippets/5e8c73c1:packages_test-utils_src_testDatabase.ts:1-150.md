# 5e8c73c1:packages_test-utils_src_testDatabase.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { IDatabaseAdapter, UUID, Memory } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { v4 as uuidv4 } from 'uuid';

/**
 * Test Database Manager - Creates isolated database instances for testing
 * Each test gets its own database to prevent interference and ensure isolation
 */
export class TestDatabaseManager {
  private testDatabases: Map<string, IDatabaseAdapter> = new Map();
  private tempPaths: Set<string> = new Set();

  /**
   * Creates an isolated database for testing
   * Uses PostgreSQL for testing when available, falls back to mock database
   */
  async createIsolatedDatabase(testId: string): Promise<IDatabaseAdapter> {
    try {
      logger.debug(
        { src: 'test-utils:test-database', testId },
        `Creating isolated test database for ${testId}`
      );

      // Use dynamic import to avoid breaking if PostgreSQL not available
      let adapter: IDatabaseAdapter;

      try {
        // Try to use PostgreSQL for testing
        logger.debug(
          { src: 'test-utils:test-database', testId },
          `Attempting to load PostgreSQL adapter for ${testId}`
        );

        // Try to use real database for proper testing, but fallback to mock if unavailable
        if (process.env.FORCE_MOCK_DB === 'true') {
          logger.warn(
            { src: 'test-utils:test-database' },
            'FORCE_MOCK_DB is set - using mock database'
          );
          adapter = this.createMockDatabase(testId);
        } else {
          // Check if SQL plugin is available in the build
          try {
            // Don't import plugin-sql directly to avoid circular dependency
            // Instead, use global registration if available
            interface GlobalWithSqlPlugin {
              __elizaOS_sqlPlugin?: {
                createDatabaseAdapter?: (config: unknown, agentId: UUID) => IDatabaseAdapter;
              };
            }
            const sqlPlugin = (globalThis as GlobalWithSqlPlugin).__elizaOS_sqlPlugin;

            if (!sqlPlugin?.createDatabaseAdapter) {
              throw new Error('SQL plugin not available - falling back to mock database');
            }

            // Use PostgreSQL test database if available
            const postgresUrl = process.env.TEST_POSTGRES_URL || process.env.POSTGRES_URL;
            if (!postgresUrl) {
              throw new Error('PostgreSQL URL not available - falling back to mock database');
            }

            adapter = await sqlPlugin.createDatabaseAdapter(
              {
                postgresUrl,
              },
              '11111111-2222-3333-4444-555555555555' as UUID
            );

            logger.debug(
              { src: 'test-utils:test-database', testId },
              `Successfully created PostgreSQL adapter for ${testId}`
            );
          } catch (importError) {
            logger.warn(
              {
                src: 'test-utils:test-database',
                error: importError instanceof Error ? importError.message : String(importError),
              },
              `SQL plugin not available: ${importError instanceof Error ? importError.message : String(importError)} - falling back to mock database`
            );
            adapter = this.createMockDatabase(testId);
          }
        }
      } catch (postgresError) {
        logger.warn(
          {
            src: 'test-utils:test-database',
            error: postgresError instanceof Error ? postgresError.message : String(postgresError),
          },
          `Failed to create PostgreSQL database: ${postgresError instanceof Error ? postgresError.message : String(postgresError)} - falling back to mock database`
        );

        // Fall back to mock database for basic testing
        adapter = this.createMockDatabase(testId);
      }

      // Initialize the database
      await adapter.init();

      // Store for cleanup
      this.testDatabases.set(testId, adapter);

      logger.debug(
        { src: 'test-utils:test-database', testId },
        `Successfully created isolated database for ${testId}`
      );
      return adapter;
    } catch (error) {
      logger.error(
        {
          src: 'test-utils:test-database',
          testId,
          error: error instanceof Error ? error.message : String(error),
        },
        `Failed to create test database for ${testId}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Test database creation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Creates a minimal mock database adapter for testing when real database unavailable
   * This is a FUNCTIONAL mock that actually stores data in memory
   */
  private createMockDatabase(testId: string): IDatabaseAdapter {
    // In-memory storage for this test instance
    const storage = {
      agents: new Map(),
      entities: new Map(),
      memories: new Map(),
      relationships: new Map(),
      rooms: new Map(),
      participants: new Map(),
      cache: new Map(),
      worlds: new Map(),
      tasks: new Map(),
      logs: new Map(),
    };

    const adapter = {
      db: null, // Mock database instance

      async initialize() {
        logger.debug(
          { src: 'test-utils:test-database', testId },
          `Initialized mock database for ${testId}`
        );
```