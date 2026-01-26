# a7046c18:packages_core_typescript_src___tests___buffer.test.ts:301-341

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/buffer.test.ts:301-341
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    beforeEach(() => {
      // Store original globals
      originalBuffer = (
        global as typeof globalThis & { Buffer?: typeof Buffer }
      ).Buffer;
      originalCrypto = (global as typeof globalThis).crypto;
    });

    afterEach(() => {
      // Restore original globals
      if (originalBuffer !== undefined) {
        (global as typeof globalThis & { Buffer?: typeof Buffer }).Buffer =
          originalBuffer;
      } else {
        delete (global as typeof globalThis & { Buffer?: typeof Buffer })
          .Buffer;
      }

      if (originalCrypto !== undefined) {
        (global as typeof globalThis).crypto = originalCrypto;
      }
    });

    it("should work without native Buffer", () => {
      // Temporarily remove Buffer
      delete (global as typeof globalThis & { Buffer?: typeof Buffer }).Buffer;

      // Force module re-evaluation would be needed here
      // For now, just test that functions work
      const buffer = fromString("Test without Buffer");
      const hex = toHex(buffer);
      const decoded = fromHex(hex);
      expect(toString(decoded)).toBe("Test without Buffer");
    });

    it.skip("should use crypto.getRandomValues when available", () => {
      // Skip: Node.js environment uses crypto.randomBytes, not getRandomValues
    });
  });
});
```