# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    id: str = Field(..., description="Participant ID (UUID)")
    name: str = Field(..., description="Display name")
    username: str | None = None
    avatar: str | None = None
    status: Literal["online", "offline", "away", "busy"] | None = None


class MessageAttachment(BaseModel):
    """Message attachment."""

    id: str = Field(..., description="Attachment ID (UUID)")
    filename: str = Field(..., description="Filename")
    url: str = Field(..., description="File URL")
    mime_type: str = Field(..., description="MIME type")
    size: int = Field(..., description="File size in bytes")
    width: int | None = None
    height: int | None = None
    duration: float | None = None
    thumbnail: str | None = None


class MessageReaction(BaseModel):
    """Message reaction."""

    emoji: str = Field(..., description="Emoji used")
    count: int = Field(..., description="Number of reactions")
    users: list[str] = Field(default_factory=list, description="User IDs who reacted")
    has_reacted: bool = Field(..., description="Whether current user has reacted")


class MessageReference(BaseModel):
    """Message reference (reply/forward/quote)."""

    message_id: str = Field(..., description="Referenced message ID")
    channel_id: str = Field(..., description="Channel of referenced message")
    ref_type: Literal["reply", "forward", "quote"] = Field(
        ..., alias="type", description="Type of reference"
    )

    model_config = {"populate_by_name": True}


class EmbedField(BaseModel):
    """Embed field."""

    name: str = Field(..., description="Field name")
    value: str = Field(..., description="Field value")
    inline: bool | None = None


class MessageEmbed(BaseModel):
    """Message embed."""

    title: str | None = None
    description: str | None = None
    url: str | None = None
    image: str | None = None
    fields: list[EmbedField] | None = None


class MessageContent(BaseModel):
    """Message content."""

    text: str | None = None
    html: str | None = None
    markdown: str | None = None
    attachments: list[MessageAttachment] | None = None
    reactions: list[MessageReaction] | None = None
    reference: MessageReference | None = None
    mentions: list[str] | None = None
    embeds: list[MessageEmbed] | None = None


class MessageThread(BaseModel):
    """Thread information."""

    id: str = Field(..., description="Thread ID")
    message_count: int = Field(..., description="Number of messages")
    participants: list[str] = Field(default_factory=list, description="Participant IDs")
    last_message_at: datetime = Field(..., description="Last message timestamp")


class MessageInfo(BaseModel):
    """Message information."""

    id: str = Field(..., description="Message ID (UUID)")
    channel_id: str = Field(..., description="Channel ID")
    sender_id: str = Field(..., description="Sender ID")
    content: MessageContent = Field(..., description="Message content")
    timestamp: datetime = Field(..., description="Sent timestamp")
    edited: datetime | None = None
    deleted: datetime | None = None
    pinned: bool | None = None
    thread: MessageThread | None = None


class MessageSendOptions(BaseModel):
    """Message send options."""

    reply_to: str | None = None
    ephemeral: bool | None = None
    silent: bool | None = None
    scheduled: datetime | None = None
    thread: str | None = None
    nonce: str | None = None


class MessageSearchOptions(BaseModel):
    """Message search options."""

    query: str | None = None
    channel_id: str | None = None
    sender_id: str | None = None
    before: datetime | None = None
    after: datetime | None = None
    limit: int | None = None
    offset: int | None = None
    has_attachments: bool | None = None
    pinned: bool | None = None
    mentions: str | None = None


class ChannelPermissions(BaseModel):
    """Channel permissions."""

    can_send: bool = Field(..., description="Can send messages")
    can_read: bool = Field(..., description="Can read messages")
    can_delete: bool = Field(..., description="Can delete messages")
    can_pin: bool = Field(..., description="Can pin messages")
    can_manage: bool = Field(..., description="Can manage channel")


class MessageChannel(BaseModel):
    """Message channel."""

    id: str = Field(..., description="Channel ID (UUID)")
    name: str = Field(..., description="Channel name")
    channel_type: Literal["text", "voice", "dm", "group", "announcement", "thread"] = Field(
        ..., alias="type", description="Channel type"
    )
    description: str | None = None
    participants: list[MessageParticipant] | None = None
    permissions: ChannelPermissions | None = None
    last_message_at: datetime | None = None
    message_count: int | None = None
    unread_count: int | None = None

    model_config = {"populate_by_name": True}


```