# a7046c18:packages_core_python_elizaos_character.py:151-242

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/character.py:151-242
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    defaults: dict[str, Any] = {
        "settings": {},
        "plugins": [],
        "bio": [],
    }

    merged = {**defaults, **char}
    if not merged.get("name"):
        merged["name"] = "Unnamed Character"

    return Character(**merged)


def build_character_plugins(env: dict[str, str | None] | None = None) -> list[str]:
    """
    Build ordered plugin list based on available environment variables.

    Plugin loading order:
    1. Core plugins (@elizaos/plugin-sql)
    2. Text-only LLM plugins (no embedding support)
    3. Embedding-capable LLM plugins
    4. Platform plugins (Discord, Twitter, Telegram)
    5. Bootstrap plugin (unless IGNORE_BOOTSTRAP is set)
    6. Ollama fallback (only if no other LLM providers configured)

    Args:
        env: Environment dictionary (defaults to os.environ)

    Returns:
        Ordered list of plugin names
    """
    if env is None:
        env = dict(os.environ)

    def get_env(key: str) -> str | None:
        value = env.get(key)
        if value:
            return value.strip() if isinstance(value, str) else value
        return None

    plugins: list[str] = [
        # Core plugins first
        "@elizaos/plugin-sql",
    ]

    # Text-only plugins (no embedding support)
    if get_env("ANTHROPIC_API_KEY"):
        plugins.append("@elizaos/plugin-anthropic")
    if get_env("OPENROUTER_API_KEY"):
        plugins.append("@elizaos/plugin-openrouter")

    # Embedding-capable plugins
    if get_env("OPENAI_API_KEY"):
        plugins.append("@elizaos/plugin-openai")
    if get_env("GOOGLE_GENERATIVE_AI_API_KEY"):
        plugins.append("@elizaos/plugin-google-genai")

    # Platform plugins
    if get_env("DISCORD_API_TOKEN"):
        plugins.append("@elizaos/plugin-discord")
    if all(
        get_env(key)
        for key in [
            "TWITTER_API_KEY",
            "TWITTER_API_SECRET_KEY",
            "TWITTER_ACCESS_TOKEN",
            "TWITTER_ACCESS_TOKEN_SECRET",
        ]
    ):
        plugins.append("@elizaos/plugin-twitter")
    if get_env("TELEGRAM_BOT_TOKEN"):
        plugins.append("@elizaos/plugin-telegram")

    # Bootstrap plugin
    ignore_bootstrap = get_env("IGNORE_BOOTSTRAP")
    if not ignore_bootstrap or ignore_bootstrap.lower() not in ("true", "1", "yes"):
        plugins.append("@elizaos/plugin-bootstrap")

    # Ollama fallback (only if no other LLM providers configured)
    has_llm_provider = any(
        get_env(key)
        for key in [
            "ANTHROPIC_API_KEY",
            "OPENROUTER_API_KEY",
            "OPENAI_API_KEY",
            "GOOGLE_GENERATIVE_AI_API_KEY",
        ]
    )
    if not has_llm_provider:
        plugins.append("@elizaos/plugin-ollama")

    return plugins
```