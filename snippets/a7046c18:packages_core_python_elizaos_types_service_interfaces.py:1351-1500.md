# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
class PostLinkPreview(BaseModel):
    """Link preview in post."""

    url: str = Field(..., description="Link URL")
    title: str | None = None
    description: str | None = None
    image: str | None = None


class PollOption(BaseModel):
    """Poll option."""

    text: str = Field(..., description="Option text")
    votes: int = Field(..., description="Number of votes")


class PostPoll(BaseModel):
    """Post poll."""

    question: str = Field(..., description="Poll question")
    options: list[PollOption] = Field(..., description="Poll options")
    expires_at: datetime | None = None
    multiple_choice: bool | None = None


class PostContent(BaseModel):
    """Post content."""

    text: str | None = None
    html: str | None = None
    media: list[PostMedia] | None = None
    location: PostLocation | None = None
    tags: list[str] | None = None
    mentions: list[str] | None = None
    links: list[PostLinkPreview] | None = None
    poll: PostPoll | None = None


class PostThread(BaseModel):
    """Post thread information."""

    id: str = Field(..., description="Thread ID")
    position: int = Field(..., description="Position in thread")
    total: int = Field(..., description="Total posts in thread")


class CrossPostedInfo(BaseModel):
    """Cross-post information."""

    platform: str = Field(..., description="Platform name")
    platform_id: str = Field(..., description="Platform-specific ID")
    url: str = Field(..., description="Post URL")


class PostInfo(BaseModel):
    """Post information."""

    id: str = Field(..., description="Post ID (UUID)")
    author: PostAuthor = Field(..., description="Post author")
    content: PostContent = Field(..., description="Post content")
    platform: str = Field(..., description="Platform name")
    platform_id: str = Field(..., description="Platform-specific ID")
    url: str = Field(..., description="Post URL")
    created_at: datetime = Field(..., description="Created timestamp")
    edited_at: datetime | None = None
    scheduled_at: datetime | None = None
    engagement: PostEngagement = Field(..., description="Engagement metrics")
    visibility: Literal["public", "private", "followers", "friends", "unlisted"] = Field(
        ..., description="Visibility level"
    )
    reply_to: str | None = None
    thread: PostThread | None = None
    cross_posted: list[CrossPostedInfo] | None = None


class PostCreateOptions(BaseModel):
    """Post creation options."""

    platforms: list[str] | None = None
    scheduled_at: datetime | None = None
    visibility: Literal["public", "private", "followers", "friends", "unlisted"] | None = None
    reply_to: str | None = None
    thread: bool | None = None
    location: PostLocation | None = None
    tags: list[str] | None = None
    mentions: list[str] | None = None
    enable_comments: bool | None = None
    enable_sharing: bool | None = None
    content_warning: str | None = None
    sensitive: bool | None = None


class PostSearchOptions(BaseModel):
    """Post search options."""

    query: str | None = None
    author: str | None = None
    platform: str | None = None
    tags: list[str] | None = None
    mentions: list[str] | None = None
    since: datetime | None = None
    before: datetime | None = None
    limit: int | None = None
    offset: int | None = None
    has_media: bool | None = None
    has_location: bool | None = None
    visibility: Literal["public", "private", "followers", "friends", "unlisted"] | None = None
    sort_by: Literal["date", "engagement", "relevance"] | None = None


class DemographicsData(BaseModel):
    """Demographics data."""

    age: dict[str, int] | None = None
    gender: dict[str, int] | None = None
    location: dict[str, int] | None = None


class PerformingHour(BaseModel):
    """Top performing hour."""

    hour: int = Field(..., description="Hour of day (0-23)")
    engagement: int = Field(..., description="Engagement count")


class PostAnalytics(BaseModel):
    """Post analytics."""

    post_id: str = Field(..., description="Post ID (UUID)")
    platform: str = Field(..., description="Platform name")
    impressions: int = Field(..., description="Total impressions")
    reach: int = Field(..., description="Unique reach")
    engagement: PostEngagement = Field(..., description="Engagement metrics")
    clicks: int = Field(..., description="Link clicks")
    shares: int = Field(..., description="Shares")
    saves: int = Field(..., description="Saves")
    demographics: DemographicsData | None = None
    top_performing_hours: list[PerformingHour] | None = None


class IPostService(Service):
    """Interface for social media posting services."""

    service_type: ClassVar[str] = ServiceType.POST

    @property
    def capability_description(self) -> str:
        return "Social media posting and content management capabilities"

    @abstractmethod
```