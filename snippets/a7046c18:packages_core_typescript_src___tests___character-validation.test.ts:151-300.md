# a7046c18:packages_core_typescript_src___tests___character-validation.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-validation.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    test("should parse and validate valid JSON character", () => {
      const jsonString = JSON.stringify(validCharacter);
      const result = parseAndValidateCharacter(jsonString);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validCharacter);
    });

    test("should handle malformed JSON", () => {
      const malformedJson = '{ "name": "Test", "bio": "Test" '; // Missing closing brace
      const result = parseAndValidateCharacter(malformedJson);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Invalid JSON");
    });

    test("should handle JSON with invalid character data", () => {
      const invalidCharacterJson = JSON.stringify({ name: "", bio: "Invalid" });
      const result = parseAndValidateCharacter(invalidCharacterJson);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Character validation failed");
    });

    test("should handle empty JSON object", () => {
      const emptyJson = "{}";
      const result = parseAndValidateCharacter(emptyJson);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Character validation failed");
    });
  });

  describe("isValidCharacter", () => {
    test("should return true for valid character", () => {
      expect(isValidCharacter(validCharacter)).toBe(true);
    });

    test("should return false for invalid character", () => {
      const invalidCharacter = { name: "", bio: "Invalid" };
      expect(isValidCharacter(invalidCharacter)).toBe(false);
    });

    test("should return false for non-object input", () => {
      expect(isValidCharacter("string")).toBe(false);
      expect(isValidCharacter(null)).toBe(false);
      expect(isValidCharacter(undefined)).toBe(false);
      expect(isValidCharacter(123)).toBe(false);
    });
  });

  describe("Complex validation scenarios", () => {
    test("should validate character with complex knowledge array", () => {
      const characterWithComplexKnowledge = {
        name: "Knowledge Character",
        bio: "Testing knowledge validation",
        knowledge: [
          "simple/path.txt",
          { path: "path/with/config.txt", shared: false },
          { path: "shared/path.txt", shared: true },
          { directory: "knowledge/dir" },
          { directory: "shared/dir", shared: true },
        ],
      };
      const result = validateCharacter(characterWithComplexKnowledge);
      expect(result.success).toBe(true);
    });

    test("should validate character with complex message examples", () => {
      const characterWithComplexMessages = {
        name: "Message Character",
        bio: "Testing message validation",
        messageExamples: [
          [
            {
              name: "user",
              content: {
                text: "Hello, how are you?",
                source: "user",
              },
            },
            {
              name: "assistant",
              content: {
                text: "I am doing well, thank you!",
                source: "assistant",
                attachments: [
                  {
                    id: "attachment-1",
                    url: "https://example.com/file.txt",
                    title: "Additional Info",
                    description: "additional info",
                  },
                ],
              },
            },
          ],
          [
            {
              name: "user",
              content: { text: "What is the weather like?" },
            },
            {
              name: "assistant",
              content: {
                text: "I would need to check a weather service for current conditions.",
                url: "https://weather.example.com",
              },
            },
          ],
        ],
      };
      const result = validateCharacter(characterWithComplexMessages);
      expect(result.success).toBe(true);
    });

    test("should validate character with flexible settings", () => {
      const characterWithFlexibleSettings = {
        name: "Settings Character",
        bio: "Testing settings validation",
        settings: {
          temperature: 0.8,
          maxTokens: 2000,
          enableDebug: true,
          model: "gpt-4",
          customConfig: {
            nested: {
              deeply: {
                value: "test",
              },
            },
          },
          arrayValue: [1, 2, 3],
        },
        secrets: {
          apiKey: "sk-test123",
          secretNumber: 42,
          isEnabled: true,
        },
      };
      const result = validateCharacter(characterWithFlexibleSettings);
      expect(result.success).toBe(true);
    });
  });

  describe("Edge cases and error handling", () => {
    test("should handle null and undefined inputs", () => {
      expect(validateCharacter(null).success).toBe(false);
      expect(validateCharacter(undefined).success).toBe(false);
    });

    test("should handle non-object inputs", () => {
      expect(validateCharacter("string").success).toBe(false);
      expect(validateCharacter(123).success).toBe(false);
```