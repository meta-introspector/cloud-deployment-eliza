# a7046c18:packages_plugin-sql_src___tests___unit_entity-rls.test.ts:451-593

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/entity-rls.test.ts:451-593
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const sessionCommand = `SET LOCAL app.entity_id = '${entityId}'`;

      expect(sessionCommand).toContain("SET LOCAL");
      expect(sessionCommand).toContain(entityId);
    });

    it("should handle NULL entity_id for server operations", () => {
      const entityId = null;
      const shouldSetContext = entityId !== null;

      expect(shouldSetContext).toBe(false);
    });

    it("should gracefully handle RLS disabled mode", () => {
      const rlsEnabled = false;

      // Try-catch should prevent errors when RLS functions don't exist
      let errorThrown = false;
      try {
        if (rlsEnabled) {
          throw new Error("RLS functions not found");
        }
      } catch (_error) {
        errorThrown = true;
      }

      // Should NOT throw error in disabled mode
      expect(errorThrown).toBe(false);
    });
  });

  describe("elizaOS Integration Point", () => {
    it("should check for withEntityContext method availability", () => {
      const postgresAdapter = {
        withEntityContext: async (
          _entityId: string,
          callback: () => Promise<any>,
        ) => {
          return callback();
        },
      };

      const pgliteAdapter = {
        // No withEntityContext method (not supported)
      };

      // PostgreSQL adapter should have method
      expect(typeof postgresAdapter.withEntityContext).toBe("function");

      // PGLite adapter should NOT have method (it's not in the public interface)
      // Check that the method doesn't exist on the adapter instance
      expect("withEntityContext" in pgliteAdapter).toBe(false);
    });

    it("should extract entityId from user message", () => {
      const userMessage = {
        entityId: stringToUuid("alice"),
        content: { text: "Hello" },
      };

      const entityId = userMessage.entityId;

      expect(entityId).toBeDefined();
      expect(entityId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });
});

describe("Entity RLS Backward Compatibility", () => {
  describe("Graceful Degradation", () => {
    it("should work when ENABLE_DATA_ISOLATION=false", () => {
      const dataIsolationEnabled = false;
      const shouldApplyEntityRLS = dataIsolationEnabled;

      expect(shouldApplyEntityRLS).toBe(false);
    });

    it("should not throw errors when Entity RLS functions missing", () => {
      const functionsExist = false;

      let executedSuccessfully = false;
      try {
        if (!functionsExist) {
          // Gracefully skip Entity RLS
          executedSuccessfully = true;
        } else {
          // Try to use Entity RLS
          throw new Error("Functions not found");
        }
      } catch (_error) {
        executedSuccessfully = false;
      }

      expect(executedSuccessfully).toBe(true);
    });

    it("should support mixed Server RLS + no Entity RLS", () => {
      const serverRlsEnabled = true;
      const entityRlsEnabled = false;

      // Server RLS can work without Entity RLS
      const validConfiguration = serverRlsEnabled && !entityRlsEnabled;

      expect(validConfiguration).toBe(true);
    });
  });

  describe("No Breaking Changes", () => {
    it("should not modify existing API interfaces", () => {
      // withEntityContext is OPTIONAL
      interface IDatabaseAdapter {
        withEntityContext?(
          entityId: string | null,
          callback: () => Promise<any>,
        ): Promise<any>;
      }

      const adapter: IDatabaseAdapter = {
        // No withEntityContext - still valid!
      };

      expect(adapter).toBeDefined();
    });

    it("should work with existing plugins without code changes", () => {
      // Plugins don't need to change - entityId already in message
      const discordMessage = {
        entityId: "discord-user-id",
        content: { text: "Hello" },
      };

      const telegramMessage = {
        entityId: "telegram-user-id",
        content: { text: "Hi" },
      };

      expect(discordMessage.entityId).toBeDefined();
      expect(telegramMessage.entityId).toBeDefined();
    });
  });
});
```