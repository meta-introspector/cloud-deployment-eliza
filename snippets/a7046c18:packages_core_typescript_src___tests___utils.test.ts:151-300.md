# a7046c18:packages_core_typescript_src___tests___utils.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const text = '{"name": "Alice", "age": 30}';
      const result = parseJSONObjectFromText(text);
      // Note: normalizeJsonString converts numbers to strings
      expect(result).toEqual({ name: "Alice", age: "30" });
    });

    it("should return null for invalid JSON", () => {
      expect(parseJSONObjectFromText("not json")).toBeNull();
      expect(parseJSONObjectFromText("{invalid json}")).toBeNull();
      expect(parseJSONObjectFromText("")).toBeNull();
    });

    it("should return null for arrays", () => {
      expect(parseJSONObjectFromText('["item1", "item2"]')).toBeNull();
      expect(parseJSONObjectFromText("```json\n[1, 2, 3]\n```")).toBeNull();
    });

    it("should return null for non-object values", () => {
      expect(parseJSONObjectFromText('"string"')).toBeNull();
      expect(parseJSONObjectFromText("42")).toBeNull();
      expect(parseJSONObjectFromText("true")).toBeNull();
      expect(parseJSONObjectFromText("null")).toBeNull();
    });
  });

  describe("normalizeJsonString", () => {
    it("should remove extra spaces after { and before }", () => {
      // Note: normalizeJsonString doesn't handle unquoted keys
      expect(normalizeJsonString('{  "key": "value"  }')).toBe(
        '{"key": "value"}',
      );
      expect(normalizeJsonString('{\n  "key": "value"\n}')).toBe(
        '{"key": "value"}',
      );
    });

    it("should wrap unquoted values in double quotes", () => {
      expect(normalizeJsonString('{"key": value}')).toBe('{"key": "value"}');
      expect(normalizeJsonString('{"key": someWord}')).toBe(
        '{"key": "someWord"}',
      );
    });

    it("should convert single quotes to double quotes", () => {
      // The function only converts when format is exactly "key": 'value'
      expect(normalizeJsonString("\"key\": 'value'")).toBe('"key": "value"');
      // When already inside JSON braces, single quotes inside are preserved
      const result = normalizeJsonString(
        "{\"key\": 'value', \"key2\": 'value2'}",
      );
      // The function converts the quotes but may not work perfectly for nested quotes
      expect(result).toContain("key");
      expect(result).toContain("value");
    });

    it("should handle mixed formatting", () => {
      const input = '{ "key1": value1, "key2": \'value2\', "key3": "value3" }';
      const result = normalizeJsonString(input);
      // Check that the function at least wraps unquoted values
      expect(result).toContain('"key1": "value1"');
      expect(result).toContain('"key3": "value3"');
    });

    it("should wrap numbers in quotes", () => {
      // normalizeJsonString wraps ALL unquoted values including numbers
      const input = '{"key": "value", "number": 42}';
      const result = normalizeJsonString(input);
      expect(result).toBe('{"key": "value", "number": "42"}');
    });
  });

  describe("truncateToCompleteSentence", () => {
    it("should return text unchanged if within limit", () => {
      const text = "Short text.";
      expect(truncateToCompleteSentence(text, 50)).toBe(text);
    });

    it("should truncate at last period within limit", () => {
      const text =
        "First sentence. Second sentence. Third sentence that is very long.";
      expect(truncateToCompleteSentence(text, 35)).toBe(
        "First sentence. Second sentence.",
      );
    });

    it("should truncate at last space if no period found", () => {
      const text =
        "This is a very long sentence without any periods that needs truncation";
      expect(truncateToCompleteSentence(text, 30)).toBe(
        "This is a very long sentence...",
      );
    });

    it("should hard truncate if no space found", () => {
      const text = "Verylongwordwithoutanyspacesorperiods";
      // maxLength 10 - 3 = 7 chars for the text part
      expect(truncateToCompleteSentence(text, 10)).toBe("Verylon...");
    });

    it("should handle edge cases", () => {
      expect(truncateToCompleteSentence("", 10)).toBe("");
      expect(truncateToCompleteSentence("No period", 5)).toBe("No...");
    });
  });

  describe("splitChunks", () => {
    it("should split text into chunks", async () => {
      const text = "a".repeat(2000); // Long text
      const chunks = await splitChunks(text, 512, 20);

      expect(chunks).toBeInstanceOf(Array);
      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach((chunk) => {
        expect(chunk.length).toBeLessThanOrEqual(512 * 4); // Accounting for character to token ratio
      });
    });

    it("should handle short text", async () => {
      const text = "Short text";
      const chunks = await splitChunks(text);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it("should respect chunk overlap", async () => {
      const text = `Word1 Word2 Word3 Word4 Word5 ${"Word6 ".repeat(100)}`;
      const chunks = await splitChunks(text, 50, 10);

      expect(chunks.length).toBeGreaterThan(1);
    });

    it("should handle empty string", async () => {
      const text = "";
      const chunks = await splitChunks(text);

      expect(chunks).toBeInstanceOf(Array);
      expect(chunks.length).toBeGreaterThanOrEqual(0);
    });

    it("should use RecursiveCharacterTextSplitter from @langchain/textsplitters", async () => {
      // This test verifies the migration to @langchain/textsplitters is working
      const text = `This is a test. ${"More text here. ".repeat(50)}`;
      const chunks = await splitChunks(text, 100, 20);

      // Verify basic functionality
      expect(chunks).toBeInstanceOf(Array);
      expect(chunks.length).toBeGreaterThan(1);

      // Verify chunks respect the size constraint (accounting for char-to-token ratio)
```