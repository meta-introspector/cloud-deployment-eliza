# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    async def update_room(self, room: dict[str, Any]) -> None:
        """Update a room."""
        async with self._get_session() as session:
            await session.execute(
                update(RoomTable)
                .where(RoomTable.id == room["id"])
                .values(
                    name=room.get("name"),
                    room_metadata=room.get("metadata"),
                )
            )
            await session.commit()

    # Participant methods
    async def get_rooms_for_participant(self, entity_id: UUID) -> list[UUID]:
        """Get rooms for a participant."""
        async with self._get_session() as session:
            result = await session.execute(
                select(ParticipantTable.room_id).where(ParticipantTable.entity_id == entity_id)
            )
            return [as_uuid(str(r[0])) for r in result.fetchall()]

    async def get_rooms_for_participants(self, user_ids: list[UUID]) -> list[UUID]:
        """Get rooms for participants."""
        async with self._get_session() as session:
            result = await session.execute(
                select(ParticipantTable.room_id).where(ParticipantTable.entity_id.in_(user_ids))
            )
            return list({as_uuid(str(r[0])) for r in result.fetchall()})

    async def get_rooms_by_world(self, world_id: UUID) -> list[dict[str, Any]]:
        """Get rooms by world."""
        async with self._get_session() as session:
            result = await session.execute(select(RoomTable).where(RoomTable.world_id == world_id))
            rooms = result.scalars().all()
            return [self._room_to_dict(r) for r in rooms]

    async def remove_participant(self, entity_id: UUID, room_id: UUID) -> bool:
        """Remove a participant from a room."""
        async with self._get_session() as session:
            try:
                await session.execute(
                    delete(ParticipantTable).where(
                        and_(
                            ParticipantTable.entity_id == entity_id,
                            ParticipantTable.room_id == room_id,
                        )
                    )
                )
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def get_participants_for_entity(self, entity_id: UUID) -> list[dict[str, Any]]:
        """Get participants for an entity."""
        async with self._get_session() as session:
            result = await session.execute(
                select(ParticipantTable).where(ParticipantTable.entity_id == entity_id)
            )
            participants = result.scalars().all()
            return [self._participant_to_dict(p) for p in participants]

    async def get_participants_for_room(self, room_id: UUID) -> list[UUID]:
        """Get participants for a room."""
        async with self._get_session() as session:
            result = await session.execute(
                select(ParticipantTable.entity_id).where(ParticipantTable.room_id == room_id)
            )
            return [as_uuid(str(r[0])) for r in result.fetchall()]

    async def is_room_participant(self, room_id: UUID, entity_id: UUID) -> bool:
        """Check if entity is a room participant."""
        async with self._get_session() as session:
            result = await session.execute(
                select(func.count())
                .select_from(ParticipantTable)
                .where(
                    and_(
                        ParticipantTable.room_id == room_id,
                        ParticipantTable.entity_id == entity_id,
                    )
                )
            )
            return (result.scalar() or 0) > 0

    async def add_participants_room(self, entity_ids: list[UUID], room_id: UUID) -> bool:
        """Add participants to a room."""
        async with self._get_session() as session:
            try:
                for entity_id in entity_ids:
                    participant = ParticipantTable(
                        id=uuid.uuid4(),
                        entity_id=entity_id,
                        room_id=room_id,
                    )
                    session.add(participant)
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def get_participant_user_state(self, room_id: UUID, entity_id: UUID) -> str | None:
        """Get participant user state."""
        async with self._get_session() as session:
            result = await session.execute(
                select(ParticipantTable.user_state).where(
                    and_(
                        ParticipantTable.room_id == room_id,
                        ParticipantTable.entity_id == entity_id,
                    )
                )
            )
            row = result.first()
            return row[0] if row else None

    async def set_participant_user_state(
        self, room_id: UUID, entity_id: UUID, state: str | None
    ) -> None:
        """Set participant user state."""
        async with self._get_session() as session:
            await session.execute(
                update(ParticipantTable)
                .where(
                    and_(
                        ParticipantTable.room_id == room_id,
                        ParticipantTable.entity_id == entity_id,
                    )
                )
                .values(user_state=state)
            )
            await session.commit()

    # Relationship methods
    async def create_relationship(self, params: dict[str, Any]) -> bool:
        """Create a relationship."""
        async with self._get_session() as session:
            try:
                db_relationship = RelationshipTable(
                    id=uuid.uuid4(),
                    source_entity_id=params["sourceEntityId"],
                    target_entity_id=params["targetEntityId"],
                    agent_id=self._agent_id,
                    tags=params.get("tags", []),
                    relationship_metadata=params.get("metadata", {}),
                )
                session.add(db_relationship)
```