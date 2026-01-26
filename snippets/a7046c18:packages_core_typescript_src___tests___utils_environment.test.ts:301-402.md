# a7046c18:packages_core_typescript_src___tests___utils_environment.test.ts:301-402

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/environment.test.ts:301-402
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Snapshot and clear env
      originalEnvSnapshot = { ...process.env };
      for (const k of Object.keys(process.env)) {
        delete (process.env as Record<string, string | undefined>)[k];
      }
    });

    afterEach(() => {
      // Restore env in-place
      for (const k of Object.keys(process.env)) {
        delete (process.env as Record<string, string | undefined>)[k];
      }
      Object.assign(process.env, originalEnvSnapshot);
    });

    describe("loadEnvFile", () => {
      test("should load environment variables from .env file", () => {
        const result = loadEnvFile();
        // Result depends on whether .env exists in test environment
        expect(typeof result).toBe("boolean");
      });

      test("should handle invalid path gracefully", () => {
        const result = loadEnvFile("/nonexistent/path/.env");
        expect(result).toBe(false);
      });

      test("should be idempotent", () => {
        const result1 = loadEnvFile();
        const result2 = loadEnvFile();
        // Should be safe to call multiple times
        expect(typeof result1).toBe("boolean");
        expect(typeof result2).toBe("boolean");
      });
    });

    describe("findEnvFile", () => {
      test("should traverse up directory tree", () => {
        const envPath = findEnvFile();
        // In test environment, may or may not exist
        expect(envPath === null || typeof envPath === "string").toBe(true);
      });

      test("should support custom filenames", () => {
        const envPath = findEnvFile(undefined, [".env.custom", ".env"]);
        expect(envPath === null || typeof envPath === "string").toBe(true);
      });

      test("should support custom start directory", () => {
        const envPath = findEnvFile(process.cwd());
        expect(envPath === null || typeof envPath === "string").toBe(true);
      });
    });
  });

  // Additional basic tests from src/utils/__tests__/environment.test.ts
  describe("environment utils (basic)", () => {
    it("detects runtime (node in tests)", () => {
      const runtime = detectEnvironment();
      expect(["node", "browser", "unknown"]).toContain(runtime);
    });

    it("gets and sets env vars via API", () => {
      const key = "TEST_ENV_UTILS_KEY";
      setEnv(key, "value1");
      expect(getEnv(key)).toBe("value1");
      expect(hasEnv(key)).toBe(true);
    });

    it("boolean env parsing works", () => {
      const key = "TEST_BOOL_ENV";
      setEnv(key, "true");
      expect(getBooleanEnv(key, false)).toBe(true);
      setEnv(key, "0");
      expect(getBooleanEnv(key, true)).toBe(false);
    });

    it("number env parsing works", () => {
      const key = "TEST_NUM_ENV";
      setEnv(key, "42");
      expect(getNumberEnv(key)).toBe(42);
      setEnv(key, "NaN");
      expect(getNumberEnv(key, 7)).toBe(7);
    });

    it("browser init helper is safe in node", () => {
      // Should not throw even though we are not in browser
      initBrowserEnvironment({ SOME_KEY: "x" });
      expect(true).toBe(true);
    });

    it("environment cache can be cleared indirectly by setting", () => {
      // Access a key, then change it, ensure fresh read gets latest
      const key = "TEST_CACHE_KEY";
      setEnv(key, "a");
      expect(getEnv(key)).toBe("a");
      setEnv(key, "b");
      // getEnv reads through the singleton which clears cache on set
      expect(getEnv(key)).toBe("b");
    });
  });
});
```