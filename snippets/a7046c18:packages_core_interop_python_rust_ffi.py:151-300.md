# a7046c18:packages_core_interop_python_rust_ffi.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/rust_ffi.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        """Get the plugin manifest."""
        if self.manifest:
            return self.manifest

        ptr = self.lib.elizaos_get_manifest()
        json_str = self._from_c_string(ptr)
        if not json_str:
            raise RuntimeError("Failed to get manifest from Rust plugin")

        self.manifest = json.loads(json_str)
        return self.manifest

    def init(self, config: dict[str, str]) -> None:
        """Initialize the plugin with configuration."""
        config_json = json.dumps(config)
        result = self.lib.elizaos_init(self._to_c_string(config_json))
        if result != 0:
            raise RuntimeError(f"Plugin initialization failed with code {result}")

    def validate_action(self, name: str, memory: Memory, state: State | None) -> bool:
        """Validate an action."""
        memory_json = json.dumps(memory.model_dump() if hasattr(memory, "model_dump") else memory)
        state_json = json.dumps(
            state.model_dump() if state and hasattr(state, "model_dump") else state
        )

        result = self.lib.elizaos_validate_action(
            self._to_c_string(name),
            self._to_c_string(memory_json),
            self._to_c_string(state_json),
        )
        return result != 0

    def invoke_action(
        self, name: str, memory: Memory, state: State | None, options: dict[str, Any] | None
    ) -> ActionResult:
        """Invoke an action."""
        memory_json = json.dumps(memory.model_dump() if hasattr(memory, "model_dump") else memory)
        state_json = json.dumps(
            state.model_dump() if state and hasattr(state, "model_dump") else state
        )
        options_json = json.dumps(options or {})

        result_ptr = self.lib.elizaos_invoke_action(
            self._to_c_string(name),
            self._to_c_string(memory_json),
            self._to_c_string(state_json),
            self._to_c_string(options_json),
        )
        result_json = self._from_c_string(result_ptr)
        if not result_json:
            return ActionResult(success=False, error="No result from Rust plugin")

        result_data = json.loads(result_json)
        return ActionResult(**result_data)

    def get_provider(self, name: str, memory: Memory, state: State) -> ProviderResult:
        """Get provider data."""
        memory_json = json.dumps(memory.model_dump() if hasattr(memory, "model_dump") else memory)
        state_json = json.dumps(state.model_dump() if hasattr(state, "model_dump") else state)

        result_ptr = self.lib.elizaos_get_provider(
            self._to_c_string(name),
            self._to_c_string(memory_json),
            self._to_c_string(state_json),
        )
        result_json = self._from_c_string(result_ptr)
        if not result_json:
            return ProviderResult()

        result_data = json.loads(result_json)
        return ProviderResult(**result_data)

    def validate_evaluator(self, name: str, memory: Memory, state: State | None) -> bool:
        """Validate an evaluator."""
        memory_json = json.dumps(memory.model_dump() if hasattr(memory, "model_dump") else memory)
        state_json = json.dumps(
            state.model_dump() if state and hasattr(state, "model_dump") else state
        )

        result = self.lib.elizaos_validate_evaluator(
            self._to_c_string(name),
            self._to_c_string(memory_json),
            self._to_c_string(state_json),
        )
        return result != 0

    def invoke_evaluator(self, name: str, memory: Memory, state: State | None) -> ActionResult | None:
        """Invoke an evaluator."""
        memory_json = json.dumps(memory.model_dump() if hasattr(memory, "model_dump") else memory)
        state_json = json.dumps(
            state.model_dump() if state and hasattr(state, "model_dump") else state
        )

        result_ptr = self.lib.elizaos_invoke_evaluator(
            self._to_c_string(name),
            self._to_c_string(memory_json),
            self._to_c_string(state_json),
        )
        result_json = self._from_c_string(result_ptr)
        if not result_json or result_json == "null":
            return None

        result_data = json.loads(result_json)
        return ActionResult(**result_data)


def load_rust_plugin(lib_path: str | Path) -> Plugin:
    """
    Load a Rust plugin from a shared library.
    
    Args:
        lib_path: Path to the shared library
        
    Returns:
        elizaOS Plugin instance
    """
    ffi = RustPluginFFI(lib_path)
    manifest = ffi.get_manifest()

    # Create action wrappers
    actions: list[Action] = []
    for action_def in manifest.get("actions", []):
        action_name = action_def["name"]

        async def make_validate(name: str) -> Callable[..., Awaitable[bool]]:
            async def validate(
                runtime: Any, message: Memory, state: State | None
            ) -> bool:
                return ffi.validate_action(name, message, state)
            return validate

        async def make_handler(name: str) -> Callable[..., Awaitable[ActionResult | None]]:
            async def handler(
                runtime: Any,
                message: Memory,
                state: State | None,
                options: HandlerOptions | None,
                callback: Any,
                responses: Any,
            ) -> ActionResult | None:
                return ffi.invoke_action(
                    name, message, state, options.model_dump() if options else None
                )
            return handler

        # Note: We need to capture the current name in the closure
        validate_fn = make_validate(action_name)
        handler_fn = make_handler(action_name)

```