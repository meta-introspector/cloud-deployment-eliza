# a7046c18:packages_core_python_tests_test_runtime.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_runtime.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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

        evaluator = Evaluator(
            name="test-evaluator",
            description="A test evaluator",
            examples=[],
            validate=validate,
            handler=handler,
        )
        runtime.register_evaluator(evaluator)
        assert len(runtime.evaluators) == 1
        assert runtime.evaluators[0].name == "test-evaluator"


class TestAgentRuntimePlugins:
    """Tests for plugin registration."""

    @pytest.mark.asyncio
    async def test_register_plugin(self, runtime: AgentRuntime) -> None:
        """Test registering a plugin."""

        async def get_data(rt: AgentRuntime, msg: Memory, state: State) -> ProviderResult:
            return ProviderResult(text="Plugin provider data")

        plugin = Plugin(
            name="test-plugin",
            description="A test plugin",
            providers=[
                Provider(
                    name="plugin-provider",
                    get=get_data,
                )
            ],
        )
        await runtime.register_plugin(plugin)
        assert len(runtime.plugins) == 1
        assert runtime.plugins[0].name == "test-plugin"
        assert len(runtime.providers) == 1


class TestAgentRuntimeEvents:
    """Tests for event handling."""

    @pytest.mark.asyncio
    async def test_register_event_handler(self, runtime: AgentRuntime) -> None:
        """Test registering an event handler."""
        events_received: list[str] = []

        async def handler(params: dict[str, object]) -> None:
            events_received.append("event_received")

        runtime.register_event("TEST_EVENT", handler)
        await runtime.emit_event("TEST_EVENT", {"data": "test"})

        assert len(events_received) == 1
        assert events_received[0] == "event_received"

    @pytest.mark.asyncio
    async def test_multiple_event_handlers(self, runtime: AgentRuntime) -> None:
        """Test multiple handlers for same event."""
        count = [0]

        async def handler1(params: dict[str, object]) -> None:
            count[0] += 1

        async def handler2(params: dict[str, object]) -> None:
            count[0] += 1

        runtime.register_event("MULTI_EVENT", handler1)
        runtime.register_event("MULTI_EVENT", handler2)
        await runtime.emit_event("MULTI_EVENT", {})

        assert count[0] == 2


class TestAgentRuntimeModels:
    """Tests for model registration."""

    @pytest.mark.asyncio
    async def test_register_model(self, runtime: AgentRuntime) -> None:
        """Test registering a model handler."""

        async def model_handler(rt: AgentRuntime, params: dict[str, object]) -> str:
            return f"Generated: {params.get('prompt', '')}"

        runtime.register_model(
            model_type="TEXT_LARGE",
            handler=model_handler,
            provider="test-provider",
        )

        result = await runtime.use_model("TEXT_LARGE", {"prompt": "Hello"})
        assert result == "Generated: Hello"

    @pytest.mark.asyncio
    async def test_model_priority(self, runtime: AgentRuntime) -> None:
        """Test model handler priority."""

        async def low_priority_handler(rt: AgentRuntime, params: dict[str, object]) -> str:
            return "low"

        async def high_priority_handler(rt: AgentRuntime, params: dict[str, object]) -> str:
            return "high"

        runtime.register_model(
            model_type="TEXT_LARGE",
            handler=low_priority_handler,
            provider="low",
            priority=0,
        )
        runtime.register_model(
            model_type="TEXT_LARGE",
            handler=high_priority_handler,
            provider="high",
            priority=10,
        )

        result = await runtime.use_model("TEXT_LARGE", {})
        assert result == "high"


class TestAgentRuntimeRunTracking:
    """Tests for run tracking."""

    def test_create_run_id(self, runtime: AgentRuntime) -> None:
        """Test creating a run ID."""
        run_id = runtime.create_run_id()
        assert run_id is not None
        assert len(run_id) == 36  # UUID format

    def test_start_and_end_run(self, runtime: AgentRuntime) -> None:
        """Test starting and ending a run."""
        room_id = as_uuid("12345678-1234-1234-1234-123456789012")
        run_id = runtime.start_run(room_id)
        assert run_id == runtime.get_current_run_id()

        runtime.end_run()
        # Should create a new run when accessed
        new_run_id = runtime.get_current_run_id()
```