# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            await session.execute(delete(MemoryTable).where(MemoryTable.room_id == room_id))
            await session.commit()

    async def count_memories(
        self, room_id: UUID, unique: bool = False, table_name: str | None = None
    ) -> int:
        """Count memories for a room."""
        async with self._get_session() as session:
            query = (
                select(func.count()).select_from(MemoryTable).where(MemoryTable.room_id == room_id)
            )
            if unique:
                query = query.where(MemoryTable.unique)

            result = await session.execute(query)
            return result.scalar() or 0

    # Logging methods
    async def log(self, params: dict[str, Any]) -> None:
        """Log an entry."""
        async with self._get_session() as session:
            db_log = LogTable(
                id=uuid.uuid4(),
                entity_id=params["entityId"],
                room_id=params.get("roomId"),
                type=params["type"],
                body=params["body"],
            )
            session.add(db_log)
            await session.commit()

    async def get_logs(self, params: dict[str, Any]) -> list[Log]:
        """Get logs."""
        async with self._get_session() as session:
            query = select(LogTable)

            if "entityId" in params:
                query = query.where(LogTable.entity_id == params["entityId"])
            if "roomId" in params:
                query = query.where(LogTable.room_id == params["roomId"])
            if "type" in params:
                query = query.where(LogTable.type == params["type"])

            query = query.order_by(LogTable.created_at.desc())

            if "count" in params:
                query = query.limit(params["count"])
            if "offset" in params:
                query = query.offset(params["offset"])

            result = await session.execute(query)
            logs = result.scalars().all()
            return [self._log_to_model(log) for log in logs]

    async def delete_log(self, log_id: UUID) -> None:
        """Delete a log."""
        async with self._get_session() as session:
            await session.execute(delete(LogTable).where(LogTable.id == log_id))
            await session.commit()

    # World methods
    async def create_world(self, world: dict[str, Any]) -> UUID:
        """Create a world."""
        async with self._get_session() as session:
            world_id = world.get("id") or uuid.uuid4()
            db_world = WorldTable(
                id=world_id,
                name=world.get("name"),
                agent_id=world["agentId"],
                message_server_id=world.get("messageServerId"),
                world_metadata=world.get("metadata", {}),
            )
            session.add(db_world)
            await session.commit()
            return as_uuid(str(world_id))

    async def get_world(self, id: UUID) -> dict[str, Any] | None:
        """Get world by ID."""
        async with self._get_session() as session:
            result = await session.execute(select(WorldTable).where(WorldTable.id == id))
            world = result.scalar_one_or_none()
            return self._world_to_dict(world) if world else None

    async def remove_world(self, id: UUID) -> None:
        """Remove a world."""
        async with self._get_session() as session:
            await session.execute(delete(WorldTable).where(WorldTable.id == id))
            await session.commit()

    async def get_all_worlds(self) -> list[dict[str, Any]]:
        """Get all worlds."""
        async with self._get_session() as session:
            result = await session.execute(select(WorldTable))
            worlds = result.scalars().all()
            return [self._world_to_dict(w) for w in worlds]

    async def update_world(self, world: dict[str, Any]) -> None:
        """Update a world."""
        async with self._get_session() as session:
            await session.execute(
                update(WorldTable)
                .where(WorldTable.id == world["id"])
                .values(
                    name=world.get("name"),
                    world_metadata=world.get("metadata"),
                )
            )
            await session.commit()

    # Room methods
    async def get_rooms_by_ids(self, room_ids: list[UUID]) -> list[dict[str, Any]] | None:
        """Get rooms by IDs."""
        async with self._get_session() as session:
            result = await session.execute(select(RoomTable).where(RoomTable.id.in_(room_ids)))
            rooms = result.scalars().all()
            return [self._room_to_dict(r) for r in rooms] if rooms else None

    async def create_rooms(self, rooms: list[dict[str, Any]]) -> list[UUID]:
        """Create rooms."""
        async with self._get_session() as session:
            created_ids: list[UUID] = []
            for room in rooms:
                room_id = room.get("id") or uuid.uuid4()
                db_room = RoomTable(
                    id=room_id,
                    name=room.get("name"),
                    agent_id=room.get("agentId"),
                    source=room["source"],
                    type=room["type"],
                    channel_id=room.get("channelId"),
                    message_server_id=room.get("messageServerId"),
                    world_id=room.get("worldId"),
                    room_metadata=room.get("metadata", {}),
                )
                session.add(db_room)
                created_ids.append(as_uuid(str(room_id)))
            await session.commit()
            return created_ids

    async def delete_room(self, room_id: UUID) -> None:
        """Delete a room."""
        async with self._get_session() as session:
            await session.execute(delete(RoomTable).where(RoomTable.id == room_id))
            await session.commit()

    async def delete_rooms_by_world_id(self, world_id: UUID) -> None:
        """Delete rooms by world ID."""
        async with self._get_session() as session:
            await session.execute(delete(RoomTable).where(RoomTable.world_id == world_id))
            await session.commit()
```