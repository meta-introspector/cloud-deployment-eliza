# a7046c18:packages_core_python_elizaos_runtime.py:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if not self._adapter:
            return []
        return await self._adapter.get_memories(
            {"agentId": str(self._agent_id), "tableName": "memories"}
        )

    async def clear_all_agent_memories(self) -> None:
        """Clear all agent memories."""
        # Implementation depends on database adapter
        pass

    # Run tracking
    def create_run_id(self) -> UUID:
        """Create a new run ID."""
        return as_uuid(str(uuid.uuid4()))

    def start_run(self, room_id: UUID | None = None) -> UUID:
        """Start a new run."""
        self._current_run_id = self.create_run_id()
        self._current_room_id = room_id
        return self._current_run_id

    def end_run(self) -> None:
        """End the current run."""
        self._current_run_id = None
        self._current_room_id = None

    def get_current_run_id(self) -> UUID:
        """Get the current run ID."""
        if not self._current_run_id:
            return self.start_run()
        return self._current_run_id

    # Convenience wrappers
    async def get_entity_by_id(self, entity_id: UUID) -> Entity | None:
        """Get entity by ID."""
        if not self._adapter:
            return None
        entities = await self._adapter.get_entities_by_ids([entity_id])
        return entities[0] if entities else None

    async def get_room(self, room_id: UUID) -> Room | None:
        """Get room by ID."""
        if not self._adapter:
            return None
        rooms = await self._adapter.get_rooms_by_ids([room_id])
        return rooms[0] if rooms else None

    async def create_entity(self, entity: Entity) -> bool:
        """Create an entity."""
        if not self._adapter:
            return False
        return await self._adapter.create_entities([entity])

    async def create_room(self, room: Room) -> UUID:
        """Create a room."""
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        ids = await self._adapter.create_rooms([room])
        return ids[0]

    async def add_participant(self, entity_id: UUID, room_id: UUID) -> bool:
        """Add a participant to a room."""
        if not self._adapter:
            return False
        return await self._adapter.add_participants_room([entity_id], room_id)

    async def get_rooms(self, world_id: UUID) -> list[Room]:
        """Get rooms for a world."""
        if not self._adapter:
            return []
        return await self._adapter.get_rooms_by_world(world_id)

    def register_send_handler(self, source: str, handler: SendHandlerFunction) -> None:
        """Register a send handler."""
        self._send_handlers[source] = handler

    async def send_message_to_target(self, target: TargetInfo, content: Content) -> None:
        """Send a message to a target."""
        if target.source and target.source in self._send_handlers:
            await self._send_handlers[target.source](target, content)

    # Database adapter delegation methods
    async def init(self) -> None:
        if self._adapter:
            await self._adapter.init()

    async def is_ready(self) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.is_ready()

    async def close(self) -> None:
        if self._adapter:
            await self._adapter.close()

    async def get_connection(self) -> Any:
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return await self._adapter.get_connection()

    async def get_agent(self, agent_id: UUID) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_agent(agent_id)

    async def get_agents(self) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_agents()

    async def create_agent(self, agent: Any) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.create_agent(agent)

    async def update_agent(self, agent_id: UUID, agent: Any) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.update_agent(agent_id, agent)

    async def delete_agent(self, agent_id: UUID) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.delete_agent(agent_id)

    async def ensure_embedding_dimension(self, dimension: int) -> None:
        if self._adapter:
            await self._adapter.ensure_embedding_dimension(dimension)

    async def get_entities_by_ids(self, entity_ids: list[UUID]) -> list[Any] | None:
        if not self._adapter:
            return None
        return await self._adapter.get_entities_by_ids(entity_ids)

    async def get_entities_for_room(
        self, room_id: UUID, include_components: bool = False
    ) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_entities_for_room(room_id, include_components)

    async def create_entities(self, entities: list[Any]) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.create_entities(entities)

    async def update_entity(self, entity: Any) -> None:
        if self._adapter:
            await self._adapter.update_entity(entity)
```