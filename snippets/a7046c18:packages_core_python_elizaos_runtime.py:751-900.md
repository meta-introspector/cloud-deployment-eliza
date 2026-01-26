# a7046c18:packages_core_python_elizaos_runtime.py:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    async def get_component(
        self,
        entity_id: UUID,
        component_type: str,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_component(
            entity_id, component_type, world_id, source_entity_id
        )

    async def get_components(
        self,
        entity_id: UUID,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_components(entity_id, world_id, source_entity_id)

    async def create_component(self, component: Any) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.create_component(component)

    async def update_component(self, component: Any) -> None:
        if self._adapter:
            await self._adapter.update_component(component)

    async def delete_component(self, component_id: UUID) -> None:
        if self._adapter:
            await self._adapter.delete_component(component_id)

    async def get_memories(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_memories(params)

    async def get_memory_by_id(self, id: UUID) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_memory_by_id(id)

    async def get_memories_by_ids(
        self, ids: list[UUID], table_name: str | None = None
    ) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_memories_by_ids(ids, table_name)

    async def get_memories_by_room_ids(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_memories_by_room_ids(params)

    async def get_cached_embeddings(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        if not self._adapter:
            return []
        return await self._adapter.get_cached_embeddings(params)

    async def log(self, params: dict[str, Any]) -> None:
        if self._adapter:
            await self._adapter.log(params)

    async def get_logs(self, params: dict[str, Any]) -> list[Log]:
        if not self._adapter:
            return []
        return await self._adapter.get_logs(params)

    async def delete_log(self, log_id: UUID) -> None:
        if self._adapter:
            await self._adapter.delete_log(log_id)

    async def get_agent_run_summaries(self, params: dict[str, Any]) -> AgentRunSummaryResult:
        if not self._adapter:
            return AgentRunSummaryResult(runs=[], total=0, hasMore=False)
        return await self._adapter.get_agent_run_summaries(params)

    async def search_memories(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.search_memories(params)

    async def create_memory(self, memory: Any, table_name: str, unique: bool = False) -> UUID:
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return await self._adapter.create_memory(memory, table_name, unique)

    async def update_memory(self, memory: dict[str, Any]) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.update_memory(memory)

    async def delete_memory(self, memory_id: UUID) -> None:
        if self._adapter:
            await self._adapter.delete_memory(memory_id)

    async def delete_many_memories(self, memory_ids: list[UUID]) -> None:
        if self._adapter:
            await self._adapter.delete_many_memories(memory_ids)

    async def delete_all_memories(self, room_id: UUID, table_name: str) -> None:
        if self._adapter:
            await self._adapter.delete_all_memories(room_id, table_name)

    async def count_memories(
        self, room_id: UUID, unique: bool = False, table_name: str | None = None
    ) -> int:
        if not self._adapter:
            return 0
        return await self._adapter.count_memories(room_id, unique, table_name)

    async def create_world(self, world: Any) -> UUID:
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return await self._adapter.create_world(world)

    async def get_world(self, id: UUID) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_world(id)

    async def remove_world(self, id: UUID) -> None:
        if self._adapter:
            await self._adapter.remove_world(id)

    async def get_all_worlds(self) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_all_worlds()

    async def update_world(self, world: Any) -> None:
        if self._adapter:
            await self._adapter.update_world(world)

    async def get_rooms_by_ids(self, room_ids: list[UUID]) -> list[Any] | None:
        if not self._adapter:
            return None
        return await self._adapter.get_rooms_by_ids(room_ids)

    async def create_rooms(self, rooms: list[Any]) -> list[UUID]:
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return await self._adapter.create_rooms(rooms)

    async def delete_room(self, room_id: UUID) -> None:
```