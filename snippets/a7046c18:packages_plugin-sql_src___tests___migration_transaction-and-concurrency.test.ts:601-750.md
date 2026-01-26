# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        migrator.migrate("@elizaos/concurrent-test-invalid", invalidSchema),
      ]);

      // Valid migration should succeed
      expect(validResult.status).toBe("fulfilled");

      // Invalid migration should fail
      expect(invalidResult.status).toBe("rejected");

      // Verify valid table was created
      const tableExists = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_concurrent_4'
        )`),
      );

      expect(tableExists.rows[0]?.exists).toBe(true);

      // Verify valid migration was recorded
      const validMigrationExists = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-valid'`),
      );

      expect(
        parseInt(String((validMigrationExists.rows[0] as CountRow).count), 10),
      ).toBe(1);

      // Verify invalid migration was NOT recorded
      const invalidMigrationExists = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-invalid'`),
      );

      expect(
        parseInt(
          String((invalidMigrationExists.rows[0] as CountRow).count),
          10,
        ),
      ).toBe(0);
    });
  });

  describe("Advisory Lock Security", () => {
    it("should generate valid bigint lock IDs for plugins", async () => {
      // Test that getAdvisoryLockId returns a valid bigint
      const testPlugins = [
        "@elizaos/plugin-sql",
        "@elizaos/plugin-bootstrap",
        "some-very-long-plugin-name-that-should-still-work-correctly",
        "plugin-with-special-chars-!@#$%^&*()",
      ];

      for (const pluginName of testPlugins) {
        // Access private method for testing
        interface TestableRuntimeMigrator extends RuntimeMigrator {
          getAdvisoryLockId(pluginName: string): bigint;
        }
        const lockId = (
          migrator as unknown as TestableRuntimeMigrator
        ).getAdvisoryLockId(pluginName);

        // Verify it's a bigint
        expect(typeof lockId).toBe("bigint");

        // Verify it's within PostgreSQL bigint range
        const _MIN_BIGINT = -9223372036854775808n;
        const MAX_BIGINT = 9223372036854775807n;
        expect(lockId).toBeGreaterThanOrEqual(0n); // We ensure positive values
        expect(lockId).toBeLessThanOrEqual(MAX_BIGINT);

        // Verify it's non-zero
        expect(lockId).not.toBe(0n);
      }
    });

    it("should generate consistent lock IDs for the same plugin", async () => {
      const pluginName = "@elizaos/advisory-lock-test";

      // Generate lock ID multiple times
      interface TestableRuntimeMigrator extends RuntimeMigrator {
        getAdvisoryLockId(pluginName: string): bigint;
      }
      const testMigrator = migrator as unknown as TestableRuntimeMigrator;
      const lockId1 = testMigrator.getAdvisoryLockId(pluginName);
      const lockId2 = testMigrator.getAdvisoryLockId(pluginName);
      const lockId3 = testMigrator.getAdvisoryLockId(pluginName);

      // All should be identical
      expect(lockId1).toBe(lockId2);
      expect(lockId2).toBe(lockId3);
    });

    it("should generate different lock IDs for different plugins", async () => {
      const plugin1 = "@elizaos/lock-plugin-1";
      const plugin2 = "@elizaos/lock-plugin-2";

      interface TestableRuntimeMigrator extends RuntimeMigrator {
        getAdvisoryLockId(pluginName: string): bigint;
      }
      const testMigrator = migrator as unknown as TestableRuntimeMigrator;
      const lockId1 = testMigrator.getAdvisoryLockId(plugin1);
      const lockId2 = testMigrator.getAdvisoryLockId(plugin2);

      // Should be different
      expect(lockId1).not.toBe(lockId2);
    });

    it("should correctly validate PostgreSQL bigint values", async () => {
      interface TestableRuntimeMigrator extends RuntimeMigrator {
        validateBigInt(value: bigint): boolean;
      }
      const testMigrator = migrator as unknown as TestableRuntimeMigrator;
      const validateBigInt = testMigrator.validateBigInt.bind(testMigrator);

      // Valid values
      expect(validateBigInt(0n)).toBe(true);
      expect(validateBigInt(1n)).toBe(true);
      expect(validateBigInt(9223372036854775807n)).toBe(true); // MAX
      expect(validateBigInt(-9223372036854775808n)).toBe(true); // MIN
      expect(validateBigInt(1000000n)).toBe(true);

      // Invalid values (out of range)
      expect(validateBigInt(9223372036854775808n)).toBe(false); // MAX + 1
      expect(validateBigInt(-9223372036854775809n)).toBe(false); // MIN - 1
      expect(validateBigInt(BigInt("99999999999999999999999999999"))).toBe(
        false,
      );
    });

    it("should use CAST for type safety in advisory lock queries", async () => {
      // Note: This test is primarily for verification that our SQL generation
      // uses proper parameterization. Since PGLite doesn't support advisory locks,
      // we're testing the internal logic rather than actual execution.

      const _simpleSchema = {
        testTable: pgTable("test_lock_security", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
        }),
      };

      // Get the lock ID that would be used
      interface TestableRuntimeMigrator extends RuntimeMigrator {
        getAdvisoryLockId(pluginName: string): bigint;
      }
      const testMigrator = migrator as unknown as TestableRuntimeMigrator;
      const lockId = testMigrator.getAdvisoryLockId(
        "@elizaos/lock-security-test",
```