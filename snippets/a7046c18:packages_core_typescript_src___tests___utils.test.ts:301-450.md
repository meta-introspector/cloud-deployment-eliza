# a7046c18:packages_core_typescript_src___tests___utils.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      chunks.forEach((chunk) => {
        expect(chunk.length).toBeLessThanOrEqual(100 * 4);
      });
    });

    it("should handle very large chunk size", async () => {
      const text = "Small text that fits in one chunk";
      const chunks = await splitChunks(text, 10000, 100);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it("should verify chunk overlap behavior", async () => {
      // Create predictable text with clear boundaries
      const text = "A ".repeat(200) + "B ".repeat(200) + "C ".repeat(200);
      const chunkSize = 100; // Small chunks to ensure splitting
      const bleed = 20; // Overlap size

      const chunks = await splitChunks(text, chunkSize, bleed);

      // Should have multiple chunks
      expect(chunks.length).toBeGreaterThan(1);

      // Each chunk should respect the size limit (with char-to-token ratio)
      chunks.forEach((chunk) => {
        expect(chunk.length).toBeLessThanOrEqual(chunkSize * 4);
      });
    });
  });

  describe("trimTokens", () => {
    let mockRuntime: IAgentRuntime;

    beforeEach(() => {
      mockRuntime = {
        useModel: mock(async (type, params) => {
          if (type === "TEXT_TOKENIZER_ENCODE") {
            // Simple mock: each word is a token
            return params.prompt.split(" ");
          }
          if (type === "TEXT_TOKENIZER_DECODE") {
            // Simple mock: join tokens back
            return params.tokens.join(" ");
          }
          return null;
        }),
      } as Partial<IAgentRuntime> as IAgentRuntime;
    });

    it("should trim tokens to specified limit", async () => {
      const prompt = "one two three four five six seven eight nine ten";
      const result = await trimTokens(prompt, 5, mockRuntime);

      expect(result).toBe("six seven eight nine ten");
      expect(mockRuntime.useModel).toHaveBeenCalledTimes(2);
    });

    it("should return unchanged if within limit", async () => {
      const prompt = "short text";
      const result = await trimTokens(prompt, 10, mockRuntime);

      expect(result).toBe(prompt);
    });

    it("should throw error for invalid inputs", async () => {
      await expect(trimTokens("", 10, mockRuntime)).rejects.toThrow();
      await expect(trimTokens("text", 0, mockRuntime)).rejects.toThrow();
      await expect(trimTokens("text", -1, mockRuntime)).rejects.toThrow();
    });

    it("should skip tokenization for very short prompts", async () => {
      const prompt = "hi";
      const result = await trimTokens(prompt, 100, mockRuntime);

      expect(result).toBe(prompt);
      expect(mockRuntime.useModel).not.toHaveBeenCalled();
    });
  });

  describe("parseKeyValueXml", () => {
    it("should parse response XML blocks", () => {
      const xml = `<response>
                <name>TestAgent</name>
                <reasoning>Test reasoning</reasoning>
                <action>RESPOND</action>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        name: "TestAgent",
        reasoning: "Test reasoning",
        action: "RESPOND",
      });
    });

    it("should handle comma-separated lists for specific keys", () => {
      const xml = `<response>
                <actions>ACTION1,ACTION2,ACTION3</actions>
                <providers>PROVIDER1, PROVIDER2</providers>
                <evaluators>EVAL1, EVAL2</evaluators>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        actions: ["ACTION1", "ACTION2", "ACTION3"],
        providers: ["PROVIDER1", "PROVIDER2"],
        evaluators: ["EVAL1", "EVAL2"],
      });
    });

    it("should parse boolean values", () => {
      const xml =
        "<response><simple>true</simple><complex>false</complex></response>";

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        simple: true,
        complex: "false", // Only 'simple' key is treated as boolean
      });
    });

    it("should handle XML entities", () => {
      const xml =
        "<response><text>Value with &lt;tags&gt; &amp; entities</text></response>";

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        text: "Value with <tags> & entities",
      });
    });

    it("should return null for invalid XML", () => {
      expect(parseKeyValueXml("")).toBeNull();
      expect(parseKeyValueXml("not xml")).toBeNull();
      expect(parseKeyValueXml("<unclosed>")).toBeNull();
    });

    it("should handle any root tag name", () => {
      const xml = "<custom><key>value</key></custom>";
      const result = parseKeyValueXml(xml);
      expect(result).toEqual({ key: "value" });
    });

    it("should handle mismatched XML tags", () => {
      // This tests lines 393-395 - warning about mismatched tags
      const xml = "<response><start>value</end></response>";
      const result = parseKeyValueXml(xml);
      // Should still try to parse what it can
      expect(result).toBeNull();
```