# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
class IMessagingService(Service):
    """Interface for platform messaging services (Discord, Slack, etc)."""

    service_type: ClassVar[str] = ServiceType.MESSAGE

    @property
    def capability_description(self) -> str:
        return "Platform messaging and channel management capabilities"

    @abstractmethod
    async def send_message(
        self, channel_id: str, content: MessageContent, options: MessageSendOptions | None = None
    ) -> str:
        """Send a message to a channel."""
        ...

    @abstractmethod
    async def get_messages(
        self, channel_id: str, options: MessageSearchOptions | None = None
    ) -> list[MessageInfo]:
        """Get messages from a channel."""
        ...

    @abstractmethod
    async def get_message(self, message_id: str) -> MessageInfo:
        """Get a specific message by ID."""
        ...

    @abstractmethod
    async def edit_message(self, message_id: str, content: MessageContent) -> None:
        """Edit a message."""
        ...

    @abstractmethod
    async def delete_message(self, message_id: str) -> None:
        """Delete a message."""
        ...

    @abstractmethod
    async def add_reaction(self, message_id: str, emoji: str) -> None:
        """Add a reaction to a message."""
        ...

    @abstractmethod
    async def remove_reaction(self, message_id: str, emoji: str) -> None:
        """Remove a reaction from a message."""
        ...

    @abstractmethod
    async def pin_message(self, message_id: str) -> None:
        """Pin a message."""
        ...

    @abstractmethod
    async def unpin_message(self, message_id: str) -> None:
        """Unpin a message."""
        ...

    @abstractmethod
    async def get_channels(self) -> list[MessageChannel]:
        """Get available channels."""
        ...

    @abstractmethod
    async def get_channel(self, channel_id: str) -> MessageChannel:
        """Get channel information."""
        ...

    @abstractmethod
    async def create_channel(
        self,
        name: str,
        channel_type: str,
        description: str | None = None,
        participants: list[str] | None = None,
        private: bool | None = None,
    ) -> str:
        """Create a new channel."""
        ...

    @abstractmethod
    async def search_messages(
        self, query: str, options: MessageSearchOptions | None = None
    ) -> list[MessageInfo]:
        """Search messages across channels."""
        ...


# ============================================================================
# Post/Social Media Interfaces
# ============================================================================


class PostMedia(BaseModel):
    """Post media content."""

    id: str = Field(..., description="Media ID (UUID)")
    url: str = Field(..., description="Media URL")
    media_type: Literal["image", "video", "audio", "document"] = Field(
        ..., alias="type", description="Media type"
    )
    mime_type: str = Field(..., description="MIME type")
    size: int = Field(..., description="File size in bytes")
    width: int | None = None
    height: int | None = None
    duration: float | None = None
    thumbnail: str | None = None
    description: str | None = None
    alt_text: str | None = None

    model_config = {"populate_by_name": True}


class PostLocation(BaseModel):
    """Post location."""

    name: str = Field(..., description="Location name")
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    place_id: str | None = None


class PostAuthor(BaseModel):
    """Post author information."""

    id: str = Field(..., description="Author ID (UUID)")
    username: str = Field(..., description="Username")
    display_name: str = Field(..., description="Display name")
    avatar: str | None = None
    verified: bool | None = None
    follower_count: int | None = None
    following_count: int | None = None
    bio: str | None = None
    website: str | None = None


class PostEngagement(BaseModel):
    """Post engagement metrics."""

    likes: int = Field(..., description="Number of likes")
    shares: int = Field(..., description="Number of shares")
    comments: int = Field(..., description="Number of comments")
    views: int | None = None
    has_liked: bool = Field(..., description="Whether current user has liked")
    has_shared: bool = Field(..., description="Whether current user has shared")
    has_commented: bool = Field(..., description="Whether current user has commented")
    has_saved: bool = Field(..., description="Whether current user has saved")


```