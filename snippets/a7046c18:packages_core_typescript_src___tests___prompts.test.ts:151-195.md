# a7046c18:packages_core_typescript_src___tests___prompts.test.ts:151-195

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/prompts.test.ts:151-195
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        // Also check the main structural tags outside response blocks
        const mainTags = [
          "task",
          "providers",
          "instructions",
          "output",
          "keys",
          "actionNames",
        ];
        mainTags.forEach((tag) => {
          if (template.includes(`<${tag}>`)) {
            expect(template).toContain(`</${tag}>`);
          }
        });
      });
    });
  });

  describe("Template Placeholders", () => {
    it("should use consistent placeholder format", () => {
      const placeholderPattern = /\{\{[^}]+\}\}/g;

      const shouldRespondPlaceholders =
        shouldRespondTemplate.match(placeholderPattern) || [];
      const messageHandlerPlaceholders =
        messageHandlerTemplate.match(placeholderPattern) || [];
      const postCreationPlaceholders =
        postCreationTemplate.match(placeholderPattern) || [];

      // All placeholders should use double curly braces
      [
        ...shouldRespondPlaceholders,
        ...messageHandlerPlaceholders,
        ...postCreationPlaceholders,
      ].forEach((placeholder) => {
        expect(placeholder).toMatch(/^\{\{[^}]+\}\}$/);
      });

      // Common placeholders should be consistent across templates
      expect(shouldRespondPlaceholders).toContain("{{agentName}}");
      expect(messageHandlerPlaceholders).toContain("{{agentName}}");
      expect(postCreationPlaceholders).toContain("{{agentName}}");
    });
  });
});
```