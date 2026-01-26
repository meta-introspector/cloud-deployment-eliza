# a7046c18:packages_core_python_tests_test_runtime.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_runtime.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""Tests for AgentRuntime."""

import pytest

from elizaos.runtime import AgentRuntime
from elizaos.types import (
    Action,
    ActionResult,
    Character,
    Evaluator,
    Memory,
    Plugin,
    Provider,
    ProviderResult,
    State,
    as_uuid,
)


@pytest.fixture
def character() -> Character:
    """Create a test character."""
    return Character(
        name="TestAgent",
        bio="A test agent for unit testing.",
        system="You are a helpful test agent.",
    )


@pytest.fixture
def runtime(character: Character) -> AgentRuntime:
    """Create a test runtime."""
    return AgentRuntime(character=character)


class TestAgentRuntimeInit:
    """Tests for AgentRuntime initialization."""

    def test_runtime_creation(self, character: Character) -> None:
        """Test creating a runtime."""
        runtime = AgentRuntime(character=character)
        assert runtime.character.name == "TestAgent"
        assert runtime.agent_id is not None

    def test_runtime_with_agent_id(self, character: Character) -> None:
        """Test creating a runtime with a specific agent ID."""
        agent_id = as_uuid("12345678-1234-1234-1234-123456789012")
        runtime = AgentRuntime(character=character, agent_id=agent_id)
        assert runtime.agent_id == agent_id

    def test_runtime_with_settings(self, character: Character) -> None:
        """Test creating a runtime with settings."""
        runtime = AgentRuntime(
            character=character,
            settings={"custom_setting": "value"},
        )
        assert runtime.get_setting("custom_setting") == "value"


class TestAgentRuntimeSettings:
    """Tests for runtime settings."""

    def test_get_setting_from_runtime(self, runtime: AgentRuntime) -> None:
        """Test getting a setting from runtime."""
        runtime.set_setting("test_key", "test_value")
        assert runtime.get_setting("test_key") == "test_value"

    def test_get_setting_from_character(self) -> None:
        """Test getting a setting from character."""
        character = Character(
            name="Test",
            bio="Test",
            settings={"char_setting": "char_value"},
        )
        runtime = AgentRuntime(character=character)
        assert runtime.get_setting("char_setting") == "char_value"

    def test_get_setting_from_secrets(self) -> None:
        """Test getting a setting from character secrets."""
        character = Character(
            name="Test",
            bio="Test",
            secrets={"API_KEY": "secret_key"},
        )
        runtime = AgentRuntime(character=character)
        assert runtime.get_setting("API_KEY") == "secret_key"

    def test_get_nonexistent_setting(self, runtime: AgentRuntime) -> None:
        """Test getting a nonexistent setting."""
        assert runtime.get_setting("nonexistent") is None


class TestAgentRuntimeProviders:
    """Tests for provider registration."""

    @pytest.mark.asyncio
    async def test_register_provider(self, runtime: AgentRuntime) -> None:
        """Test registering a provider."""

        async def get_data(rt: AgentRuntime, msg: Memory, state: State) -> ProviderResult:
            return ProviderResult(text="Provider data")

        provider = Provider(
            name="test-provider",
            description="A test provider",
            get=get_data,
        )
        runtime.register_provider(provider)
        assert len(runtime.providers) == 1
        assert runtime.providers[0].name == "test-provider"


class TestAgentRuntimeActions:
    """Tests for action registration."""

    @pytest.mark.asyncio
    async def test_register_action(self, runtime: AgentRuntime) -> None:
        """Test registering an action."""

        async def validate(rt: AgentRuntime, msg: Memory, state: State | None) -> bool:
            return True

        async def handler(
            rt: AgentRuntime,
            msg: Memory,
            state: State | None,
            options: object,
            callback: object,
            responses: list[Memory] | None,
        ) -> ActionResult:
            return ActionResult(success=True)

        action = Action(
            name="TEST_ACTION",
            description="A test action",
            validate=validate,
            handler=handler,
        )
        runtime.register_action(action)
        assert len(runtime.actions) == 1
        assert runtime.actions[0].name == "TEST_ACTION"


class TestAgentRuntimeEvaluators:
    """Tests for evaluator registration."""

    @pytest.mark.asyncio
    async def test_register_evaluator(self, runtime: AgentRuntime) -> None:
        """Test registering an evaluator."""

```