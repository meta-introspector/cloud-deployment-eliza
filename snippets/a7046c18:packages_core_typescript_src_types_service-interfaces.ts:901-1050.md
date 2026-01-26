# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  pageCount: number;
  /** PDF metadata */
  metadata?: {
    title?: string;
    author?: string;
    createdAt?: Date;
    modifiedAt?: Date;
  };
}

/**
 * PDF generation options.
 */
export interface PdfGenerationOptions {
  /** Paper format */
  format?: "A4" | "A3" | "Letter";
  /** Page orientation */
  orientation?: "portrait" | "landscape";
  /** Page margins */
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  /** Header content */
  header?: string;
  /** Footer content */
  footer?: string;
}

/**
 * PDF conversion options.
 */
export interface PdfConversionOptions {
  /** Output quality */
  quality?: "high" | "medium" | "low";
  /** Output format */
  outputFormat?: "pdf" | "pdf/a";
  /** Enable compression */
  compression?: boolean;
}

/**
 * Interface for PDF processing services.
 */
export abstract class IPdfService extends Service {
  static override readonly serviceType = ServiceType.PDF;

  public readonly capabilityDescription =
    "PDF processing, extraction, and generation capabilities";

  /**
   * Extract text and metadata from a PDF file.
   * @param pdfPath Path to the PDF file or buffer.
   */
  abstract extractText(pdfPath: string | Buffer): Promise<PdfExtractionResult>;

  /**
   * Generate a PDF from HTML content.
   * @param htmlContent HTML content to convert.
   * @param options PDF generation options.
   * @returns PDF buffer.
   */
  abstract generatePdf(
    htmlContent: string,
    options?: PdfGenerationOptions,
  ): Promise<Buffer>;

  /**
   * Convert a document to PDF format.
   * @param filePath Path to the document file.
   * @param options Conversion options.
   * @returns PDF buffer.
   */
  abstract convertToPdf(
    filePath: string,
    options?: PdfConversionOptions,
  ): Promise<Buffer>;

  /**
   * Merge multiple PDF files into one.
   * @param pdfPaths Array of PDF file paths or buffers.
   * @returns Merged PDF buffer.
   */
  abstract mergePdfs(pdfPaths: (string | Buffer)[]): Promise<Buffer>;

  /**
   * Split a PDF into individual pages.
   * @param pdfPath Path to the PDF file or buffer.
   * @returns Array of page buffers.
   */
  abstract splitPdf(pdfPath: string | Buffer): Promise<Buffer[]>;
}

// ============================================================================
// Web Search Interfaces
// ============================================================================

/**
 * Web search options.
 */
export interface SearchOptions {
  /** Maximum results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Language code */
  language?: string;
  /** Region code */
  region?: string;
  /** Date range filter */
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  /** File type filter */
  fileType?: string;
  /** Limit to specific site */
  site?: string;
  /** Sort order */
  sortBy?: "relevance" | "date" | "popularity";
  /** Safe search level */
  safeSearch?: "strict" | "moderate" | "off";
}

/**
 * A single search result.
 */
export interface SearchResult {
  /** Result title */
  title: string;
  /** Result URL */
  url: string;
  /** Result description/snippet */
  description: string;
  /** Display URL */
  displayUrl?: string;
  /** Thumbnail URL */
  thumbnail?: string;
  /** Published date */
  publishedDate?: Date;
  /** Source name */
  source?: string;
  /** Relevance score */
  relevanceScore?: number;
  /** Text snippet */
  snippet?: string;
}

```