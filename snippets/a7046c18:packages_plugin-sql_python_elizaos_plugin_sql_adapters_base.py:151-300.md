# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                return True
            except Exception:
                await session.rollback()
                return False

    async def update_agent(self, agent_id: UUID, agent: dict[str, Any]) -> bool:
        """Update an agent."""
        async with self._get_session() as session:
            try:
                await session.execute(
                    update(AgentTable)
                    .where(AgentTable.id == agent_id)
                    .values(**{k: v for k, v in agent.items() if k != "id"})
                )
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def delete_agent(self, agent_id: UUID) -> bool:
        """Delete an agent."""
        async with self._get_session() as session:
            try:
                await session.execute(delete(AgentTable).where(AgentTable.id == agent_id))
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def ensure_embedding_dimension(self, dimension: int) -> None:
        """Ensure embedding dimension is set."""
        self._embedding_dimension = dimension

    # Entity methods
    async def get_entities_by_ids(self, entity_ids: list[UUID]) -> list[dict[str, Any]] | None:
        """Get entities by IDs."""
        async with self._get_session() as session:
            result = await session.execute(
                select(EntityTable).where(EntityTable.id.in_(entity_ids))
            )
            entities = result.scalars().all()
            return [self._entity_to_dict(e) for e in entities] if entities else None

    async def get_entities_for_room(
        self, room_id: UUID, include_components: bool = False
    ) -> list[dict[str, Any]]:
        """Get entities for a room."""
        async with self._get_session() as session:
            result = await session.execute(
                select(EntityTable)
                .join(ParticipantTable)
                .where(ParticipantTable.room_id == room_id)
            )
            entities = result.scalars().all()
            return [self._entity_to_dict(e) for e in entities]

    async def create_entities(self, entities: list[dict[str, Any]]) -> bool:
        """Create new entities."""
        async with self._get_session() as session:
            try:
                for entity in entities:
                    db_entity = EntityTable(
                        id=entity.get("id") or uuid.uuid4(),
                        agent_id=entity["agentId"],
                        names=entity["names"],
                        entity_metadata=entity.get("metadata", {}),
                    )
                    session.add(db_entity)
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def update_entity(self, entity: dict[str, Any]) -> None:
        """Update an entity."""
        async with self._get_session() as session:
            await session.execute(
                update(EntityTable)
                .where(EntityTable.id == entity["id"])
                .values(
                    names=entity.get("names"),
                    entity_metadata=entity.get("metadata"),
                )
            )
            await session.commit()

    # Component methods
    async def get_component(
        self,
        entity_id: UUID,
        component_type: str,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> dict[str, Any] | None:
        """Get component by entity ID and type."""
        async with self._get_session() as session:
            query = select(ComponentTable).where(
                and_(
                    ComponentTable.entity_id == entity_id,
                    ComponentTable.type == component_type,
                )
            )
            if world_id:
                query = query.where(ComponentTable.world_id == world_id)
            if source_entity_id:
                query = query.where(ComponentTable.source_entity_id == source_entity_id)

            result = await session.execute(query)
            component = result.scalar_one_or_none()
            return self._component_to_dict(component) if component else None

    async def get_components(
        self,
        entity_id: UUID,
        world_id: UUID | None = None,
        source_entity_id: UUID | None = None,
    ) -> list[dict[str, Any]]:
        """Get all components for an entity."""
        async with self._get_session() as session:
            query = select(ComponentTable).where(ComponentTable.entity_id == entity_id)
            if world_id:
                query = query.where(ComponentTable.world_id == world_id)
            if source_entity_id:
                query = query.where(ComponentTable.source_entity_id == source_entity_id)

            result = await session.execute(query)
            components = result.scalars().all()
            return [self._component_to_dict(c) for c in components]

    async def create_component(self, component: dict[str, Any]) -> bool:
        """Create a component."""
        async with self._get_session() as session:
            try:
                db_component = ComponentTable(
                    id=component.get("id") or uuid.uuid4(),
                    entity_id=component["entityId"],
                    agent_id=component["agentId"],
                    room_id=component["roomId"],
                    world_id=component["worldId"],
                    source_entity_id=component["sourceEntityId"],
                    type=component["type"],
                    data=component.get("data", {}),
                )
                session.add(db_component)
                await session.commit()
                return True
            except Exception:
```