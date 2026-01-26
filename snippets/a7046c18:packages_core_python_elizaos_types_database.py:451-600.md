# a7046c18:packages_core_python_elizaos_types_database.py:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/database.py:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    @abstractmethod
    async def count_memories(
        self, room_id: UUID, unique: bool = False, table_name: str | None = None
    ) -> int:
        """Count memories for a room."""
        ...

    # World methods
    @abstractmethod
    async def create_world(self, world: Any) -> UUID:
        """Create a world."""
        ...

    @abstractmethod
    async def get_world(self, id: UUID) -> Any | None:
        """Get world by ID."""
        ...

    @abstractmethod
    async def remove_world(self, id: UUID) -> None:
        """Remove a world."""
        ...

    @abstractmethod
    async def get_all_worlds(self) -> list[Any]:
        """Get all worlds."""
        ...

    @abstractmethod
    async def update_world(self, world: Any) -> None:
        """Update a world."""
        ...

    # Room methods
    @abstractmethod
    async def get_rooms_by_ids(self, room_ids: list[UUID]) -> list[Any] | None:
        """Get rooms by IDs."""
        ...

    @abstractmethod
    async def create_rooms(self, rooms: list[Any]) -> list[UUID]:
        """Create rooms."""
        ...

    @abstractmethod
    async def delete_room(self, room_id: UUID) -> None:
        """Delete a room."""
        ...

    @abstractmethod
    async def delete_rooms_by_world_id(self, world_id: UUID) -> None:
        """Delete rooms by world ID."""
        ...

    @abstractmethod
    async def update_room(self, room: Any) -> None:
        """Update a room."""
        ...

    # Participant methods
    @abstractmethod
    async def get_rooms_for_participant(self, entity_id: UUID) -> list[UUID]:
        """Get rooms for a participant."""
        ...

    @abstractmethod
    async def get_rooms_for_participants(self, user_ids: list[UUID]) -> list[UUID]:
        """Get rooms for participants."""
        ...

    @abstractmethod
    async def get_rooms_by_world(self, world_id: UUID) -> list[Any]:
        """Get rooms by world."""
        ...

    @abstractmethod
    async def remove_participant(self, entity_id: UUID, room_id: UUID) -> bool:
        """Remove a participant from a room."""
        ...

    @abstractmethod
    async def get_participants_for_entity(self, entity_id: UUID) -> list[Any]:
        """Get participants for an entity."""
        ...

    @abstractmethod
    async def get_participants_for_room(self, room_id: UUID) -> list[UUID]:
        """Get participants for a room."""
        ...

    @abstractmethod
    async def is_room_participant(self, room_id: UUID, entity_id: UUID) -> bool:
        """Check if entity is a room participant."""
        ...

    @abstractmethod
    async def add_participants_room(self, entity_ids: list[UUID], room_id: UUID) -> bool:
        """Add participants to a room."""
        ...

    @abstractmethod
    async def get_participant_user_state(self, room_id: UUID, entity_id: UUID) -> str | None:
        """Get participant user state."""
        ...

    @abstractmethod
    async def set_participant_user_state(
        self, room_id: UUID, entity_id: UUID, state: str | None
    ) -> None:
        """Set participant user state."""
        ...

    # Relationship methods
    @abstractmethod
    async def create_relationship(self, params: dict[str, Any]) -> bool:
        """Create a new relationship."""
        ...

    @abstractmethod
    async def update_relationship(self, relationship: Any) -> None:
        """Update an existing relationship."""
        ...

    @abstractmethod
    async def get_relationship(self, params: dict[str, Any]) -> Any | None:
        """Get a relationship between two entities."""
        ...

    @abstractmethod
    async def get_relationships(self, params: dict[str, Any]) -> list[Any]:
        """Get all relationships for an entity."""
        ...

    # Cache methods
    @abstractmethod
    async def get_cache(self, key: str) -> Any | None:
        """Get cached value."""
        ...

    @abstractmethod
    async def set_cache(self, key: str, value: Any) -> bool:
        """Set cached value."""
        ...

    @abstractmethod
    async def delete_cache(self, key: str) -> bool:
        """Delete cached value."""
        ...

    # Task methods
```