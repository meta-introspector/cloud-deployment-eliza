# a7046c18:packages_core_python_elizaos_types_database.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/database.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    start: int | None = None
    end: int | None = None
    agent_id: UUID | None = Field(default=None, alias="agentId")

    model_config = {"populate_by_name": True}


class MemorySearchOptions(BaseModel):
    """Options for memory search operations."""

    embedding: list[float]
    match_threshold: float | None = Field(default=None, alias="matchThreshold")
    count: int | None = None
    room_id: UUID = Field(..., alias="roomId")
    agent_id: UUID | None = Field(default=None, alias="agentId")
    unique: bool | None = None
    metadata: dict[str, Any] | None = None

    model_config = {"populate_by_name": True}


class MultiRoomMemoryOptions(BaseModel):
    """Options for multi-room memory retrieval."""

    room_ids: list[UUID] = Field(..., alias="roomIds")
    limit: int | None = None
    agent_id: UUID | None = Field(default=None, alias="agentId")

    model_config = {"populate_by_name": True}


class MemoryOptions(BaseModel):
    """Options pattern for memory operations."""

    room_id: UUID = Field(..., alias="roomId")
    limit: int | None = None
    agent_id: UUID | None = Field(default=None, alias="agentId")
    unique: bool | None = None
    start: int | None = None
    end: int | None = None

    model_config = {"populate_by_name": True}


class SearchOptions(MemoryOptions):
    """Specialized memory search options."""

    embedding: list[float]
    similarity: float | None = None

    model_config = {"populate_by_name": True}


# Database connection type - actual type depends on adapter implementation
DbConnection = Any


# Vector dimension constants
class VECTOR_DIMS:
    """Allowable vector dimensions."""

    SMALL = 384
    MEDIUM = 512
    LARGE = 768
    XL = 1024
    XXL = 1536
    XXXL = 3072


class IDatabaseAdapter(ABC):
    """Interface for database operations."""

    @property
    @abstractmethod
    def db(self) -> Any:
        """Database instance."""
        ...

    @abstractmethod
    async def initialize(self, config: dict[str, str | int | bool | None] | None = None) -> None:
        """Initialize database connection."""
        ...

    @abstractmethod
    async def init(self) -> None:
        """Initialize database connection (alias)."""
        ...

    async def run_plugin_migrations(
        self,
        plugins: list[dict[str, Any]],
        options: dict[str, bool] | None = None,
    ) -> None:
        """Run plugin schema migrations for all registered plugins.

        This is an optional method - subclasses may override to implement
        custom migration logic.
        """
        _ = plugins, options  # Optional method, default is no-op

    async def run_migrations(self, migrations_paths: list[str] | None = None) -> None:
        """Run database migrations from migration files.

        This is an optional method - subclasses may override to implement
        custom migration logic.
        """
        _ = migrations_paths  # Optional method, default is no-op

    @abstractmethod
    async def is_ready(self) -> bool:
        """Check if the database connection is ready."""
        ...

    @abstractmethod
    async def close(self) -> None:
        """Close database connection."""
        ...

    @abstractmethod
    async def get_connection(self) -> Any:
        """Get database connection."""
        ...

    async def with_entity_context(self, entity_id: UUID | None, callback: Any) -> Any:
        """Execute a callback with entity context for Entity RLS."""
        _ = entity_id  # Entity ID for RLS context, subclasses may use
        return await callback()

    # Agent methods
    @abstractmethod
    async def get_agent(self, agent_id: UUID) -> Any | None:
        """Get agent by ID."""
        ...

    @abstractmethod
    async def get_agents(self) -> list[Any]:
        """Get all agents."""
        ...

    @abstractmethod
    async def create_agent(self, agent: Any) -> bool:
        """Create a new agent."""
        ...

    @abstractmethod
    async def update_agent(self, agent_id: UUID, agent: Any) -> bool:
        """Update an agent."""
        ...

    @abstractmethod
```