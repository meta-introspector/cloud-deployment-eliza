# a7046c18:packages_core_python_elizaos_runtime.py:901-1028

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:901-1028
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if self._adapter:
            await self._adapter.delete_room(room_id)

    async def delete_rooms_by_world_id(self, world_id: UUID) -> None:
        if self._adapter:
            await self._adapter.delete_rooms_by_world_id(world_id)

    async def update_room(self, room: Any) -> None:
        if self._adapter:
            await self._adapter.update_room(room)

    async def get_rooms_for_participant(self, entity_id: UUID) -> list[UUID]:
        if not self._adapter:
            return []
        return await self._adapter.get_rooms_for_participant(entity_id)

    async def get_rooms_for_participants(self, user_ids: list[UUID]) -> list[UUID]:
        if not self._adapter:
            return []
        return await self._adapter.get_rooms_for_participants(user_ids)

    async def get_rooms_by_world(self, world_id: UUID) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_rooms_by_world(world_id)

    async def remove_participant(self, entity_id: UUID, room_id: UUID) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.remove_participant(entity_id, room_id)

    async def get_participants_for_entity(self, entity_id: UUID) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_participants_for_entity(entity_id)

    async def get_participants_for_room(self, room_id: UUID) -> list[UUID]:
        if not self._adapter:
            return []
        return await self._adapter.get_participants_for_room(room_id)

    async def is_room_participant(self, room_id: UUID, entity_id: UUID) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.is_room_participant(room_id, entity_id)

    async def add_participants_room(self, entity_ids: list[UUID], room_id: UUID) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.add_participants_room(entity_ids, room_id)

    async def get_participant_user_state(self, room_id: UUID, entity_id: UUID) -> str | None:
        if not self._adapter:
            return None
        return await self._adapter.get_participant_user_state(room_id, entity_id)

    async def set_participant_user_state(
        self, room_id: UUID, entity_id: UUID, state: str | None
    ) -> None:
        if self._adapter:
            await self._adapter.set_participant_user_state(room_id, entity_id, state)

    async def create_relationship(self, params: dict[str, Any]) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.create_relationship(params)

    async def update_relationship(self, relationship: Any) -> None:
        if self._adapter:
            await self._adapter.update_relationship(relationship)

    async def get_relationship(self, params: dict[str, Any]) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_relationship(params)

    async def get_relationships(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_relationships(params)

    async def get_cache(self, key: str) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_cache(key)

    async def set_cache(self, key: str, value: Any) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.set_cache(key, value)

    async def delete_cache(self, key: str) -> bool:
        if not self._adapter:
            return False
        return await self._adapter.delete_cache(key)

    async def create_task(self, task: Any) -> UUID:
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return await self._adapter.create_task(task)

    async def get_tasks(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_tasks(params)

    async def get_task(self, id: UUID) -> Any | None:
        if not self._adapter:
            return None
        return await self._adapter.get_task(id)

    async def get_tasks_by_name(self, name: str) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_tasks_by_name(name)

    async def update_task(self, id: UUID, task: dict[str, Any]) -> None:
        if self._adapter:
            await self._adapter.update_task(id, task)

    async def delete_task(self, id: UUID) -> None:
        if self._adapter:
            await self._adapter.delete_task(id)

    async def get_memories_by_world_id(self, params: dict[str, Any]) -> list[Any]:
        if not self._adapter:
            return []
        return await self._adapter.get_memories_by_world_id(params)
```