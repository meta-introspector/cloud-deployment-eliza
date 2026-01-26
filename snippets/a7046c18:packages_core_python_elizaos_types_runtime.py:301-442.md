# a7046c18:packages_core_python_elizaos_types_runtime.py:301-442

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/runtime.py:301-442
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    @abstractmethod
    def register_model(
        self,
        model_type: str,
        handler: Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]],
        provider: str,
        priority: int = 0,
    ) -> None:
        """Register a model handler."""
        ...

    @abstractmethod
    def get_model(
        self, model_type: str
    ) -> Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]] | None:
        """Get a model handler."""
        ...

    # Event handling
    @abstractmethod
    def register_event(
        self,
        event: str,
        handler: Callable[[Any], Awaitable[None]],
    ) -> None:
        """Register an event handler."""
        ...

    @abstractmethod
    def get_event(self, event: str) -> list[Callable[[Any], Awaitable[None]]] | None:
        """Get event handlers for an event type."""
        ...

    @abstractmethod
    async def emit_event(
        self,
        event: str | list[str],
        params: Any,
    ) -> None:
        """Emit an event."""
        ...

    # Task management
    @abstractmethod
    def register_task_worker(self, task_handler: TaskWorker) -> None:
        """Register a task worker."""
        ...

    @abstractmethod
    def get_task_worker(self, name: str) -> TaskWorker | None:
        """Get a task worker by name."""
        ...

    # Lifecycle
    @abstractmethod
    async def stop(self) -> None:
        """Stop the runtime."""
        ...

    # Memory/embedding helpers
    @abstractmethod
    async def add_embedding_to_memory(self, memory: Memory) -> Memory:
        """Add embedding to a memory."""
        ...

    @abstractmethod
    async def queue_embedding_generation(self, memory: Memory, priority: str = "normal") -> None:
        """Queue a memory for async embedding generation."""
        ...

    @abstractmethod
    async def get_all_memories(self) -> list[Memory]:
        """Get all memories."""
        ...

    @abstractmethod
    async def clear_all_agent_memories(self) -> None:
        """Clear all agent memories."""
        ...

    # Run tracking
    @abstractmethod
    def create_run_id(self) -> UUID:
        """Create a new run ID."""
        ...

    @abstractmethod
    def start_run(self, room_id: UUID | None = None) -> UUID:
        """Start a new run."""
        ...

    @abstractmethod
    def end_run(self) -> None:
        """End the current run."""
        ...

    @abstractmethod
    def get_current_run_id(self) -> UUID:
        """Get the current run ID."""
        ...

    # Convenience wrappers
    @abstractmethod
    async def get_entity_by_id(self, entity_id: UUID) -> Entity | None:
        """Get entity by ID."""
        ...

    @abstractmethod
    async def get_room(self, room_id: UUID) -> Room | None:
        """Get room by ID."""
        ...

    @abstractmethod
    async def create_entity(self, entity: Entity) -> bool:
        """Create an entity."""
        ...

    @abstractmethod
    async def create_room(self, room: Room) -> UUID:
        """Create a room."""
        ...

    @abstractmethod
    async def add_participant(self, entity_id: UUID, room_id: UUID) -> bool:
        """Add a participant to a room."""
        ...

    @abstractmethod
    async def get_rooms(self, world_id: UUID) -> list[Room]:
        """Get rooms for a world."""
        ...

    @abstractmethod
    def register_send_handler(self, source: str, handler: SendHandlerFunction) -> None:
        """Register a send handler."""
        ...

    @abstractmethod
    async def send_message_to_target(self, target: TargetInfo, content: Content) -> None:
        """Send a message to a target."""
        ...
```