# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    date_range: SearchDateRange | None = None
    file_type: str | None = None
    site: str | None = None
    sort_by: Literal["relevance", "date", "popularity"] | None = None
    safe_search: Literal["strict", "moderate", "off"] | None = None


class SearchResult(BaseModel):
    """A single search result."""

    title: str = Field(..., description="Result title")
    url: str = Field(..., description="Result URL")
    description: str = Field(..., description="Result description")
    display_url: str | None = None
    thumbnail: str | None = None
    published_date: datetime | None = None
    source: str | None = None
    relevance_score: float | None = None
    snippet: str | None = None


class SearchResponse(BaseModel):
    """Search response containing results."""

    query: str = Field(..., description="Original query")
    results: list[SearchResult] = Field(default_factory=list, description="Search results")
    total_results: int | None = None
    search_time: float | None = None
    suggestions: list[str] | None = None
    next_page_token: str | None = None
    related_searches: list[str] | None = None


class NewsSearchOptions(WebSearchBaseOptions):
    """News search options."""

    category: (
        Literal["general", "business", "entertainment", "health", "science", "sports", "technology"]
        | None
    ) = None
    freshness: Literal["day", "week", "month"] | None = None


class ImageSearchOptions(WebSearchBaseOptions):
    """Image search options."""

    size: Literal["small", "medium", "large", "wallpaper", "any"] | None = None
    color: str | None = None
    image_type: Literal["photo", "clipart", "line", "animated"] | None = None
    layout: Literal["square", "wide", "tall", "any"] | None = None
    license: Literal["any", "public", "share", "sharecommercially", "modify"] | None = None


class VideoSearchOptions(WebSearchBaseOptions):
    """Video search options."""

    duration: Literal["short", "medium", "long", "any"] | None = None
    resolution: Literal["high", "standard", "any"] | None = None
    quality: Literal["high", "standard", "any"] | None = None


class PageInfo(BaseModel):
    """Detailed page information."""

    title: str = Field(..., description="Page title")
    description: str = Field(..., description="Page description")
    content: str = Field(..., description="Page content")
    metadata: dict[str, str] = Field(default_factory=dict, description="Page metadata")
    images: list[str] = Field(default_factory=list, description="Image URLs")
    links: list[str] = Field(default_factory=list, description="Link URLs")


class IWebSearchService(Service):
    """Interface for web search services."""

    service_type: ClassVar[str] = ServiceType.WEB_SEARCH

    @property
    def capability_description(self) -> str:
        return "Web search and content discovery capabilities"

    @abstractmethod
    async def search(
        self, query: str, options: WebSearchBaseOptions | None = None
    ) -> SearchResponse:
        """Perform a general web search."""
        ...

    @abstractmethod
    async def search_news(
        self, query: str, options: NewsSearchOptions | None = None
    ) -> SearchResponse:
        """Search for news articles."""
        ...

    @abstractmethod
    async def search_images(
        self, query: str, options: ImageSearchOptions | None = None
    ) -> SearchResponse:
        """Search for images."""
        ...

    @abstractmethod
    async def search_videos(
        self, query: str, options: VideoSearchOptions | None = None
    ) -> SearchResponse:
        """Search for videos."""
        ...

    @abstractmethod
    async def get_suggestions(self, query: str) -> list[str]:
        """Get search suggestions for a query."""
        ...

    @abstractmethod
    async def get_trending_searches(self, region: str | None = None) -> list[str]:
        """Get trending searches."""
        ...

    @abstractmethod
    async def get_page_info(self, url: str) -> PageInfo:
        """Get detailed information about a specific URL."""
        ...


# ============================================================================
# Email Interfaces
# ============================================================================


class EmailAddress(BaseModel):
    """Email address with optional name."""

    email: str = Field(..., description="Email address")
    name: str | None = None


class EmailAttachment(BaseModel):
    """Email attachment."""

    filename: str = Field(..., description="Filename")
    content: bytes | str = Field(..., description="Content as bytes or base64")
    content_type: str | None = None
    content_disposition: Literal["attachment", "inline"] | None = None
    cid: str | None = None


class EmailMessage(BaseModel):
    """Email message."""

```