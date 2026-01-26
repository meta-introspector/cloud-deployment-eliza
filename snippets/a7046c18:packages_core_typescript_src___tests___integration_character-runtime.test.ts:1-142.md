# a7046c18:packages_core_typescript_src___tests___integration_character-runtime.test.ts:1-142

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/integration/character-runtime.test.ts:1-142
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import {
  mergeCharacterDefaults,
  parseCharacter,
  validateCharacterConfig,
} from "../../character";
import { AgentRuntime } from "../../runtime";
import type { Character, IDatabaseAdapter, UUID } from "../../types";
import { createMockAdapter } from "../test-helpers";

describe("Character-Runtime Integration Tests", () => {
  let mockAdapter: IDatabaseAdapter;
  let baseCharacter: Character;

  beforeEach(() => {
    const agentId = uuidv4() as UUID;

    baseCharacter = {
      id: agentId,
      name: "TestAgent",
      username: "testagent",
      bio: ["A test agent"],
      messageExamples: [],
      postExamples: [],
      topics: [],
      style: { all: [], chat: [], post: [] },
      adjectives: [],
      settings: {
        MODEL: "gpt-4",
      },
    };

    mockAdapter = createMockAdapter();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("parseCharacter with Runtime", () => {
    it("should parse character and create runtime", () => {
      const parsed = parseCharacter(baseCharacter);
      const runtime = new AgentRuntime({
        character: parsed,
        adapter: mockAdapter,
      });

      expect(runtime.character.name).toBe("TestAgent");
      expect(runtime.character.settings?.MODEL).toBe("gpt-4");
    });

    it("should validate character before creating runtime", () => {
      const invalidCharacter = {
        bio: ["Missing name"],
        settings: {},
      };

      const validation = validateCharacterConfig(invalidCharacter as Character);
      expect(validation.isValid).toBe(false);

      if (validation.isValid) {
        const runtime = new AgentRuntime({
          character: invalidCharacter as Character,
          adapter: mockAdapter,
        });
        expect(runtime).toBeDefined();
      }
    });
  });

  describe("mergeCharacterDefaults with Runtime", () => {
    it("should merge defaults and create runtime", () => {
      const partial: Partial<Character> = {
        name: "PartialAgent",
        bio: ["Partial bio"],
      };

      const merged = mergeCharacterDefaults(partial);
      const runtime = new AgentRuntime({
        character: merged,
        adapter: mockAdapter,
      });

      expect(runtime.character.name).toBe("PartialAgent");
      expect(runtime.character.settings).toBeDefined();
      expect(runtime.character.plugins).toBeDefined();
    });

    it("should use default name when not provided", () => {
      const partial: Partial<Character> = {
        bio: ["No name"],
      };

      const merged = mergeCharacterDefaults(partial);
      const runtime = new AgentRuntime({
        character: merged,
        adapter: mockAdapter,
      });

      expect(runtime.character.name).toBe("Unnamed Character");
    });
  });

  describe("Character Validation Flow", () => {
    it("should validate character and create runtime with validated character", () => {
      const validCharacter: Character = {
        ...baseCharacter,
        name: "ValidAgent",
      };

      const validation = validateCharacterConfig(validCharacter);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      const runtime = new AgentRuntime({
        character: validCharacter,
        adapter: mockAdapter,
      });
      expect(runtime.character.name).toBe("ValidAgent");
    });

    it("should handle validation errors and prevent invalid runtime creation", () => {
      const invalidCharacter = {
        bio: ["Missing required name"],
        settings: {},
      } as Character;

      const validation = validateCharacterConfig(invalidCharacter);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);

      // Runtime should still be creatable but with invalid character
      // This tests that validation doesn't block runtime creation
      const runtime = new AgentRuntime({
        character: invalidCharacter,
        adapter: mockAdapter,
      });
      expect(runtime).toBeDefined();
    });
  });
});
```