# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Extracted content from a page.
 */
export interface ExtractedContent {
  /** Text content */
  text: string;
  /** HTML content */
  html: string;
  /** Links found on page */
  links: Array<{
    url: string;
    text: string;
  }>;
  /** Images found on page */
  images: Array<{
    src: string;
    alt?: string;
  }>;
  /** Page title */
  title?: string;
  /** Page metadata */
  metadata?: Record<string, string>;
}

/**
 * Click options.
 */
export interface ClickOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Force click even if element is obscured */
  force?: boolean;
  /** Wait for navigation after click */
  waitForNavigation?: boolean;
}

/**
 * Type/input options.
 */
export interface TypeOptions {
  /** Delay between keystrokes */
  delay?: number;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Clear field before typing */
  clear?: boolean;
}

/**
 * Interface for browser automation services.
 */
export abstract class IBrowserService extends Service {
  static override readonly serviceType = ServiceType.BROWSER;

  public readonly capabilityDescription =
    "Web browser automation and scraping capabilities";

  /**
   * Navigate to a URL.
   * @param url URL to navigate to.
   * @param options Navigation options.
   */
  abstract navigate(
    url: string,
    options?: BrowserNavigationOptions,
  ): Promise<void>;

  /**
   * Take a screenshot of the current page.
   * @param options Screenshot options.
   * @returns Screenshot buffer.
   */
  abstract screenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Extract text and content from the current page.
   * @param selector Optional CSS selector to extract from.
   */
  abstract extractContent(selector?: string): Promise<ExtractedContent>;

  /**
   * Click on an element.
   * @param selector CSS selector or element selector.
   * @param options Click options.
   */
  abstract click(
    selector: string | ElementSelector,
    options?: ClickOptions,
  ): Promise<void>;

  /**
   * Type text into an input field.
   * @param selector CSS selector for input field.
   * @param text Text to type.
   * @param options Typing options.
   */
  abstract type(
    selector: string,
    text: string,
    options?: TypeOptions,
  ): Promise<void>;

  /**
   * Wait for an element to appear.
   * @param selector CSS selector or element selector.
   */
  abstract waitForElement(selector: string | ElementSelector): Promise<void>;

  /**
   * Evaluate JavaScript in the browser context.
   * @param script JavaScript code to evaluate.
   * @param args Arguments to pass to the script.
   */
  abstract evaluate<T = unknown>(
    script: string,
    ...args: unknown[]
  ): Promise<T>;

  /**
   * Get the current page URL.
   */
  abstract getCurrentUrl(): Promise<string>;

  /**
   * Go back in browser history.
   */
  abstract goBack(): Promise<void>;

  /**
   * Go forward in browser history.
   */
  abstract goForward(): Promise<void>;

  /**
   * Refresh the current page.
   */
  abstract refresh(): Promise<void>;
}

// ============================================================================
// PDF Interfaces
// ============================================================================

/**
 * PDF text extraction result.
 */
export interface PdfExtractionResult {
  /** Extracted text */
  text: string;
  /** Total page count */
```