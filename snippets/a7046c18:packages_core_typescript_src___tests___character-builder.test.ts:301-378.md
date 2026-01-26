# a7046c18:packages_core_typescript_src___tests___character-builder.test.ts:301-378

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-builder.test.ts:301-378
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(plugins).not.toContain(PLUGINS.OPENAI);
      expect(plugins).not.toContain(PLUGINS.ANTHROPIC);
    });

    it("should handle empty string environment variables", () => {
      testEnv.OPENAI_API_KEY = "";
      testEnv.ANTHROPIC_API_KEY = "";

      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.OLLAMA);
      expect(plugins).not.toContain(PLUGINS.OPENAI);
      expect(plugins).not.toContain(PLUGINS.ANTHROPIC);
    });

    it("should handle malformed Twitter credentials", () => {
      testEnv.TWITTER_API_KEY = "malformed";
      testEnv.TWITTER_API_SECRET_KEY = "";

      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.TWITTER);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty environment (only SQL, bootstrap, Ollama)", () => {
      const plugins = buildCharacterPlugins(testEnv);
      const expectedPlugins = [PLUGINS.SQL, PLUGINS.BOOTSTRAP, PLUGINS.OLLAMA];

      expect(plugins).toEqual(expectedPlugins);
    });

    it("should handle IGNORE_BOOTSTRAP with no AI providers", () => {
      testEnv.IGNORE_BOOTSTRAP = "true";

      const plugins = buildCharacterPlugins(testEnv);
      const expectedPlugins = [PLUGINS.SQL, PLUGINS.OLLAMA];

      expect(plugins).toEqual(expectedPlugins);
    });

    it("should ensure no duplicate plugins in any configuration", () => {
      testEnv.ANTHROPIC_API_KEY = "key";
      testEnv.OPENAI_API_KEY = "key";
      testEnv.GOOGLE_GENERATIVE_AI_API_KEY = "key";

      const plugins = buildCharacterPlugins(testEnv);
      const uniquePlugins = [...new Set(plugins)];

      expect(plugins.length).toBe(uniquePlugins.length);
    });

    it("should maintain consistent order across multiple calls", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENAI_API_KEY = "openai-key";
      testEnv.DISCORD_API_TOKEN = "discord-token";

      const plugins1 = buildCharacterPlugins(testEnv);
      const plugins2 = buildCharacterPlugins(testEnv);

      expect(plugins1).toEqual(plugins2);
    });

    it("should ensure SQL is always first", () => {
      // Test with various combinations
      const testCases = [
        { OPENAI_API_KEY: "key" },
        { ANTHROPIC_API_KEY: "key" },
        { OPENROUTER_API_KEY: "key", GOOGLE_GENERATIVE_AI_API_KEY: "key" },
        { ANTHROPIC_API_KEY: "key", OPENAI_API_KEY: "key" },
      ];

      testCases.forEach((envVars) => {
        const plugins = buildCharacterPlugins(envVars);
        expect(plugins[0]).toBe(PLUGINS.SQL);
      });
    });
  });
});
```