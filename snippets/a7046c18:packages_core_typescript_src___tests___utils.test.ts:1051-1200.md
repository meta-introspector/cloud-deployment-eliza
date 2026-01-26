# a7046c18:packages_core_typescript_src___tests___utils.test.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain("Bio: I am a helpful assistant");
      expect(result).toContain("Lore: Created to help with tasks");
      expect(result).toContain("Recent: Recent conversation history");
    });

    it("should handle State with array data", () => {
      const mockState: State = {
        userId: stringToUuid("user-123"),
        agentId: stringToUuid("agent-123"),
        roomId: stringToUuid("room-123"),
        bio: "Assistant bio",
        lore: "Assistant lore",
        senderName: "User",
        actors: "",
        actorsData: [
          {
            id: stringToUuid("actor-1"),
            names: ["Alice"],
            metadata: {},
            agentId: stringToUuid("agent-123"),
          },
          {
            id: stringToUuid("actor-2"),
            names: ["Bob"],
            metadata: {},
            agentId: stringToUuid("agent-123"),
          },
        ],
        recentMessagesData: [],
        values: {},
        data: {},
        text: "",
      };

      const template = "Actors: {{actors}}\nSender: {{senderName}}";

      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain("Sender: User");
      // actors field might be generated from actorsData
      expect(result).toBeDefined();
    });

    it("should handle missing properties in State", () => {
      const mockState: State = {
        userId: stringToUuid("user-123"),
        agentId: stringToUuid("agent-123"),
        roomId: stringToUuid("room-123"),
        bio: "",
        lore: "",
        senderName: "",
        actors: "",
        actorsData: [],
        recentMessagesData: [],
        values: {},
        data: {},
        text: "",
      };

      const template = "Bio: {{bio}}\nMissing: {{missingProp}}";

      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain("Bio: ");
      // Handlebars replaces missing values with empty string
      expect(result).toBe("Bio: \nMissing: ");
    });
  });

  describe("addHeader", () => {
    it("should add header to body", () => {
      const header = "# Title";
      const body = "This is the body content.";

      const result = addHeader(header, body);

      // addHeader adds only single newline between header and body, and adds newline at end
      expect(result).toBe("# Title\nThis is the body content.\n");
    });

    it("should handle empty header", () => {
      const header = "";
      const body = "Body content";

      const result = addHeader(header, body);

      // Empty header results in just body with newline at end
      expect(result).toBe("Body content\n");
    });

    it("should handle empty body", () => {
      const header = "Header";
      const body = "";

      const result = addHeader(header, body);

      // Empty body returns empty string regardless of header
      expect(result).toBe("");
    });

    it("should handle both empty", () => {
      const result = addHeader("", "");

      // Both empty returns empty string
      expect(result).toBe("");
    });

    it("should handle multiline header and body", () => {
      const header = "Line 1\nLine 2";
      const body = "Body line 1\nBody line 2";

      const result = addHeader(header, body);

      // Single newline between header and body, newline at end
      expect(result).toBe("Line 1\nLine 2\nBody line 1\nBody line 2\n");
    });
  });

  // we test this via composePrompt and composePromptFromState
  /*
  it('upgradeDoubleToTriple converts double braces to triple', () => {
    const tpl = 'Hello {{name}} and {{#if cond}}{{value}}{{/if}}';
    const out = upgradeDoubleToTriple(tpl);
    expect(out).toBe('Hello {{{name}}} and {{#if cond}}{{{value}}}{{/if}}');
  });
  */

  it("addHeader prepends header when body exists", () => {
    expect(addHeader("Head", "Body")).toBe("Head\nBody\n");
    expect(addHeader("Head", "")).toBe("");
  });

  // we test this via composePrompt and composePromptFromState
  /*
  it('composeRandomUser replaces placeholders', () => {
    const result = composeRandomUser('hi {{name1}} {{name2}}', 2);
    expect(result).not.toContain('{{');
  });
  */

  it("parseKeyValueXml parses simple xml block", () => {
    const xml =
      "<response><key>value</key><actions>a,b</actions><simple>true</simple></response>";
    const parsed = parseKeyValueXml(xml);
    expect(parsed).toEqual({ key: "value", actions: ["a", "b"], simple: true });
  });

  it("safeReplacer handles circular objects", () => {
```