# a7046c18:packages_core_typescript_src___tests___parsing.test.ts:1-58

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/parsing.test.ts:1-58
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { parseBooleanFromText, parseJSONObjectFromText } from "../utils";

describe("Parsing Module", () => {
  describe("parseBooleanFromText", () => {
    it("should parse exact YES/NO matches", () => {
      expect(parseBooleanFromText("YES")).toBe(true);
      expect(parseBooleanFromText("NO")).toBe(false);
    });

    it("should handle case insensitive input", () => {
      expect(parseBooleanFromText("yes")).toBe(true);
      expect(parseBooleanFromText("no")).toBe(false);
    });

    it("should return null for invalid input", () => {
      expect(parseBooleanFromText("")).toBe(false);
      expect(parseBooleanFromText("maybe")).toBe(false);
      expect(parseBooleanFromText("YES NO")).toBe(false);
    });
  });

  describe("parseJSONObjectFromText", () => {
    it("should parse JSON object from code block", () => {
      const input = '```json\n{"key": "value", "number": 42}\n```';
      expect(parseJSONObjectFromText(input)).toEqual({
        key: "value",
        number: "42",
      });
    });

    it("should parse JSON object without code block", () => {
      const input = '{"key": "value", "number": 42}';
      expect(parseJSONObjectFromText(input)).toEqual({
        key: "value",
        number: "42",
      });
    });

    it("should parse JSON objects containing array values", () => {
      const input = '{"key": ["item1", "item2", "item3"]}';
      expect(parseJSONObjectFromText(input)).toEqual({
        key: ["item1", "item2", "item3"],
      });
    });

    it("should handle empty objects", () => {
      expect(parseJSONObjectFromText("```json\n{}\n```")).toEqual({});
      expect(parseJSONObjectFromText("{}")).toEqual({});
    });

    it("should return null for invalid JSON", () => {
      expect(parseJSONObjectFromText("invalid")).toBe(null);
      expect(parseJSONObjectFromText("{invalid}")).toBe(null);
      expect(parseJSONObjectFromText("```json\n{invalid}\n```")).toBe(null);
    });
  });
});
```