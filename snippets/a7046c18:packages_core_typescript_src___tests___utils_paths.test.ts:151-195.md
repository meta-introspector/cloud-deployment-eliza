# a7046c18:packages_core_typescript_src___tests___utils_paths.test.ts:151-195

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/paths.test.ts:151-195
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    test("should return all paths in a single object", () => {
      const paths = getAllElizaPaths();

      expect(paths).toHaveProperty("dataDir");
      expect(paths).toHaveProperty("databaseDir");
      expect(paths).toHaveProperty("charactersDir");
      expect(paths).toHaveProperty("generatedDir");
      expect(paths).toHaveProperty("uploadsAgentsDir");
      expect(paths).toHaveProperty("uploadsChannelsDir");

      expect(paths.dataDir).toBe(getDataDir());
      expect(paths.databaseDir).toBe(getDatabaseDir());
      expect(paths.charactersDir).toBe(getCharactersDir());
      expect(paths.generatedDir).toBe(getGeneratedDir());
      expect(paths.uploadsAgentsDir).toBe(getUploadsAgentsDir());
      expect(paths.uploadsChannelsDir).toBe(getUploadsChannelsDir());
    });
  });

  describe("Singleton behavior", () => {
    test("should return the same instance", () => {
      const instance1 = getElizaPaths();
      const instance2 = getElizaPaths();

      expect(instance1).toBe(instance2);
    });

    test("should cache values between calls", () => {
      // First call
      const dir1 = getDataDir();

      // Change env (but don't reset)
      process.env.ELIZA_DATA_DIR = "/changed";

      // Should still return cached value
      const dir2 = getDataDir();
      expect(dir2).toBe(dir1);

      // After reset, should pick up new value
      resetPaths();
      const dir3 = getDataDir();
      expect(dir3).toBe("/changed");
    });
  });
});
```