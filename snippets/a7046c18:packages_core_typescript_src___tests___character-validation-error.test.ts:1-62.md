# a7046c18:packages_core_typescript_src___tests___character-validation-error.test.ts:1-62

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-validation-error.test.ts:1-62
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { parseCharacter } from "../character";
import type { Character } from "../types";

describe("Character Validation Error Handling", () => {
  it("should throw detailed error when character validation fails with issues", () => {
    const invalidCharacter = {
      // Missing required 'name' field
      bio: ["Test bio"],
      settings: {},
    };

    expect(() => {
      parseCharacter(invalidCharacter);
    }).toThrow("Character validation failed");
  });

  it("should throw error with error message when validation fails without issues", () => {
    const invalidCharacter = {
      name: 123, // Invalid type
      bio: ["Test bio"],
      settings: {},
    } as Partial<Character> as Character;

    expect(() => {
      parseCharacter(invalidCharacter);
    }).toThrow();
  });

  it("should handle validation error with unknown error format", () => {
    // This tests the fallback error message handling
    const invalidCharacter = {
      // Invalid structure that will fail validation
      name: null,
      bio: null,
    } as Partial<Character> as Character;

    expect(() => {
      parseCharacter(invalidCharacter);
    }).toThrow();
  });

  it("should throw error when given string path input", () => {
    expect(() => {
      parseCharacter("/path/to/character.json");
    }).toThrow("Character path provided but must be loaded first");
  });

  it("should throw error for null input", () => {
    // Testing error handling with null input - intentionally invalid
    expect(() => {
      parseCharacter(null as Character);
    }).toThrow();
  });

  it("should throw error for undefined input", () => {
    // Testing error handling with undefined input - intentionally invalid
    expect(() => {
      parseCharacter(undefined as Character);
    }).toThrow();
  });
});
```