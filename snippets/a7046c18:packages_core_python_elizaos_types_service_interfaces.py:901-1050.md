# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    from_address: EmailAddress = Field(..., alias="from", description="Sender address")
    to: list[EmailAddress] = Field(..., description="Recipients")
    cc: list[EmailAddress] | None = None
    bcc: list[EmailAddress] | None = None
    subject: str = Field(..., description="Email subject")
    text: str | None = None
    html: str | None = None
    attachments: list[EmailAttachment] | None = None
    reply_to: EmailAddress | None = None
    date: datetime | None = None
    message_id: str | None = None
    references: list[str] | None = None
    in_reply_to: str | None = None
    priority: Literal["high", "normal", "low"] | None = None

    model_config = {"populate_by_name": True}


class EmailSendOptions(BaseModel):
    """Email send options."""

    retry: int | None = None
    timeout: int | None = None
    track_opens: bool | None = None
    track_clicks: bool | None = None
    tags: list[str] | None = None


class EmailSearchOptions(BaseModel):
    """Email search options."""

    query: str | None = None
    from_address: str | None = Field(None, alias="from")
    to: str | None = None
    subject: str | None = None
    folder: str | None = None
    since: datetime | None = None
    before: datetime | None = None
    limit: int | None = None
    offset: int | None = None
    unread: bool | None = None
    flagged: bool | None = None
    has_attachments: bool | None = None

    model_config = {"populate_by_name": True}


class EmailFolder(BaseModel):
    """Email folder."""

    name: str = Field(..., description="Folder name")
    path: str = Field(..., description="Folder path")
    folder_type: Literal["inbox", "sent", "drafts", "trash", "spam", "custom"] = Field(
        ..., alias="type", description="Folder type"
    )
    message_count: int | None = None
    unread_count: int | None = None
    children: list[EmailFolder] | None = None

    model_config = {"populate_by_name": True}


class EmailAccount(BaseModel):
    """Email account information."""

    email: str = Field(..., description="Email address")
    name: str | None = None
    provider: str | None = None
    folders: list[EmailFolder] | None = None
    quota_used: int | None = None
    quota_limit: int | None = None


class IEmailService(Service):
    """Interface for email services."""

    service_type: ClassVar[str] = ServiceType.EMAIL

    @property
    def capability_description(self) -> str:
        return "Email sending, receiving, and management capabilities"

    @abstractmethod
    async def send_email(
        self, message: EmailMessage, options: EmailSendOptions | None = None
    ) -> str:
        """Send an email."""
        ...

    @abstractmethod
    async def get_emails(self, options: EmailSearchOptions | None = None) -> list[EmailMessage]:
        """Get emails from a folder."""
        ...

    @abstractmethod
    async def get_email(self, message_id: str) -> EmailMessage:
        """Get a specific email by ID."""
        ...

    @abstractmethod
    async def delete_email(self, message_id: str) -> None:
        """Delete an email."""
        ...

    @abstractmethod
    async def mark_email_as_read(self, message_id: str, read: bool) -> None:
        """Mark an email as read/unread."""
        ...

    @abstractmethod
    async def flag_email(self, message_id: str, flagged: bool) -> None:
        """Flag/unflag an email."""
        ...

    @abstractmethod
    async def move_email(self, message_id: str, folder_path: str) -> None:
        """Move email to a different folder."""
        ...

    @abstractmethod
    async def get_folders(self) -> list[EmailFolder]:
        """Get available folders."""
        ...

    @abstractmethod
    async def create_folder(self, folder_name: str, parent_path: str | None = None) -> None:
        """Create a new folder."""
        ...

    @abstractmethod
    async def get_account_info(self) -> EmailAccount:
        """Get account information."""
        ...

    @abstractmethod
    async def search_emails(
        self, query: str, options: EmailSearchOptions | None = None
    ) -> list[EmailMessage]:
        """Search emails."""
        ...


# ============================================================================
# Messaging Interfaces
# ============================================================================


class MessageParticipant(BaseModel):
    """Message participant information."""

```