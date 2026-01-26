# a7046c18:packages_core_typescript_src___tests___character-validation.test.ts:301-316

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-validation.test.ts:301-316
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(validateCharacter([]).success).toBe(false);
    });

    test("should provide detailed error information", () => {
      const invalidCharacter = {
        name: "", // Invalid: empty string
        bio: 123, // Invalid: should be string or string[]
        messageExamples: "invalid", // Invalid: should be array
      };
      const result = validateCharacter(invalidCharacter);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toBeDefined();
      expect(result.error?.issues?.length).toBeGreaterThan(0);
    });
  });
});
```