# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    def capability_description(self) -> str:
        return "Video download, processing, and conversion capabilities"

    @abstractmethod
    async def get_video_info(self, url: str) -> VideoInfo:
        """Get video information without downloading."""
        ...

    @abstractmethod
    async def download_video(self, url: str, options: VideoDownloadOptions | None = None) -> str:
        """Download a video from URL."""
        ...

    @abstractmethod
    async def extract_audio(self, video_path: str, output_path: str | None = None) -> str:
        """Extract audio from video."""
        ...

    @abstractmethod
    async def get_thumbnail(self, video_path: str, timestamp: float | None = None) -> str:
        """Generate thumbnail from video."""
        ...

    @abstractmethod
    async def convert_video(
        self, video_path: str, output_path: str, options: VideoProcessingOptions | None = None
    ) -> str:
        """Convert video to different format."""
        ...

    @abstractmethod
    async def get_available_formats(self, url: str) -> list[VideoFormat]:
        """Get available formats for a video URL."""
        ...


# ============================================================================
# Browser Interfaces
# ============================================================================


class BrowserViewport(BaseModel):
    """Browser viewport size."""

    width: int = Field(..., description="Width in pixels")
    height: int = Field(..., description="Height in pixels")


class BrowserNavigationOptions(BaseModel):
    """Browser navigation options."""

    timeout: int | None = None
    wait_until: Literal["load", "domcontentloaded", "networkidle0", "networkidle2"] | None = None
    viewport: BrowserViewport | None = None
    user_agent: str | None = None
    headers: dict[str, str] | None = None


class ScreenshotClip(BaseModel):
    """Screenshot clip region."""

    x: int = Field(..., description="X position")
    y: int = Field(..., description="Y position")
    width: int = Field(..., description="Width")
    height: int = Field(..., description="Height")


class ScreenshotOptions(BaseModel):
    """Screenshot options."""

    full_page: bool | None = None
    clip: ScreenshotClip | None = None
    format: Literal["png", "jpeg", "webp"] | None = None
    quality: int | None = None
    omit_background: bool | None = None


class ElementSelector(BaseModel):
    """Element selector options."""

    selector: str = Field(..., description="CSS selector")
    text: str | None = None
    timeout: int | None = None


class ExtractedLink(BaseModel):
    """Extracted link from page."""

    url: str = Field(..., description="Link URL")
    text: str = Field(..., description="Link text")


class ExtractedImage(BaseModel):
    """Extracted image from page."""

    src: str = Field(..., description="Image source")
    alt: str | None = None


class ExtractedContent(BaseModel):
    """Extracted content from a page."""

    text: str = Field(..., description="Text content")
    html: str = Field(..., description="HTML content")
    links: list[ExtractedLink] = Field(default_factory=list, description="Links found")
    images: list[ExtractedImage] = Field(default_factory=list, description="Images found")
    title: str | None = None
    metadata: dict[str, str] | None = None


class ClickOptions(BaseModel):
    """Click options."""

    timeout: int | None = None
    force: bool | None = None
    wait_for_navigation: bool | None = None


class TypeOptions(BaseModel):
    """Type/input options."""

    delay: int | None = None
    timeout: int | None = None
    clear: bool | None = None


class IBrowserService(Service):
    """Interface for browser automation services."""

    service_type: ClassVar[str] = ServiceType.BROWSER

    @property
    def capability_description(self) -> str:
        return "Web browser automation and scraping capabilities"

    @abstractmethod
    async def navigate(self, url: str, options: BrowserNavigationOptions | None = None) -> None:
        """Navigate to a URL."""
        ...

    @abstractmethod
    async def screenshot(self, options: ScreenshotOptions | None = None) -> bytes:
        """Take a screenshot of the current page."""
        ...

    @abstractmethod
    async def extract_content(self, selector: str | None = None) -> ExtractedContent:
        """Extract text and content from the current page."""
        ...

```