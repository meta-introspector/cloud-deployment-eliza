# a7046c18:packages_core_typescript_src___tests___actions.test.ts:151-222

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/actions.test.ts:151-222
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  });

  describe("formatActionNames", () => {
    it("should format action names correctly", () => {
      const formatted = formatActionNames([mockActions[0], mockActions[1]]);
      expect(formatted).toMatch(/^(greet|farewell)(, (greet|farewell))?$/);
    });

    it("should handle single action", () => {
      const formatted = formatActionNames([mockActions[0]]);
      expect(formatted).toBe("greet");
    });

    it("should handle empty actions array", () => {
      const formatted = formatActionNames([]);
      expect(formatted).toBe("");
    });
  });

  describe("formatActions", () => {
    it("should format actions with descriptions", () => {
      const formatted = formatActions([mockActions[0]]);
      expect(formatted).toBe("- **greet**: Greet someone");
    });

    it("should include commas and newlines between multiple actions", () => {
      const formatted = formatActions([mockActions[0], mockActions[1]]);
      const parts = formatted.split("\n");
      expect(parts.length).toBe(2);
      expect(parts[0]).toMatch(/^- \*\*(greet|farewell)\*\*: /);
      expect(parts[1]).toMatch(/^- \*\*(greet|farewell)\*\*: /);
    });

    it("should handle empty actions array", () => {
      const formatted = formatActions([]);
      expect(formatted).toBe("");
    });
  });

  describe("Action Structure", () => {
    it("should validate action structure", () => {
      for (const action of mockActions) {
        expect(action).toHaveProperty("name");
        expect(action).toHaveProperty("description");
        expect(action).toHaveProperty("examples");
        expect(action).toHaveProperty("similes");
        expect(action).toHaveProperty("handler");
        expect(action).toHaveProperty("validate");
        expect(Array.isArray(action.examples)).toBe(true);
        expect(Array.isArray(action.similes)).toBe(true);
      }
    });

    it("should validate example structure", () => {
      for (const action of mockActions) {
        for (const example of action.examples ?? []) {
          for (const message of example) {
            expect(message).toHaveProperty("name");
            expect(message).toHaveProperty("content");
            expect(message.content).toHaveProperty("text");
          }
        }
      }
    });

    it("should have unique action names", () => {
      const names = mockActions.map((action) => action.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });
});
```