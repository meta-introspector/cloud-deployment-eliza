# a7046c18:packages_core_typescript_src___tests___character-builder.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-builder.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(googleIndex).toBeGreaterThan(-1);
      expect(googleIndex).toBeGreaterThan(openrouterIndex);
    });

    it("should place embedding plugins before platform plugins", () => {
      testEnv.OPENAI_API_KEY = "openai-key";
      testEnv.DISCORD_API_TOKEN = "discord-token";

      const plugins = buildCharacterPlugins(testEnv);
      const openaiIndex = plugins.indexOf(PLUGINS.OPENAI);
      const discordIndex = plugins.indexOf(PLUGINS.DISCORD);

      expect(openaiIndex).toBeGreaterThan(-1);
      expect(discordIndex).toBeGreaterThan(-1);
      expect(discordIndex).toBeGreaterThan(openaiIndex);
    });

    it("should place platform plugins before bootstrap", () => {
      testEnv.DISCORD_API_TOKEN = "discord-token";

      const plugins = buildCharacterPlugins(testEnv);
      const discordIndex = plugins.indexOf(PLUGINS.DISCORD);
      const bootstrapIndex = plugins.indexOf(PLUGINS.BOOTSTRAP);

      expect(discordIndex).toBeGreaterThan(-1);
      expect(bootstrapIndex).toBeGreaterThan(-1);
      expect(bootstrapIndex).toBeGreaterThan(discordIndex);
    });
  });

  describe("Complex Environment Combinations", () => {
    it("should handle Anthropic + OpenAI correctly", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENAI_API_KEY = "openai-key";

      const plugins = buildCharacterPlugins(testEnv);
      const expectedOrder = [
        PLUGINS.SQL,
        PLUGINS.ANTHROPIC,
        PLUGINS.OPENAI,
        PLUGINS.BOOTSTRAP,
      ];

      expect(plugins).toEqual(expectedOrder);
    });

    it("should handle OpenRouter correctly (no Ollama)", () => {
      testEnv.OPENROUTER_API_KEY = "openrouter-key";

      const plugins = buildCharacterPlugins(testEnv);
      const expectedOrder = [
        PLUGINS.SQL,
        PLUGINS.OPENROUTER,
        PLUGINS.BOOTSTRAP,
      ];

      expect(plugins).toEqual(expectedOrder);
    });

    it("should handle all AI providers with correct ordering", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENROUTER_API_KEY = "openrouter-key";
      testEnv.OPENAI_API_KEY = "openai-key";
      testEnv.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";

      const plugins = buildCharacterPlugins(testEnv);

      // Text-only plugins should come first
      const anthropicIndex = plugins.indexOf(PLUGINS.ANTHROPIC);
      const openrouterIndex = plugins.indexOf(PLUGINS.OPENROUTER);

      // Embedding plugins should come after text-only
      const openaiIndex = plugins.indexOf(PLUGINS.OPENAI);
      const googleIndex = plugins.indexOf(PLUGINS.GOOGLE_GENAI);

      expect(anthropicIndex).toBeGreaterThan(-1);
      expect(openrouterIndex).toBeGreaterThan(-1);
      expect(openaiIndex).toBeGreaterThan(anthropicIndex);
      expect(openaiIndex).toBeGreaterThan(openrouterIndex);
      expect(googleIndex).toBeGreaterThan(anthropicIndex);
      expect(googleIndex).toBeGreaterThan(openrouterIndex);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
    });

    it("should handle platform plugins with AI providers", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENAI_API_KEY = "openai-key";
      testEnv.DISCORD_API_TOKEN = "discord-token";
      testEnv.TELEGRAM_BOT_TOKEN = "telegram-token";

      const plugins = buildCharacterPlugins(testEnv);

      // Platform plugins should be after AI plugins
      const discordIndex = plugins.indexOf(PLUGINS.DISCORD);
      const telegramIndex = plugins.indexOf(PLUGINS.TELEGRAM);
      const anthropicIndex = plugins.indexOf(PLUGINS.ANTHROPIC);
      const openaiIndex = plugins.indexOf(PLUGINS.OPENAI);

      expect(discordIndex).toBeGreaterThan(anthropicIndex);
      expect(telegramIndex).toBeGreaterThan(anthropicIndex);
      expect(discordIndex).toBeGreaterThan(openaiIndex);
      expect(telegramIndex).toBeGreaterThan(openaiIndex);
    });

    it("should handle Twitter plugin with all required tokens", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENAI_API_KEY = "openai-key";
      testEnv.TWITTER_API_KEY = "twitter-key";
      testEnv.TWITTER_API_SECRET_KEY = "twitter-secret";
      testEnv.TWITTER_ACCESS_TOKEN = "twitter-token";
      testEnv.TWITTER_ACCESS_TOKEN_SECRET = "twitter-token-secret";

      const plugins = buildCharacterPlugins(testEnv);

      expect(plugins).toContain(PLUGINS.TWITTER);

      const twitterIndex = plugins.indexOf(PLUGINS.TWITTER);
      const anthropicIndex = plugins.indexOf(PLUGINS.ANTHROPIC);
      const openaiIndex = plugins.indexOf(PLUGINS.OPENAI);

      expect(twitterIndex).toBeGreaterThan(anthropicIndex);
      expect(twitterIndex).toBeGreaterThan(openaiIndex);
    });

    it("should NOT include Twitter plugin with incomplete tokens", () => {
      testEnv.TWITTER_API_KEY = "twitter-key";
      // Missing other required Twitter tokens

      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.TWITTER);
    });
  });

  describe("Error Handling", () => {
    it("should trim and accept keys with surrounding whitespace", () => {
      testEnv.OPENAI_API_KEY = "  valid-key  ";
      testEnv.ANTHROPIC_API_KEY = "\tvalid-key\n";

      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.OPENAI);
      expect(plugins).toContain(PLUGINS.ANTHROPIC);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
    });

    it("should handle whitespace-only environment variables", () => {
      testEnv.OPENAI_API_KEY = "   ";
      testEnv.ANTHROPIC_API_KEY = "\t\n";

      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.OLLAMA);
```