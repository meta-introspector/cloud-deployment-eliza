# a7046c18:packages_core_python_tests_test_character.py:151-205

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_character.py:151-205
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert result.plugins == ["plugin-1"]


class TestBuildCharacterPlugins:
    """Tests for build_character_plugins function."""

    def test_default_plugins(self) -> None:
        """Test building plugins with no env vars."""
        plugins = build_character_plugins({})
        assert "@elizaos/plugin-sql" in plugins
        assert "@elizaos/plugin-bootstrap" in plugins
        assert "@elizaos/plugin-ollama" in plugins  # Fallback

    def test_with_openai(self) -> None:
        """Test building plugins with OpenAI configured."""
        plugins = build_character_plugins({"OPENAI_API_KEY": "test-key"})
        assert "@elizaos/plugin-openai" in plugins
        assert "@elizaos/plugin-ollama" not in plugins  # No fallback needed

    def test_with_anthropic(self) -> None:
        """Test building plugins with Anthropic configured."""
        plugins = build_character_plugins({"ANTHROPIC_API_KEY": "test-key"})
        assert "@elizaos/plugin-anthropic" in plugins
        assert "@elizaos/plugin-ollama" not in plugins

    def test_with_discord(self) -> None:
        """Test building plugins with Discord configured."""
        plugins = build_character_plugins(
            {
                "DISCORD_API_TOKEN": "test-token",
                "OPENAI_API_KEY": "test-key",  # Need an LLM
            }
        )
        assert "@elizaos/plugin-discord" in plugins

    def test_ignore_bootstrap(self) -> None:
        """Test ignoring bootstrap plugin."""
        plugins = build_character_plugins({"IGNORE_BOOTSTRAP": "true"})
        assert "@elizaos/plugin-bootstrap" not in plugins

    def test_plugin_order(self) -> None:
        """Test that plugins are in correct order."""
        plugins = build_character_plugins(
            {
                "OPENAI_API_KEY": "key1",
                "ANTHROPIC_API_KEY": "key2",
                "DISCORD_API_TOKEN": "token",
            }
        )
        # Core plugins first
        assert plugins.index("@elizaos/plugin-sql") == 0
        # Anthropic (text-only) before OpenAI (embedding-capable)
        assert plugins.index("@elizaos/plugin-anthropic") < plugins.index("@elizaos/plugin-openai")
        # Platform plugins after LLM plugins
        assert plugins.index("@elizaos/plugin-discord") > plugins.index("@elizaos/plugin-openai")
```