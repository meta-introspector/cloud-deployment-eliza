# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def update_relationship(self, relationship: dict[str, Any]) -> None:
        """Update a relationship."""
        async with self._get_session() as session:
            await session.execute(
                update(RelationshipTable)
                .where(RelationshipTable.id == relationship["id"])
                .values(
                    tags=relationship.get("tags", []),
                    relationship_metadata=relationship.get("metadata", {}),
                )
            )
            await session.commit()

    async def get_relationship(self, params: dict[str, Any]) -> dict[str, Any] | None:
        """Get a relationship."""
        async with self._get_session() as session:
            result = await session.execute(
                select(RelationshipTable).where(
                    and_(
                        RelationshipTable.source_entity_id == params["sourceEntityId"],
                        RelationshipTable.target_entity_id == params["targetEntityId"],
                    )
                )
            )
            relationship = result.scalar_one_or_none()
            return self._relationship_to_dict(relationship) if relationship else None

    async def get_relationships(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get relationships for an entity."""
        async with self._get_session() as session:
            query = select(RelationshipTable).where(
                or_(
                    RelationshipTable.source_entity_id == params["entityId"],
                    RelationshipTable.target_entity_id == params["entityId"],
                )
            )
            if "tags" in params and params["tags"]:
                # Filter by tags - this requires array overlap
                query = query.where(RelationshipTable.tags.overlap(params["tags"]))

            result = await session.execute(query)
            relationships = result.scalars().all()
            return [self._relationship_to_dict(r) for r in relationships]

    # Cache methods
    async def get_cache(self, key: str) -> Any | None:
        """Get cached value."""
        async with self._get_session() as session:
            result = await session.execute(select(CacheTable).where(CacheTable.key == key))
            cache_entry = result.scalar_one_or_none()
            if cache_entry:
                if cache_entry.expires_at and cache_entry.expires_at < datetime.utcnow():
                    await self.delete_cache(key)
                    return None
                return cache_entry.value
            return None

    async def set_cache(self, key: str, value: Any) -> bool:
        """Set cached value."""
        async with self._get_session() as session:
            try:
                # Try to update existing
                result = await session.execute(select(CacheTable).where(CacheTable.key == key))
                existing = result.scalar_one_or_none()
                if existing:
                    await session.execute(
                        update(CacheTable).where(CacheTable.key == key).values(value=value)
                    )
                else:
                    cache_entry = CacheTable(key=key, value=value)
                    session.add(cache_entry)
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    async def delete_cache(self, key: str) -> bool:
        """Delete cached value."""
        async with self._get_session() as session:
            try:
                await session.execute(delete(CacheTable).where(CacheTable.key == key))
                await session.commit()
                return True
            except Exception:
                await session.rollback()
                return False

    # Task methods
    async def create_task(self, task: dict[str, Any]) -> UUID:
        """Create a task."""
        async with self._get_session() as session:
            task_id = task.get("id") or uuid.uuid4()
            db_task = TaskTable(
                id=task_id,
                name=task["name"],
                description=task.get("description"),
                room_id=task.get("roomId"),
                entity_id=task.get("entityId"),
                world_id=task.get("worldId"),
                status=task.get("status", "pending"),
                task_tags=task.get("tags", []),
                task_metadata=task.get("metadata", {}),
            )
            session.add(db_task)
            await session.commit()
            return as_uuid(str(task_id))

    async def get_tasks(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get tasks."""
        async with self._get_session() as session:
            query = select(TaskTable)

            if "roomId" in params:
                query = query.where(TaskTable.room_id == params["roomId"])
            if "entityId" in params:
                query = query.where(TaskTable.entity_id == params["entityId"])
            if "tags" in params and params["tags"]:
                query = query.where(TaskTable.task_tags.overlap(params["tags"]))

            result = await session.execute(query)
            tasks = result.scalars().all()
            return [self._task_to_dict(t) for t in tasks]

    async def get_task(self, id: UUID) -> dict[str, Any] | None:
        """Get task by ID."""
        async with self._get_session() as session:
            result = await session.execute(select(TaskTable).where(TaskTable.id == id))
            task = result.scalar_one_or_none()
            return self._task_to_dict(task) if task else None

    async def get_tasks_by_name(self, name: str) -> list[dict[str, Any]]:
        """Get tasks by name."""
        async with self._get_session() as session:
            result = await session.execute(select(TaskTable).where(TaskTable.name == name))
            tasks = result.scalars().all()
            return [self._task_to_dict(t) for t in tasks]

    async def update_task(self, id: UUID, task: dict[str, Any]) -> None:
        """Update a task."""
        async with self._get_session() as session:
            update_values: dict[str, Any] = {}
            if "status" in task:
                update_values["status"] = task["status"]
```