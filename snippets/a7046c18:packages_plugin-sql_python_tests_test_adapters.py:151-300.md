# a7046c18:packages_plugin-sql_python_tests_test_adapters.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/tests/test_adapters.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        memory_id = await pglite_adapter.create_memory(
            {
                "entityId": entity_id,
                "roomId": room_id,
                "content": {"text": "Hello, world!"},
            },
            table_name="memories",
        )
        assert memory_id is not None

        # Read
        memory = await pglite_adapter.get_memory_by_id(memory_id)
        assert memory is not None
        assert memory["content"]["text"] == "Hello, world!"

        # Count
        count = await pglite_adapter.count_memories(room_id)
        assert count == 1

        # Delete
        await pglite_adapter.delete_memory(memory_id)
        memory = await pglite_adapter.get_memory_by_id(memory_id)
        assert memory is None

    @pytest.mark.asyncio
    async def test_world_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test world operations."""
        # Create agent
        agent_id = as_uuid(str(uuid.uuid4()))
        await pglite_adapter.create_agent(
            {
                "id": agent_id,
                "name": "TestAgent",
                "bio": "A test agent",
            }
        )

        # Create world
        world_id = await pglite_adapter.create_world(
            {
                "name": "TestWorld",
                "agentId": agent_id,
                "metadata": {"description": "A test world"},
            }
        )
        assert world_id is not None

        # Read
        world = await pglite_adapter.get_world(world_id)
        assert world is not None
        assert world["name"] == "TestWorld"

        # Update
        await pglite_adapter.update_world(
            {
                "id": world_id,
                "name": "UpdatedWorld",
            }
        )
        world = await pglite_adapter.get_world(world_id)
        assert world["name"] == "UpdatedWorld"

        # Get all
        all_worlds = await pglite_adapter.get_all_worlds()
        assert len(all_worlds) >= 1

        # Remove
        await pglite_adapter.remove_world(world_id)
        world = await pglite_adapter.get_world(world_id)
        assert world is None

    @pytest.mark.asyncio
    async def test_room_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test room operations."""
        # Create room
        room_ids = await pglite_adapter.create_rooms(
            [
                {
                    "source": "test",
                    "type": "GROUP",
                    "name": "TestRoom",
                }
            ]
        )
        assert len(room_ids) == 1

        # Read
        rooms = await pglite_adapter.get_rooms_by_ids(room_ids)
        assert rooms is not None
        assert len(rooms) == 1
        assert rooms[0]["name"] == "TestRoom"

        # Update
        await pglite_adapter.update_room(
            {
                "id": room_ids[0],
                "name": "UpdatedRoom",
            }
        )
        rooms = await pglite_adapter.get_rooms_by_ids(room_ids)
        assert rooms[0]["name"] == "UpdatedRoom"

        # Delete
        await pglite_adapter.delete_room(room_ids[0])
        rooms = await pglite_adapter.get_rooms_by_ids(room_ids)
        assert rooms is None or len(rooms) == 0

    @pytest.mark.asyncio
    async def test_cache_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test cache operations."""
        # Set
        result = await pglite_adapter.set_cache("test_key", {"value": "test_value"})
        assert result is True

        # Get
        cached = await pglite_adapter.get_cache("test_key")
        assert cached is not None
        assert cached["value"] == "test_value"

        # Update
        await pglite_adapter.set_cache("test_key", {"value": "updated_value"})
        cached = await pglite_adapter.get_cache("test_key")
        assert cached["value"] == "updated_value"

        # Delete
        result = await pglite_adapter.delete_cache("test_key")
        assert result is True
        cached = await pglite_adapter.get_cache("test_key")
        assert cached is None

    @pytest.mark.asyncio
    async def test_task_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test task operations."""
        # Create
        task_id = await pglite_adapter.create_task(
            {
                "name": "test-task",
                "description": "A test task",
                "status": "pending",
                "tags": ["test", "important"],
            }
        )
        assert task_id is not None

        # Read
        task = await pglite_adapter.get_task(task_id)
        assert task is not None
        assert task["name"] == "test-task"
        assert task["status"] == "pending"

```