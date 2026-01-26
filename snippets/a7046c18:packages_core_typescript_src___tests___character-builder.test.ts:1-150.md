# a7046c18:packages_core_typescript_src___tests___character-builder.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/character-builder.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it } from "bun:test";
import { buildCharacterPlugins } from "../character";

describe("buildCharacterPlugins", () => {
  // Plugin name constants for better maintainability
  const PLUGINS = {
    SQL: "@elizaos/plugin-sql",
    BOOTSTRAP: "@elizaos/plugin-bootstrap",
    OLLAMA: "@elizaos/plugin-ollama",
    ANTHROPIC: "@elizaos/plugin-anthropic",
    OPENAI: "@elizaos/plugin-openai",
    OPENROUTER: "@elizaos/plugin-openrouter",
    GOOGLE_GENAI: "@elizaos/plugin-google-genai",
    DISCORD: "@elizaos/plugin-discord",
    TWITTER: "@elizaos/plugin-twitter",
    TELEGRAM: "@elizaos/plugin-telegram",
  };

  let testEnv: Record<string, string | undefined>;

  beforeEach(() => {
    // Start with clean environment for each test
    testEnv = {};
  });

  describe("Core Plugin Ordering", () => {
    it("should always include SQL plugin first", () => {
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins[0]).toBe(PLUGINS.SQL);
    });

    it("should include bootstrap plugin by default (not ignored)", () => {
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.BOOTSTRAP);
    });

    it('should exclude bootstrap plugin when IGNORE_BOOTSTRAP="true"', () => {
      testEnv.IGNORE_BOOTSTRAP = "true";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.BOOTSTRAP);
    });

    it('should exclude bootstrap plugin when IGNORE_BOOTSTRAP="1"', () => {
      testEnv.IGNORE_BOOTSTRAP = "1";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.BOOTSTRAP);
    });

    it('should exclude bootstrap plugin when IGNORE_BOOTSTRAP="yes"', () => {
      testEnv.IGNORE_BOOTSTRAP = "yes";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.BOOTSTRAP);
    });

    it('should INCLUDE bootstrap plugin when IGNORE_BOOTSTRAP="false" (common mistake)', () => {
      testEnv.IGNORE_BOOTSTRAP = "false";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.BOOTSTRAP);
    });

    it('should INCLUDE bootstrap plugin when IGNORE_BOOTSTRAP="0"', () => {
      testEnv.IGNORE_BOOTSTRAP = "0";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.BOOTSTRAP);
    });

    it('should INCLUDE bootstrap plugin when IGNORE_BOOTSTRAP="no"', () => {
      testEnv.IGNORE_BOOTSTRAP = "no";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.BOOTSTRAP);
    });

    it("should handle case-insensitive IGNORE_BOOTSTRAP values", () => {
      testEnv.IGNORE_BOOTSTRAP = "TRUE";
      const plugins1 = buildCharacterPlugins(testEnv);
      expect(plugins1).not.toContain(PLUGINS.BOOTSTRAP);

      testEnv.IGNORE_BOOTSTRAP = "Yes";
      const plugins2 = buildCharacterPlugins(testEnv);
      expect(plugins2).not.toContain(PLUGINS.BOOTSTRAP);
    });
  });

  describe("Ollama Fallback Behavior", () => {
    it("should include Ollama when no LLM providers are configured", () => {
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).toContain(PLUGINS.OLLAMA);
    });

    it("should NOT include Ollama when OpenAI is available", () => {
      testEnv.OPENAI_API_KEY = "test-key";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
      expect(plugins).toContain(PLUGINS.OPENAI);
    });

    it("should NOT include Ollama when Anthropic is available", () => {
      testEnv.ANTHROPIC_API_KEY = "test-key";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
      expect(plugins).toContain(PLUGINS.ANTHROPIC);
    });

    it("should NOT include Ollama when Google GenAI is available", () => {
      testEnv.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
      expect(plugins).toContain(PLUGINS.GOOGLE_GENAI);
    });

    it("should NOT include Ollama when only text-only providers are available", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENROUTER_API_KEY = "openrouter-key";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
      expect(plugins).toContain(PLUGINS.ANTHROPIC);
      expect(plugins).toContain(PLUGINS.OPENROUTER);
    });

    it("should NOT include Ollama when OpenRouter is available", () => {
      testEnv.OPENROUTER_API_KEY = "test-key";
      const plugins = buildCharacterPlugins(testEnv);
      expect(plugins).not.toContain(PLUGINS.OLLAMA);
      expect(plugins).toContain(PLUGINS.OPENROUTER);
    });
  });

  describe("Plugin Priority Ordering", () => {
    it("should place text-only plugins before embedding-capable plugins", () => {
      testEnv.ANTHROPIC_API_KEY = "anthropic-key";
      testEnv.OPENAI_API_KEY = "openai-key";

      const plugins = buildCharacterPlugins(testEnv);
      const anthropicIndex = plugins.indexOf(PLUGINS.ANTHROPIC);
      const openaiIndex = plugins.indexOf(PLUGINS.OPENAI);

      expect(anthropicIndex).toBeGreaterThan(-1);
      expect(openaiIndex).toBeGreaterThan(-1);
      expect(openaiIndex).toBeGreaterThan(anthropicIndex);
    });

    it("should place Google Generative AI after text-only plugins", () => {
      testEnv.OPENROUTER_API_KEY = "openrouter-key";
      testEnv.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";

      const plugins = buildCharacterPlugins(testEnv);
      const openrouterIndex = plugins.indexOf(PLUGINS.OPENROUTER);
      const googleIndex = plugins.indexOf(PLUGINS.GOOGLE_GENAI);

      expect(openrouterIndex).toBeGreaterThan(-1);
```