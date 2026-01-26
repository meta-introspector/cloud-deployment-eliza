# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                await session.rollback()
                return False

    async def update_component(self, component: dict[str, Any]) -> None:
        """Update a component."""
        async with self._get_session() as session:
            await session.execute(
                update(ComponentTable)
                .where(ComponentTable.id == component["id"])
                .values(data=component.get("data", {}))
            )
            await session.commit()

    async def delete_component(self, component_id: UUID) -> None:
        """Delete a component."""
        async with self._get_session() as session:
            await session.execute(delete(ComponentTable).where(ComponentTable.id == component_id))
            await session.commit()

    # Memory methods
    async def get_memories(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get memories matching criteria."""
        async with self._get_session() as session:
            query = select(MemoryTable)

            if "roomId" in params:
                query = query.where(MemoryTable.room_id == params["roomId"])
            if "entityId" in params:
                query = query.where(MemoryTable.entity_id == params["entityId"])
            if "agentId" in params:
                query = query.where(MemoryTable.agent_id == params["agentId"])
            if "unique" in params and params["unique"]:
                query = query.where(MemoryTable.unique)

            query = query.order_by(MemoryTable.created_at.desc())

            if "count" in params:
                query = query.limit(params["count"])
            if "offset" in params:
                query = query.offset(params["offset"])

            result = await session.execute(query)
            memories = result.scalars().all()
            return [self._memory_to_dict(m) for m in memories]

    async def get_memory_by_id(self, id: UUID) -> dict[str, Any] | None:
        """Get memory by ID."""
        async with self._get_session() as session:
            result = await session.execute(select(MemoryTable).where(MemoryTable.id == id))
            memory = result.scalar_one_or_none()
            return self._memory_to_dict(memory) if memory else None

    async def get_memories_by_ids(
        self, ids: list[UUID], table_name: str | None = None
    ) -> list[dict[str, Any]]:
        """Get memories by IDs."""
        async with self._get_session() as session:
            result = await session.execute(select(MemoryTable).where(MemoryTable.id.in_(ids)))
            memories = result.scalars().all()
            return [self._memory_to_dict(m) for m in memories]

    async def get_memories_by_room_ids(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get memories by room IDs."""
        async with self._get_session() as session:
            query = select(MemoryTable).where(MemoryTable.room_id.in_(params["roomIds"]))
            if "limit" in params:
                query = query.limit(params["limit"])

            result = await session.execute(query)
            memories = result.scalars().all()
            return [self._memory_to_dict(m) for m in memories]

    async def get_cached_embeddings(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get cached embeddings."""
        # This would require more complex implementation with vector search
        return []

    async def search_memories(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Search memories by embedding similarity."""
        # This would require pgvector or similar for production
        # For now, return empty - subclasses can override
        return []

    async def create_memory(
        self, memory: dict[str, Any], table_name: str, unique: bool = False
    ) -> UUID:
        """Create a memory."""
        async with self._get_session() as session:
            memory_id = memory.get("id") or uuid.uuid4()
            db_memory = MemoryTable(
                id=memory_id,
                entity_id=memory["entityId"],
                agent_id=memory.get("agentId"),
                room_id=memory["roomId"],
                world_id=memory.get("worldId"),
                content=memory["content"],
                unique=unique,
                memory_metadata=memory.get("metadata", {}),
            )
            session.add(db_memory)

            # If embedding is provided, store it
            if "embedding" in memory and memory["embedding"]:
                db_embedding = EmbeddingTable(
                    id=uuid.uuid4(),
                    memory_id=memory_id,
                    embedding=memory["embedding"],
                    dimension=len(memory["embedding"]),
                )
                session.add(db_embedding)

            await session.commit()
            return as_uuid(str(memory_id))

    async def update_memory(self, memory: dict[str, Any]) -> bool:
        """Update a memory."""
        async with self._get_session() as session:
            try:
                update_values: dict[str, Any] = {}
                if "content" in memory:
                    update_values["content"] = memory["content"]
                if "metadata" in memory:
                    update_values["memory_metadata"] = memory["metadata"]

                await session.execute(
                    update(MemoryTable)
                    .where(MemoryTable.id == memory["id"])
                    .values(**update_values)
                )
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def delete_memory(self, memory_id: UUID) -> None:
        """Delete a memory."""
        async with self._get_session() as session:
            await session.execute(delete(MemoryTable).where(MemoryTable.id == memory_id))
            await session.commit()

    async def delete_many_memories(self, memory_ids: list[UUID]) -> None:
        """Delete multiple memories."""
        async with self._get_session() as session:
            await session.execute(delete(MemoryTable).where(MemoryTable.id.in_(memory_ids)))
            await session.commit()

    async def delete_all_memories(self, room_id: UUID, table_name: str) -> None:
        """Delete all memories for a room."""
        async with self._get_session() as session:
```