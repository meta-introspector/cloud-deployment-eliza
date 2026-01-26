# a7046c18:packages_core_python_elizaos_types_database.py:601-634

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/database.py:601-634
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    @abstractmethod
    async def create_task(self, task: Any) -> UUID:
        """Create a task."""
        ...

    @abstractmethod
    async def get_tasks(self, params: dict[str, Any]) -> list[Any]:
        """Get tasks."""
        ...

    @abstractmethod
    async def get_task(self, id: UUID) -> Any | None:
        """Get task by ID."""
        ...

    @abstractmethod
    async def get_tasks_by_name(self, name: str) -> list[Any]:
        """Get tasks by name."""
        ...

    @abstractmethod
    async def update_task(self, id: UUID, task: dict[str, Any]) -> None:
        """Update a task."""
        ...

    @abstractmethod
    async def delete_task(self, id: UUID) -> None:
        """Delete a task."""
        ...

    @abstractmethod
    async def get_memories_by_world_id(self, params: dict[str, Any]) -> list[Any]:
        """Get memories by world ID."""
        ...
```