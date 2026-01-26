# a7046c18:packages_core_python_elizaos_types_runtime.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/runtime.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    @abstractmethod
    def get_registered_service_types(self) -> list[str]:
        """Get all registered service types."""
        ...

    @abstractmethod
    def has_service(self, service_type: str) -> bool:
        """Check if a service is registered."""
        ...

    # Settings
    @abstractmethod
    def set_setting(self, key: str, value: str | bool | None, secret: bool = False) -> None:
        """Set a runtime setting."""
        ...

    @abstractmethod
    def get_setting(self, key: str) -> str | bool | int | float | None:
        """Get a runtime setting."""
        ...

    @abstractmethod
    def get_conversation_length(self) -> int:
        """Get the conversation length."""
        ...

    # Action processing
    @abstractmethod
    async def process_actions(
        self,
        message: Memory,
        responses: list[Memory],
        state: State | None = None,
        callback: HandlerCallback | None = None,
        options: dict[str, Any] | None = None,
    ) -> None:
        """Process actions for a message."""
        ...

    @abstractmethod
    def get_action_results(self, message_id: UUID) -> list[ActionResult]:
        """Get action results for a message."""
        ...

    # Evaluation
    @abstractmethod
    async def evaluate(
        self,
        message: Memory,
        state: State | None = None,
        did_respond: bool = False,
        callback: HandlerCallback | None = None,
        responses: list[Memory] | None = None,
    ) -> list[Evaluator] | None:
        """Evaluate a message."""
        ...

    # Component registration
    @abstractmethod
    def register_provider(self, provider: Provider) -> None:
        """Register a provider."""
        ...

    @abstractmethod
    def register_action(self, action: Action) -> None:
        """Register an action."""
        ...

    @abstractmethod
    def register_evaluator(self, evaluator: Evaluator) -> None:
        """Register an evaluator."""
        ...

    # Connection management
    @abstractmethod
    async def ensure_connections(
        self,
        entities: list[Entity],
        rooms: list[Room],
        source: str,
        world: World,
    ) -> None:
        """Ensure connections are set up."""
        ...

    @abstractmethod
    async def ensure_connection(
        self,
        entity_id: UUID,
        room_id: UUID,
        world_id: UUID,
        user_name: str | None = None,
        name: str | None = None,
        world_name: str | None = None,
        source: str | None = None,
        channel_id: str | None = None,
        message_server_id: UUID | None = None,
        channel_type: str | None = None,
        user_id: UUID | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """Ensure a connection is set up."""
        ...

    @abstractmethod
    async def ensure_participant_in_room(self, entity_id: UUID, room_id: UUID) -> None:
        """Ensure an entity is a participant in a room."""
        ...

    @abstractmethod
    async def ensure_world_exists(self, world: World) -> None:
        """Ensure a world exists."""
        ...

    @abstractmethod
    async def ensure_room_exists(self, room: Room) -> None:
        """Ensure a room exists."""
        ...

    # State composition
    @abstractmethod
    async def compose_state(
        self,
        message: Memory,
        include_list: list[str] | None = None,
        only_include: bool = False,
        skip_cache: bool = False,
    ) -> State:
        """Compose state for a message."""
        ...

    # Model usage
    @abstractmethod
    async def use_model(
        self,
        model_type: str,
        params: dict[str, Any],
        provider: str | None = None,
    ) -> Any:
        """Use a model for inference."""
        ...

    @abstractmethod
    async def generate_text(
        self,
        input_text: str,
        options: GenerateTextOptions | None = None,
    ) -> GenerateTextResult:
        """Generate text using an LLM."""
        ...
```