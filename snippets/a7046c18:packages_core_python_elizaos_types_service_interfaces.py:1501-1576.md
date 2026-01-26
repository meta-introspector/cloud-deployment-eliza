# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:1501-1576

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:1501-1576
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    async def create_post(
        self, content: PostContent, options: PostCreateOptions | None = None
    ) -> str:
        """Create and publish a new post."""
        ...

    @abstractmethod
    async def get_posts(self, options: PostSearchOptions | None = None) -> list[PostInfo]:
        """Get posts from timeline or specific user."""
        ...

    @abstractmethod
    async def get_post(self, post_id: str) -> PostInfo:
        """Get a specific post by ID."""
        ...

    @abstractmethod
    async def edit_post(self, post_id: str, content: PostContent) -> None:
        """Edit an existing post."""
        ...

    @abstractmethod
    async def delete_post(self, post_id: str) -> None:
        """Delete a post."""
        ...

    @abstractmethod
    async def like_post(self, post_id: str, like: bool) -> None:
        """Like/unlike a post."""
        ...

    @abstractmethod
    async def share_post(self, post_id: str, comment: str | None = None) -> str:
        """Share/repost a post."""
        ...

    @abstractmethod
    async def save_post(self, post_id: str, save: bool) -> None:
        """Save/unsave a post."""
        ...

    @abstractmethod
    async def comment_on_post(self, post_id: str, content: PostContent) -> str:
        """Comment on a post."""
        ...

    @abstractmethod
    async def get_comments(
        self, post_id: str, options: PostSearchOptions | None = None
    ) -> list[PostInfo]:
        """Get comments for a post."""
        ...

    @abstractmethod
    async def schedule_post(
        self, content: PostContent, scheduled_at: datetime, options: PostCreateOptions | None = None
    ) -> str:
        """Schedule a post for later publishing."""
        ...

    @abstractmethod
    async def get_post_analytics(self, post_id: str) -> PostAnalytics:
        """Get analytics for a post."""
        ...

    @abstractmethod
    async def get_trending_posts(self, options: PostSearchOptions | None = None) -> list[PostInfo]:
        """Get trending posts."""
        ...

    @abstractmethod
    async def search_posts(
        self, query: str, options: PostSearchOptions | None = None
    ) -> list[PostInfo]:
        """Search posts across platforms."""
        ...
```