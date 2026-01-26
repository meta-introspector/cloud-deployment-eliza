# a7046c18:packages_core_interop_python_rust_ffi.py:301-417

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/rust_ffi.py:301-417
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        actions.append(
            Action(
                name=action_name,
                description=action_def.get("description", ""),
                similes=action_def.get("similes"),
                examples=action_def.get("examples"),
                validate=validate_fn,  # type: ignore
                handler=handler_fn,  # type: ignore
            )
        )

    # Create provider wrappers
    providers: list[Provider] = []
    for provider_def in manifest.get("providers", []):
        provider_name = provider_def["name"]

        async def make_get(name: str) -> Callable[..., Awaitable[ProviderResult]]:
            async def get(runtime: Any, message: Memory, state: State) -> ProviderResult:
                return ffi.get_provider(name, message, state)
            return get

        get_fn = make_get(provider_name)

        providers.append(
            Provider(
                name=provider_name,
                description=provider_def.get("description"),
                dynamic=provider_def.get("dynamic"),
                position=provider_def.get("position"),
                private=provider_def.get("private"),
                get=get_fn,  # type: ignore
            )
        )

    # Create evaluator wrappers
    evaluators: list[Evaluator] = []
    for eval_def in manifest.get("evaluators", []):
        eval_name = eval_def["name"]

        async def make_eval_validate(name: str) -> Callable[..., Awaitable[bool]]:
            async def validate(runtime: Any, message: Memory, state: State | None) -> bool:
                return ffi.validate_evaluator(name, message, state)
            return validate

        async def make_eval_handler(name: str) -> Callable[..., Awaitable[ActionResult | None]]:
            async def handler(
                runtime: Any,
                message: Memory,
                state: State | None,
                options: HandlerOptions | None,
                callback: Any,
                responses: Any,
            ) -> ActionResult | None:
                return ffi.invoke_evaluator(name, message, state)
            return handler

        validate_fn = make_eval_validate(eval_name)
        handler_fn = make_eval_handler(eval_name)

        evaluators.append(
            Evaluator(
                name=eval_name,
                description=eval_def.get("description", ""),
                always_run=eval_def.get("alwaysRun"),
                similes=eval_def.get("similes"),
                examples=[],
                validate=validate_fn,  # type: ignore
                handler=handler_fn,  # type: ignore
            )
        )

    # Create init function
    async def init(config: dict[str, str], runtime: Any) -> None:
        ffi.init(config)

    return Plugin(
        name=manifest["name"],
        description=manifest["description"],
        init=init,
        config=manifest.get("config"),
        dependencies=manifest.get("dependencies"),
        actions=actions if actions else None,
        providers=providers if providers else None,
        evaluators=evaluators if evaluators else None,
    )


def find_rust_plugin(name: str, search_paths: list[str | Path] | None = None) -> Path | None:
    """
    Find a Rust plugin by name in common locations.
    
    Args:
        name: Plugin name (without lib prefix or extension)
        search_paths: Additional paths to search
        
    Returns:
        Path to the shared library, or None if not found
    """
    prefix = get_lib_prefix()
    ext = get_lib_extension()
    lib_name = f"{prefix}{name}{ext}"

    paths_to_search = search_paths or []
    paths_to_search.extend([
        Path.cwd() / "target" / "release",
        Path.cwd() / "target" / "debug",
        Path.cwd() / "dist",
        Path.home() / ".elizaos" / "plugins",
    ])

    for path in paths_to_search:
        lib_path = Path(path) / lib_name
        if lib_path.exists():
            return lib_path

    return None

```