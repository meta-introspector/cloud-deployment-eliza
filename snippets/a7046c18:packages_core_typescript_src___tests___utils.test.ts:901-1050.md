# a7046c18:packages_core_typescript_src___tests___utils.test.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3],
        e: null,
        f: "string",
      };

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toBe(JSON.stringify(obj)); // Should be identical
      expect(result).not.toContain("[Circular]");
    });

    it("should handle nested circular references", () => {
      interface NestedCircularObject {
        level1: {
          level2: {
            level3: {
              back?: NestedCircularObject["level1"];
            };
          };
        };
      }
      const obj: NestedCircularObject = {
        level1: {
          level2: {
            level3: {},
          },
        },
      };
      obj.level1.level2.level3.back = obj.level1; // Circular reference

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toContain("[Circular]");
      expect(() => JSON.stringify(obj, replacer)).not.toThrow();
    });

    it("should handle arrays with circular references", () => {
      interface CircularArrayItem {
        arr?: CircularArrayItem[];
        value?: string;
      }
      const arr: (number | CircularArrayItem)[] = [1, 2, 3];
      const obj: CircularArrayItem = { arr, value: "test" };
      arr.push(obj); // Circular reference through array

      const replacer = safeReplacer();
      const result = JSON.stringify({ data: arr }, replacer);

      expect(result).toContain("[Circular]");
      expect(result).toContain("1");
      expect(result).toContain("2");
      expect(result).toContain("3");
    });
  });

  describe("composePrompt", () => {
    it("should compose prompt with state values", () => {
      const state = {
        name: "Alice",
        role: "developer",
        task: "write tests",
      };
      const template = "Hello {{name}}, as a {{role}}, please {{task}}.";

      const result = composePrompt({ state, template });

      expect(result).toBe("Hello Alice, as a developer, please write tests.");
    });

    it("should handle missing state values", () => {
      const state = {
        name: "Bob",
      };
      const template = "Hello {{name}}, your role is {{role}}.";

      const result = composePrompt({ state, template });

      // Handlebars replaces missing values with empty string
      expect(result).toBe("Hello Bob, your role is .");
    });

    it("should handle empty state", () => {
      const state = {};
      const template = "Template with {{placeholder}}.";

      const result = composePrompt({ state, template });

      // Handlebars replaces missing values with empty string
      expect(result).toBe("Template with .");
    });

    it("should handle multiple occurrences of same placeholder", () => {
      const state = {
        word: "test",
      };
      const template = "{{word}} {{word}} {{word}}";

      const result = composePrompt({ state, template });

      expect(result).toBe("test test test");
    });
  });

  describe("composePromptFromState", () => {
    it("should compose prompt from State object", () => {
      const mockState: State = {
        // Required State properties
        userId: stringToUuid("user-123"),
        agentId: stringToUuid("agent-123"),
        roomId: stringToUuid("room-123"),
        bio: "I am a helpful assistant",
        lore: "Created to help with tasks",
        senderName: "Assistant",
        actors: "user123",
        actorsData: [
          {
            id: stringToUuid("actor-1"),
            names: ["John"],
            metadata: {},
            agentId: stringToUuid("agent-123"),
          },
        ],
        // Template values
        recentMessages: "Recent conversation history",
        relevantKnowledge: "Relevant facts",
        recentMessagesData: [
          {
            id: stringToUuid("msg-1"),
            entityId: stringToUuid("entity-1"),
            roomId: stringToUuid("room-123"),
            createdAt: Date.now(),
            content: {
              text: "Hello",
              source: "chat",
            } as Content,
          },
        ],
        // Additional required State properties
        values: {},
        data: {},
        text: "",
      };

      const template =
        "Bio: {{bio}}\nLore: {{lore}}\nRecent: {{recentMessages}}";

```