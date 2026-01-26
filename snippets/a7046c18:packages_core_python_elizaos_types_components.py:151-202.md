# a7046c18:packages_core_python_elizaos_types_components.py:151-202

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/components.py:151-202
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    name: str = Field(..., description="Evaluator name")
    description: str = Field(..., description="Detailed description")
    always_run: bool | None = Field(
        default=None,
        alias="alwaysRun",
        description="Whether to always run even if agent didn't respond",
    )
    similes: list[str] | None = Field(default=None, description="Similar evaluator descriptions")
    examples: list[EvaluationExample] = Field(..., description="Example evaluations")
    handler: Handler = Field(..., description="Handler function")
    validate_fn: Validator = Field(..., alias="validate", description="Validation function")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ProviderResult(BaseModel):
    """Result returned by a provider."""

    text: str | None = Field(
        default=None, description="Human-readable text for LLM prompt inclusion"
    )
    values: dict[str, Any] | None = Field(
        default=None, description="Key-value pairs for template variable substitution"
    )
    data: dict[str, Any] | None = Field(
        default=None, description="Structured data for programmatic access"
    )

    model_config = {"populate_by_name": True}


# Provider get function type
ProviderGet = Callable[
    ["IAgentRuntime", Memory, "State"],
    Awaitable[ProviderResult],
]


class Provider(BaseModel):
    """Provider for external data/services."""

    name: str = Field(..., description="Provider name")
    description: str | None = Field(default=None, description="Description of the provider")
    dynamic: bool | None = Field(default=None, description="Whether the provider is dynamic")
    position: int | None = Field(default=None, description="Position in the provider list")
    private: bool | None = Field(
        default=None,
        description="Whether the provider is private (not in regular provider list)",
    )
    get: ProviderGet = Field(..., description="Data retrieval function")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
```