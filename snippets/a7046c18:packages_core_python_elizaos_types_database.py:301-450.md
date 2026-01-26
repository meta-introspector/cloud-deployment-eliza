# a7046c18:packages_core_python_elizaos_types_database.py:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/database.py:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    async def delete_agent(self, agent_id: UUID) -> bool:
        """Delete an agent."""
        ...

    @abstractmethod
    async def ensure_embedding_dimension(self, dimension: int) -> None:
        """Ensure embedding dimension is set."""
        ...

    # Entity methods
    @abstractmethod
    async def get_entities_by_ids(self, entity_ids: list[UUID]) -> list[Any] | None:
        """Get entities by IDs."""
        ...

    @abstractmethod
    async def get_entities_for_room(
        self, room_id: UUID, include_components: bool = False
    ) -> list[Any]:
        """Get entities for room."""
        ...

    @abstractmethod
    async def create_entities(self, entities: list[Any]) -> bool:
        """Create new entities."""
        ...

    @abstractmethod
    async def update_entity(self, entity: Any) -> None:
        """Update entity."""
        ...

    # Component methods
    @abstractmethod
    async def get_component(
        self,
        entity_id: UUID,
        component_type: str,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> Any | None:
        """Get component by ID."""
        ...

    @abstractmethod
    async def get_components(
        self,
        entity_id: UUID,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> list[Any]:
        """Get all components for an entity."""
        ...

    @abstractmethod
    async def create_component(self, component: Any) -> bool:
        """Create component."""
        ...

    @abstractmethod
    async def update_component(self, component: Any) -> None:
        """Update component."""
        ...

    @abstractmethod
    async def delete_component(self, component_id: UUID) -> None:
        """Delete component."""
        ...

    # Memory methods
    @abstractmethod
    async def get_memories(
        self,
        params: dict[str, Any],
    ) -> list[Any]:
        """Get memories matching criteria."""
        ...

    @abstractmethod
    async def get_memory_by_id(self, id: UUID) -> Any | None:
        """Get memory by ID."""
        ...

    @abstractmethod
    async def get_memories_by_ids(
        self, ids: list[UUID], table_name: str | None = None
    ) -> list[Any]:
        """Get memories by IDs."""
        ...

    @abstractmethod
    async def get_memories_by_room_ids(self, params: dict[str, Any]) -> list[Any]:
        """Get memories by room IDs."""
        ...

    @abstractmethod
    async def get_cached_embeddings(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get cached embeddings."""
        ...

    @abstractmethod
    async def log(self, params: dict[str, Any]) -> None:
        """Log an entry."""
        ...

    @abstractmethod
    async def get_logs(self, params: dict[str, Any]) -> list[Log]:
        """Get logs."""
        ...

    @abstractmethod
    async def delete_log(self, log_id: UUID) -> None:
        """Delete a log."""
        ...

    async def get_agent_run_summaries(self, params: dict[str, Any]) -> AgentRunSummaryResult:
        """Get agent run summaries."""
        _ = params  # Optional method, default returns empty result
        return AgentRunSummaryResult(runs=[], total=0, hasMore=False)

    @abstractmethod
    async def search_memories(self, params: dict[str, Any]) -> list[Any]:
        """Search memories by embedding similarity."""
        ...

    @abstractmethod
    async def create_memory(self, memory: Any, table_name: str, unique: bool = False) -> UUID:
        """Create a memory."""
        ...

    @abstractmethod
    async def update_memory(self, memory: dict[str, Any]) -> bool:
        """Update a memory."""
        ...

    @abstractmethod
    async def delete_memory(self, memory_id: UUID) -> None:
        """Delete a memory."""
        ...

    @abstractmethod
    async def delete_many_memories(self, memory_ids: list[UUID]) -> None:
        """Delete multiple memories."""
        ...

    @abstractmethod
    async def delete_all_memories(self, room_id: UUID, table_name: str) -> None:
        """Delete all memories for a room."""
        ...

```