# a7046c18:packages_core_python_tests_test_types.py:151-264

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_types.py:151-264
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert entity.names == ["TestUser"]
        assert entity.metadata == {}

    def test_entity_with_metadata(self) -> None:
        """Test creating entity with metadata."""
        entity = Entity(
            names=["TestUser"],
            agent_id=as_uuid("12345678-1234-1234-1234-123456789012"),
            metadata={"email": "test@example.com"},
        )
        assert entity.metadata.get("email") == "test@example.com"


class TestRoom:
    """Tests for Room model."""

    def test_room_creation(self) -> None:
        """Test creating a room."""
        room = Room(
            id=as_uuid("12345678-1234-1234-1234-123456789012"),
            source="cli",
            type=ChannelType.DM,
        )
        assert room.type == ChannelType.DM
        assert room.source == "cli"

    def test_room_with_world(self) -> None:
        """Test creating a room with world association."""
        room = Room(
            id=as_uuid("12345678-1234-1234-1234-123456789012"),
            source="discord",
            type=ChannelType.GROUP,
            world_id=as_uuid("12345678-1234-1234-1234-123456789013"),
            name="general",
        )
        assert room.name == "general"
        assert room.world_id == "12345678-1234-1234-1234-123456789013"


class TestWorld:
    """Tests for World model."""

    def test_world_creation(self) -> None:
        """Test creating a world."""
        world = World(
            id=as_uuid("12345678-1234-1234-1234-123456789012"),
            agent_id=as_uuid("12345678-1234-1234-1234-123456789013"),
            name="Test World",
        )
        assert world.name == "Test World"


class TestPlugin:
    """Tests for Plugin model."""

    def test_minimal_plugin(self) -> None:
        """Test creating plugin with minimal fields."""
        plugin = Plugin(
            name="test-plugin",
            description="A test plugin",
        )
        assert plugin.name == "test-plugin"
        assert plugin.description == "A test plugin"

    def test_plugin_with_dependencies(self) -> None:
        """Test creating plugin with dependencies."""
        plugin = Plugin(
            name="test-plugin",
            description="A test plugin",
            dependencies=["core-plugin", "util-plugin"],
        )
        assert plugin.dependencies == ["core-plugin", "util-plugin"]


class TestState:
    """Tests for State model."""

    def test_empty_state(self) -> None:
        """Test creating empty state."""
        state = State()
        assert state.values == {}
        assert state.text == ""

    def test_state_with_data(self) -> None:
        """Test creating state with data."""
        state = State(
            values={"key": "value"},
            text="State context",
        )
        assert state.values.get("key") == "value"
        assert state.text == "State context"


class TestTask:
    """Tests for Task model."""

    def test_task_creation(self) -> None:
        """Test creating a task."""
        task = Task(
            name="test-task",
            description="A test task",
        )
        assert task.name == "test-task"
        assert task.status == TaskStatus.PENDING

    def test_task_with_metadata(self) -> None:
        """Test creating a task with metadata."""
        task = Task(
            name="scheduled-task",
            status=TaskStatus.IN_PROGRESS,
            tags=["important", "daily"],
        )
        assert task.status == TaskStatus.IN_PROGRESS
        assert "important" in (task.tags or [])
```