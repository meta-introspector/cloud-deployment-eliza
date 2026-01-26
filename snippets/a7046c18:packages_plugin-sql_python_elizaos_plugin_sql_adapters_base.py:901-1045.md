# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:901-1045

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:901-1045
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            if "metadata" in task:
                update_values["task_metadata"] = task["metadata"]
            if "tags" in task:
                update_values["task_tags"] = task["tags"]

            await session.execute(
                update(TaskTable).where(TaskTable.id == id).values(**update_values)
            )
            await session.commit()

    async def delete_task(self, id: UUID) -> None:
        """Delete a task."""
        async with self._get_session() as session:
            await session.execute(delete(TaskTable).where(TaskTable.id == id))
            await session.commit()

    async def get_memories_by_world_id(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        """Get memories by world ID."""
        async with self._get_session() as session:
            query = select(MemoryTable).where(MemoryTable.world_id == params["worldId"])
            if "count" in params:
                query = query.limit(params["count"])

            result = await session.execute(query)
            memories = result.scalars().all()
            return [self._memory_to_dict(m) for m in memories]

    # Helper methods for type conversion
    def _agent_to_dict(self, agent: AgentTable) -> dict[str, Any]:
        return {
            "id": str(agent.id),
            "name": agent.name,
            "username": agent.username,
            "bio": agent.bio,
            "system": agent.system,
            "settings": agent.settings,
            "secrets": agent.secrets,
            "enabled": agent.enabled,
            "status": agent.status,
            "createdAt": int(agent.created_at.timestamp() * 1000),
            "updatedAt": int(agent.updated_at.timestamp() * 1000),
        }

    def _entity_to_dict(self, entity: EntityTable) -> dict[str, Any]:
        return {
            "id": str(entity.id),
            "agentId": str(entity.agent_id),
            "names": entity.names,
            "metadata": entity.entity_metadata,
        }

    def _component_to_dict(self, component: ComponentTable) -> dict[str, Any]:
        return {
            "id": str(component.id),
            "entityId": str(component.entity_id),
            "agentId": str(component.agent_id),
            "roomId": str(component.room_id),
            "worldId": str(component.world_id),
            "sourceEntityId": str(component.source_entity_id),
            "type": component.type,
            "data": component.data,
            "createdAt": int(component.created_at.timestamp() * 1000),
        }

    def _world_to_dict(self, world: WorldTable) -> dict[str, Any]:
        return {
            "id": str(world.id),
            "name": world.name,
            "agentId": str(world.agent_id),
            "messageServerId": str(world.message_server_id) if world.message_server_id else None,
            "metadata": world.world_metadata,
        }

    def _room_to_dict(self, room: RoomTable) -> dict[str, Any]:
        return {
            "id": str(room.id),
            "name": room.name,
            "agentId": str(room.agent_id) if room.agent_id else None,
            "source": room.source,
            "type": room.type,
            "channelId": room.channel_id,
            "messageServerId": str(room.message_server_id) if room.message_server_id else None,
            "worldId": str(room.world_id) if room.world_id else None,
            "metadata": room.room_metadata,
        }

    def _memory_to_dict(self, memory: MemoryTable) -> dict[str, Any]:
        return {
            "id": str(memory.id),
            "entityId": str(memory.entity_id),
            "agentId": str(memory.agent_id) if memory.agent_id else None,
            "roomId": str(memory.room_id),
            "worldId": str(memory.world_id) if memory.world_id else None,
            "content": memory.content,
            "unique": memory.unique,
            "metadata": memory.memory_metadata,
            "createdAt": int(memory.created_at.timestamp() * 1000),
        }

    def _participant_to_dict(self, participant: ParticipantTable) -> dict[str, Any]:
        return {
            "id": str(participant.id),
            "entityId": str(participant.entity_id),
            "roomId": str(participant.room_id),
            "userState": participant.user_state,
        }

    def _relationship_to_dict(self, relationship: RelationshipTable) -> dict[str, Any]:
        return {
            "id": str(relationship.id),
            "sourceEntityId": str(relationship.source_entity_id),
            "targetEntityId": str(relationship.target_entity_id),
            "agentId": str(relationship.agent_id),
            "tags": relationship.tags,
            "metadata": relationship.relationship_metadata,
            "createdAt": relationship.created_at.isoformat() if relationship.created_at else None,
        }

    def _task_to_dict(self, task: TaskTable) -> dict[str, Any]:
        return {
            "id": str(task.id),
            "name": task.name,
            "description": task.description,
            "roomId": str(task.room_id) if task.room_id else None,
            "entityId": str(task.entity_id) if task.entity_id else None,
            "worldId": str(task.world_id) if task.world_id else None,
            "status": task.status,
            "tags": task.task_tags,
            "metadata": task.task_metadata,
            "createdAt": int(task.created_at.timestamp() * 1000),
            "updatedAt": int(task.updated_at.timestamp() * 1000),
        }

    def _log_to_model(self, log: LogTable) -> Log:
        from elizaos.types import BaseLogBody
        from elizaos.types import Log as LogModel

        return LogModel(
            id=as_uuid(str(log.id)),
            entityId=as_uuid(str(log.entity_id)),
            roomId=as_uuid(str(log.room_id)) if log.room_id else None,
            type=str(log.type),
            body=BaseLogBody(**log.body) if log.body else BaseLogBody(),
            createdAt=int(log.created_at.timestamp() * 1000),
        )
```