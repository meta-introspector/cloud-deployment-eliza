# a7046c18:packages_core_python_elizaos_types_plugin.py:151-203

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/plugin.py:151-203
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    # Services
    services: list[type[Service]] | None = Field(
        default=None, description="Service classes to register"
    )

    # Component type definitions
    component_types: list[ComponentTypeDefinition] | None = Field(
        default=None, alias="componentTypes", description="Entity component definitions"
    )

    # Optional plugin features
    actions: list[Action] | None = Field(default=None, description="Actions to register")
    providers: list[Provider] | None = Field(default=None, description="Providers to register")
    evaluators: list[Evaluator] | None = Field(default=None, description="Evaluators to register")
    adapter: IDatabaseAdapter | None = Field(default=None, description="Database adapter")
    models: dict[str, Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]]] | None = Field(
        default=None, description="Model handlers by model type"
    )
    events: PluginEvents | None = Field(default=None, description="Event handlers by event type")
    routes: list[Route] | None = Field(default=None, description="HTTP routes to register")
    tests: list[TestSuite] | None = Field(default=None, description="Test suites")

    dependencies: list[str] | None = Field(default=None, description="Plugin dependencies")
    test_dependencies: list[str] | None = Field(
        default=None, alias="testDependencies", description="Test dependencies"
    )
    priority: int | None = Field(default=None, description="Plugin priority")
    schema_def: dict[str, Any] | None = Field(
        default=None, alias="schema", description="Plugin schema"
    )

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ProjectAgent(BaseModel):
    """Agent configuration within a project."""

    character: Character = Field(..., description="Agent character")
    init: Callable[[IAgentRuntime], Awaitable[None]] | None = Field(
        default=None, description="Agent initialization function"
    )
    plugins: list[Plugin] | None = Field(default=None, description="Agent-specific plugins")
    tests: TestSuite | list[TestSuite] | None = Field(default=None, description="Agent tests")

    model_config = {"arbitrary_types_allowed": True}


class Project(BaseModel):
    """Project definition with multiple agents."""

    agents: list[ProjectAgent] = Field(..., description="Project agents")

    model_config = {"arbitrary_types_allowed": True}
```