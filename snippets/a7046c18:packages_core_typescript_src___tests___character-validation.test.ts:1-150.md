# a7046c18:packages_core_typescript_src___tests___character-validation.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-validation.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, test } from "bun:test";
import {
  isValidCharacter,
  parseAndValidateCharacter,
  validateCharacter,
} from "../schemas/character";
import type { Character } from "../types/agent";

describe("Character Schema Validation", () => {
  const validCharacter: Character = {
    name: "Test Character",
    bio: "A test character for validation",
    messageExamples: [],
    postExamples: [],
    topics: ["AI", "Testing"],
    adjectives: ["helpful", "reliable"],
    knowledge: [],
    plugins: [],
    settings: {},
    style: {},
  };

  const minimalValidCharacter: Character = {
    name: "Minimal Character",
    bio: "Just the basics",
  };

  describe("validateCharacter", () => {
    test("should validate a complete valid character", () => {
      const result = validateCharacter(validCharacter);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validCharacter);
      expect(result.error).toBeUndefined();
    });

    test("should validate a minimal valid character", () => {
      const result = validateCharacter(minimalValidCharacter);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(minimalValidCharacter);
    });

    test("should reject character without name", () => {
      const invalidCharacter = { bio: "No name character" };
      const result = validateCharacter(invalidCharacter);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Character validation failed");
      expect(result.error?.issues).toBeDefined();
    });

    test("should reject character with empty name", () => {
      const invalidCharacter = { name: "", bio: "Empty name" };
      const result = validateCharacter(invalidCharacter);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Character validation failed");
    });

    test("should reject character without bio", () => {
      const invalidCharacter = { name: "No Bio Character" };
      const result = validateCharacter(invalidCharacter);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Character validation failed");
    });

    test("should accept bio as string array", () => {
      const characterWithArrayBio = {
        name: "Array Bio Character",
        bio: ["First line", "Second line", "Third line"],
      };
      const result = validateCharacter(characterWithArrayBio);
      expect(result.success).toBe(true);
    });

    test("should reject unknown properties in strict mode", () => {
      const characterWithExtra = {
        ...validCharacter,
        unknownProperty: "should be rejected",
        anotherUnknown: 123,
      };
      const result = validateCharacter(characterWithExtra);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Unrecognized key");
    });

    test("should validate optional fields correctly", () => {
      const characterWithOptionals = {
        name: "Optional Fields Character",
        bio: "Testing optional fields",
        username: "test_user",
        system: "Test system prompt",
        messageExamples: [
          [
            {
              name: "user",
              content: { text: "Hello" },
            },
            {
              name: "assistant",
              content: { text: "Hi there!" },
            },
          ],
        ],
        postExamples: ["Example post 1", "Example post 2"],
        topics: ["AI", "Testing", "Validation"],
        adjectives: ["helpful", "reliable", "intelligent"],
        knowledge: [
          "knowledge/file1.txt",
          { path: "knowledge/file2.txt", shared: true },
          { directory: "knowledge/shared", shared: true },
        ],
        plugins: ["plugin1", "plugin2"],
        settings: {
          temperature: 0.7,
          maxTokens: 1000,
          debug: true,
        },
        secrets: {
          apiKey: "secret-key",
          enabled: true,
        },
        style: {
          all: ["casual", "friendly"],
          chat: ["responsive", "helpful"],
          post: ["engaging", "informative"],
        },
      };
      const result = validateCharacter(characterWithOptionals);
      expect(result.success).toBe(true);
    });

    test("should validate UUID format for id field", () => {
      const characterWithValidUuid = {
        ...validCharacter,
        id: "123e4567-e89b-12d3-a456-426614174000",
      };
      const result = validateCharacter(characterWithValidUuid);
      expect(result.success).toBe(true);
    });

    test("should reject invalid UUID format for id field", () => {
      const characterWithInvalidUuid = {
        ...validCharacter,
        id: "invalid-uuid-format",
      };
      const result = validateCharacter(characterWithInvalidUuid);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Invalid UUID format");
    });
  });

  describe("parseAndValidateCharacter", () => {
```