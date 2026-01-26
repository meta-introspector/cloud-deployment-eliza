# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    @abstractmethod
    async def click(
        self, selector: str | ElementSelector, options: ClickOptions | None = None
    ) -> None:
        """Click on an element."""
        ...

    @abstractmethod
    async def type_text(self, selector: str, text: str, options: TypeOptions | None = None) -> None:
        """Type text into an input field."""
        ...

    @abstractmethod
    async def wait_for_element(self, selector: str | ElementSelector) -> None:
        """Wait for an element to appear."""
        ...

    @abstractmethod
    async def evaluate(self, script: str, *args: object) -> object:
        """Evaluate JavaScript in the browser context."""
        ...

    @abstractmethod
    async def get_current_url(self) -> str:
        """Get the current page URL."""
        ...

    @abstractmethod
    async def go_back(self) -> None:
        """Go back in browser history."""
        ...

    @abstractmethod
    async def go_forward(self) -> None:
        """Go forward in browser history."""
        ...

    @abstractmethod
    async def refresh(self) -> None:
        """Refresh the current page."""
        ...


# ============================================================================
# PDF Interfaces
# ============================================================================


class PdfMetadata(BaseModel):
    """PDF metadata."""

    title: str | None = None
    author: str | None = None
    created_at: datetime | None = None
    modified_at: datetime | None = None


class PdfExtractionResult(BaseModel):
    """PDF text extraction result."""

    text: str = Field(..., description="Extracted text")
    page_count: int = Field(..., description="Total page count")
    metadata: PdfMetadata | None = None


class PdfMargins(BaseModel):
    """PDF page margins."""

    top: float | None = None
    bottom: float | None = None
    left: float | None = None
    right: float | None = None


class PdfGenerationOptions(BaseModel):
    """PDF generation options."""

    format: Literal["A4", "A3", "Letter"] | None = None
    orientation: Literal["portrait", "landscape"] | None = None
    margins: PdfMargins | None = None
    header: str | None = None
    footer: str | None = None


class PdfConversionOptions(BaseModel):
    """PDF conversion options."""

    quality: Literal["high", "medium", "low"] | None = None
    output_format: Literal["pdf", "pdf/a"] | None = None
    compression: bool | None = None


class IPdfService(Service):
    """Interface for PDF processing services."""

    service_type: ClassVar[str] = ServiceType.PDF

    @property
    def capability_description(self) -> str:
        return "PDF processing, extraction, and generation capabilities"

    @abstractmethod
    async def extract_text(self, pdf_path: str | bytes) -> PdfExtractionResult:
        """Extract text and metadata from a PDF file."""
        ...

    @abstractmethod
    async def generate_pdf(
        self, html_content: str, options: PdfGenerationOptions | None = None
    ) -> bytes:
        """Generate a PDF from HTML content."""
        ...

    @abstractmethod
    async def convert_to_pdf(
        self, file_path: str, options: PdfConversionOptions | None = None
    ) -> bytes:
        """Convert a document to PDF format."""
        ...

    @abstractmethod
    async def merge_pdfs(self, pdf_paths: list[str | bytes]) -> bytes:
        """Merge multiple PDF files into one."""
        ...

    @abstractmethod
    async def split_pdf(self, pdf_path: str | bytes) -> list[bytes]:
        """Split a PDF into individual pages."""
        ...


# ============================================================================
# Web Search Interfaces
# ============================================================================


class SearchDateRange(BaseModel):
    """Date range for search filtering."""

    start: datetime | None = None
    end: datetime | None = None


class WebSearchBaseOptions(BaseModel):
    """Web search options."""

    limit: int | None = None
    offset: int | None = None
    language: str | None = None
    region: str | None = None
```