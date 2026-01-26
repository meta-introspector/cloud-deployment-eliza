# a7046c18:packages_core_rust___tests___wasm_interop-equivalence.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/wasm/interop-equivalence.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        name: "TestAgent",
        system: "You are a helpful assistant.",
        bio: ["An AI assistant", "Helps users with tasks"],
        topics: ["general", "coding", "writing"],
        messageExamples: [],
        postExamples: [],
        settings: {},
      };

      const tsJson = JSON.stringify(character);
      const rustCharacter = wasm.parseCharacter(tsJson);
      const rustJson = rustCharacter.toJson();

      const tsObj = JSON.parse(tsJson);
      const rustObj = JSON.parse(rustJson);

      expect(rustObj.name).toBe(tsObj.name);
      expect(rustObj.system).toBe(tsObj.system);
    });

    it("should handle bio as string or array", () => {
      if (!wasm) return;

      // Bio as string
      const charWithStringBio: Character = {
        name: "Agent1",
        bio: "A simple bio" as unknown as string[],
        messageExamples: [],
        postExamples: [],
      };

      // Bio as array
      const charWithArrayBio: Character = {
        name: "Agent2",
        bio: ["Line 1", "Line 2"],
        messageExamples: [],
        postExamples: [],
      };

      // Both should parse successfully
      expect(() =>
        wasm.parseCharacter(JSON.stringify(charWithStringBio)),
      ).not.toThrow();
      expect(() =>
        wasm.parseCharacter(JSON.stringify(charWithArrayBio)),
      ).not.toThrow();
    });

    it("should pass round-trip test", () => {
      if (!wasm) return;

      const character: Character = {
        name: "TestAgent",
        system: "You are helpful",
        bio: ["Bio line 1", "Bio line 2"],
        topics: ["topic1", "topic2"],
        messageExamples: [],
        postExamples: [],
        settings: {
          model: "gpt-4",
          temperature: 0.7,
        },
      };

      expect(wasm.testCharacterRoundTrip(JSON.stringify(character))).toBe(true);
    });
  });

  describe("Content Serialization Equivalence", () => {
    it("should serialize Content with all fields", () => {
      if (!wasm) return;

      const memory: Memory = {
        entityId: "entity-123",
        roomId: "room-456",
        content: {
          text: "Hello",
          source: "test",
          url: "https://example.com",
          actions: ["action1", "action2"],
          metadata: { key: "value" },
          attachments: [{ type: "image", url: "https://..." }],
        },
      };

      const rustMemory = wasm.parseMemory(JSON.stringify(memory));
      const rustJson = rustMemory.toJson();
      const rustObj = JSON.parse(rustJson);

      expect(rustObj.content.text).toBe("Hello");
      expect(rustObj.content.source).toBe("test");
      expect(rustObj.content.url).toBe("https://example.com");
      expect(Array.isArray(rustObj.content.actions)).toBe(true);
    });
  });

  describe("Nested Object Equivalence", () => {
    it("should handle deeply nested structures", () => {
      if (!wasm) return;

      const character: Character = {
        name: "DeepAgent",
        messageExamples: [
          [
            {
              name: "user",
              content: { text: "Hello", metadata: { nested: { deep: true } } },
            },
            { name: "agent", content: { text: "Hi there!" } },
          ],
        ],
        postExamples: [],
        settings: {
          secrets: {
            API_KEY: "secret-value",
          },
          nested: {
            config: {
              option: true,
            },
          },
        },
      };

      const rustCharacter = wasm.parseCharacter(JSON.stringify(character));
      const rustJson = rustCharacter.toJson();
      const rustObj = JSON.parse(rustJson);

      expect(rustObj.name).toBe("DeepAgent");
      expect(rustObj.settings && rustObj.settings.secrets && rustObj.settings.secrets.API_KEY).toBe("secret-value");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty strings", () => {
      if (!wasm) return;

      const memory: Memory = {
        entityId: "entity-123",
        roomId: "room-456",
        content: { text: "" },
      };

      const rustMemory = wasm.parseMemory(JSON.stringify(memory));
      const rustObj = JSON.parse(rustMemory.toJson());

      expect(rustObj.content.text).toBe("");
    });

    it("should handle unicode characters", () => {
```