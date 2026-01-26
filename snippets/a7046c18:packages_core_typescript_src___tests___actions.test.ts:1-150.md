# a7046c18:packages_core_typescript_src___tests___actions.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/actions.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import {
  composeActionExamples,
  formatActionNames,
  formatActions,
} from "../actions";
import type { Action } from "../types";

describe("Actions", () => {
  const mockActions: Action[] = [
    {
      name: "greet",
      description: "Greet someone",
      examples: [
        [
          { name: "name1", content: { text: "Hello {{name2}}!" } },
          {
            name: "name2",
            content: { text: "Hi {{name1}}!", action: "wave" },
          },
        ],
        [
          {
            name: "name1",
            content: { text: "Hey {{name2}}, how are you?" },
          },
          {
            name: "name2",
            content: { text: "I'm good {{name1}}, thanks!" },
          },
        ],
      ],
      similes: ["say hi", "welcome"],
      handler: async () => {
        throw new Error("Not implemented");
      },
      validate: async () => {
        throw new Error("Not implemented");
      },
    },
    {
      name: "farewell",
      description: "Say goodbye",
      examples: [
        [
          { name: "name1", content: { text: "Goodbye {{name2}}!" } },
          { name: "name2", content: { text: "Bye {{name1}}!" } },
        ],
      ],
      similes: ["say bye", "leave"],
      handler: async () => {
        throw new Error("Not implemented");
      },
      validate: async () => {
        throw new Error("Not implemented");
      },
    },
    {
      name: "help",
      description: "Get assistance",
      examples: [
        [
          {
            name: "name1",
            content: { text: "Can you help me {{name2}}?" },
          },
          {
            name: "name2",
            content: {
              text: "Of course {{name1}}, what do you need?",
              action: "assist",
            },
          },
        ],
      ],
      similes: ["assist", "support"],
      handler: async () => {
        throw new Error("Not implemented");
      },
      validate: async () => {
        throw new Error("Not implemented");
      },
    },
  ];

  describe("composeActionExamples", () => {
    it("should generate examples with correct format", () => {
      const examples = composeActionExamples(mockActions, 1);
      const lines = examples.trim().split("\n");
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0]).toMatch(/^name\d: .+/);
    });

    it("should replace name placeholders with generated names", () => {
      const examples = composeActionExamples(mockActions, 1);
      expect(examples).not.toContain("{{name1}}");
      expect(examples).not.toContain("{{name2}}");
    });

    it("should handle empty actions array", () => {
      const examples = composeActionExamples([], 5);
      expect(examples).toBe("");
    });

    it("should handle count larger than available examples", () => {
      const examples = composeActionExamples(mockActions, 10);
      expect(examples.length).toBeGreaterThan(0);
    });

    it("should handle actions without examples", () => {
      const actionsWithoutExamples: Action[] = [
        {
          name: "test",
          description: "Test action without examples",
          examples: [], // Empty examples array
          similes: [],
          handler: async () => {
            throw new Error("Not implemented");
          },
          validate: async () => {
            throw new Error("Not implemented");
          },
        },
        {
          name: "test2",
          description: "Test action with no examples property",
          // examples property not defined
          similes: [],
          handler: async () => {
            throw new Error("Not implemented");
          },
          validate: async () => {
            throw new Error("Not implemented");
          },
        } as Action,
      ];

      const examples = composeActionExamples(actionsWithoutExamples, 5);
      expect(examples).toBe("");
    });

    it("should handle count of zero", () => {
      const examples = composeActionExamples(mockActions, 0);
      expect(examples).toBe("");
    });

    it("should handle negative count", () => {
      const examples = composeActionExamples(mockActions, -5);
      expect(examples).toBe("");
    });
```