# a7046c18:packages_python-plugin-starter_elizaos_plugin_starter_plugin.py:151-242

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/python-plugin-starter/elizaos_plugin_starter/plugin.py:151-242
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    Services are long-running components that can maintain state
    and provide functionality to actions and providers.
    """

    service_type = "python-starter"

    def __init__(self, runtime: "IAgentRuntime") -> None:
        super().__init__(runtime)
        self.initialized = False
        self.request_count = 0

    @classmethod
    async def start(cls, runtime: "IAgentRuntime") -> "StarterService":
        """Start the service."""
        logger.info("Starting Python Starter Service")
        service = cls(runtime)
        service.initialized = True
        return service

    async def stop(self) -> None:
        """Instance stop method."""
        logger.info("Python Starter Service stopped")
        self.initialized = False

    def increment_requests(self) -> int:
        """Increment and return the request count."""
        self.request_count += 1
        return self.request_count

    @property
    def capability_description(self) -> str:
        """Describe what this service provides."""
        return "Python Starter Service - demonstrates service lifecycle and state management"


# =============================================================================
# Plugin Initialization
# =============================================================================


async def plugin_init(
    config: dict[str, str],
    runtime: "IAgentRuntime",
) -> None:
    """
    Initialize the plugin with configuration.

    This is called when the plugin is registered with the runtime.
    You can use this to set up resources, validate configuration, etc.
    """
    logger.info("Initializing Python Starter Plugin")

    # Example: validate configuration
    example_var = config.get("EXAMPLE_PLUGIN_VARIABLE")
    if example_var:
        logger.debug(f"Example variable set to: {example_var}")
    else:
        logger.debug("Example variable not set (this is expected)")

    logger.info("Python Starter Plugin initialized successfully")


# =============================================================================
# Plugin Definition
# =============================================================================


plugin = Plugin(
    name="python-plugin-starter",
    description="Starter template for elizaOS Python plugins",
    # Initialization function
    init=plugin_init,
    # Configuration (loaded from environment)
    config={
        "EXAMPLE_PLUGIN_VARIABLE": None,  # Optional configuration
    },
    # Actions the plugin provides
    actions=[
        hello_python_action,
    ],
    # Providers for context
    providers=[
        python_info_provider,
    ],
    # Services
    services=[
        StarterService,
    ],
    # Plugin dependencies (if any)
    # dependencies=["@elizaos/plugin-bootstrap"],
)
```