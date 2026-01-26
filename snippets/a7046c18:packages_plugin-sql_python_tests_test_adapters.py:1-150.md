# a7046c18:packages_plugin-sql_python_tests_test_adapters.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/tests/test_adapters.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""Tests for database adapters."""

import tempfile
import uuid

import pytest
from elizaos.types import as_uuid

from elizaos_plugin_sql.adapters.pglite import PGLiteAdapter


@pytest.fixture
def agent_id() -> str:
    """Generate a test agent ID."""
    return as_uuid(str(uuid.uuid4()))


@pytest.fixture
async def pglite_adapter(agent_id: str) -> PGLiteAdapter:
    """Create a PGLite adapter for testing."""
    with tempfile.TemporaryDirectory() as tmpdir:
        adapter = PGLiteAdapter(
            data_dir=tmpdir,
            agent_id=agent_id,
        )
        await adapter.initialize()
        yield adapter
        await adapter.close()


class TestPGLiteAdapter:
    """Tests for PGLite adapter."""

    @pytest.mark.asyncio
    async def test_initialization(self, agent_id: str) -> None:
        """Test adapter initialization."""
        with tempfile.TemporaryDirectory() as tmpdir:
            adapter = PGLiteAdapter(
                data_dir=tmpdir,
                agent_id=agent_id,
            )
            await adapter.initialize()
            assert await adapter.is_ready()
            await adapter.close()

    @pytest.mark.asyncio
    async def test_agent_crud(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test agent CRUD operations."""
        agent_id = as_uuid(str(uuid.uuid4()))

        # Create
        created = await pglite_adapter.create_agent(
            {
                "id": agent_id,
                "name": "TestAgent",
                "bio": "A test agent",
            }
        )
        assert created is True

        # Read
        agent = await pglite_adapter.get_agent(agent_id)
        assert agent is not None
        assert agent["name"] == "TestAgent"

        # Update
        updated = await pglite_adapter.update_agent(agent_id, {"name": "UpdatedAgent"})
        assert updated is True

        agent = await pglite_adapter.get_agent(agent_id)
        assert agent["name"] == "UpdatedAgent"

        # Delete
        deleted = await pglite_adapter.delete_agent(agent_id)
        assert deleted is True

        agent = await pglite_adapter.get_agent(agent_id)
        assert agent is None

    @pytest.mark.asyncio
    async def test_entity_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test entity operations."""
        # First create an agent
        agent_id = as_uuid(str(uuid.uuid4()))
        await pglite_adapter.create_agent(
            {
                "id": agent_id,
                "name": "TestAgent",
                "bio": "A test agent",
            }
        )

        # Create entity
        entity_id = as_uuid(str(uuid.uuid4()))
        created = await pglite_adapter.create_entities(
            [
                {
                    "id": entity_id,
                    "agentId": agent_id,
                    "names": ["TestUser"],
                    "metadata": {"email": "test@example.com"},
                }
            ]
        )
        assert created is True

        # Read
        entities = await pglite_adapter.get_entities_by_ids([entity_id])
        assert entities is not None
        assert len(entities) == 1
        assert entities[0]["names"] == ["TestUser"]

    @pytest.mark.asyncio
    async def test_memory_operations(self, pglite_adapter: PGLiteAdapter) -> None:
        """Test memory operations."""
        # Create agent
        agent_id = as_uuid(str(uuid.uuid4()))
        await pglite_adapter.create_agent(
            {
                "id": agent_id,
                "name": "TestAgent",
                "bio": "A test agent",
            }
        )

        # Create room
        room_id = as_uuid(str(uuid.uuid4()))
        await pglite_adapter.create_rooms(
            [
                {
                    "id": room_id,
                    "source": "test",
                    "type": "DM",
                }
            ]
        )

        # Create entity
        entity_id = as_uuid(str(uuid.uuid4()))
        await pglite_adapter.create_entities(
            [
                {
                    "id": entity_id,
                    "agentId": agent_id,
                    "names": ["TestUser"],
                }
            ]
        )

        # Create memory
```