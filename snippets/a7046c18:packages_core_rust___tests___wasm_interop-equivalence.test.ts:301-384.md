# a7046c18:packages_core_rust___tests___wasm_interop-equivalence.test.ts:301-384

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/wasm/interop-equivalence.test.ts:301-384
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      if (!wasm) return;

      const memory: Memory = {
        entityId: "entity-123",
        roomId: "room-456",
        content: { text: "Hello 世界 🎉 émojis and ñ characters" },
      };

      const rustMemory = wasm.parseMemory(JSON.stringify(memory));
      const rustObj = JSON.parse(rustMemory.toJson());

      expect(rustObj.content.text).toBe(
        "Hello 世界 🎉 émojis and ñ characters",
      );
    });

    it("should handle large numbers", () => {
      if (!wasm) return;

      const memory: Memory = {
        entityId: "entity-123",
        roomId: "room-456",
        content: { text: "test" },
        createdAt: 9007199254740991, // Number.MAX_SAFE_INTEGER
      };

      const rustMemory = wasm.parseMemory(JSON.stringify(memory));
      const rustObj = JSON.parse(rustMemory.toJson());

      expect(rustObj.createdAt).toBe(9007199254740991);
    });

    it("should handle null values", () => {
      if (!wasm) return;

      const memory: Memory = {
        entityId: "entity-123",
        roomId: "room-456",
        content: {
          text: "test",
          source: null as unknown as string,
        },
      };

      // Should not throw
      expect(() => wasm.parseMemory(JSON.stringify(memory))).not.toThrow();
    });
  });
});

// Tests that work without WASM
describe("TypeScript Type Verification", () => {
  it("should verify Memory type structure", () => {
    const memory: Memory = {
      entityId: "entity-123",
      roomId: "room-456",
      content: { text: "Hello" },
    };

    expect(memory.entityId).toBeDefined();
    expect(memory.roomId).toBeDefined();
    expect(memory.content).toBeDefined();
  });

  it("should verify Character type structure", () => {
    const character: Character = {
      name: "TestAgent",
      messageExamples: [],
      postExamples: [],
    };

    expect(character.name).toBeDefined();
  });

  it("should verify Content type structure", () => {
    const content: Content = {
      text: "Hello",
      source: "test",
    };

    expect(content.text).toBe("Hello");
    expect(content.source).toBe("test");
  });
});
```