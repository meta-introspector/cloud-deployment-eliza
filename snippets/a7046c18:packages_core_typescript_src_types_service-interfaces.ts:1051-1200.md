# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Search response containing results.
 */
export interface SearchResponse {
  /** Original query */
  query: string;
  /** Search results */
  results: SearchResult[];
  /** Total available results */
  totalResults?: number;
  /** Search time in seconds */
  searchTime?: number;
  /** Query suggestions */
  suggestions?: string[];
  /** Token for next page */
  nextPageToken?: string;
  /** Related search queries */
  relatedSearches?: string[];
}

/**
 * News search options.
 */
export interface NewsSearchOptions extends SearchOptions {
  /** News category */
  category?:
    | "general"
    | "business"
    | "entertainment"
    | "health"
    | "science"
    | "sports"
    | "technology";
  /** Freshness filter */
  freshness?: "day" | "week" | "month";
}

/**
 * Image search options.
 */
export interface ImageSearchOptions extends SearchOptions {
  /** Image size filter */
  size?: "small" | "medium" | "large" | "wallpaper" | "any";
  /** Color filter */
  color?:
    | "color"
    | "monochrome"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "brown"
    | "black"
    | "gray"
    | "white";
  /** Image type filter */
  type?: "photo" | "clipart" | "line" | "animated";
  /** Image layout filter */
  layout?: "square" | "wide" | "tall" | "any";
  /** License filter */
  license?: "any" | "public" | "share" | "sharecommercially" | "modify";
}

/**
 * Video search options.
 */
export interface VideoSearchOptions extends SearchOptions {
  /** Duration filter */
  duration?: "short" | "medium" | "long" | "any";
  /** Resolution filter */
  resolution?: "high" | "standard" | "any";
  /** Quality filter */
  quality?: "high" | "standard" | "any";
}

/**
 * Interface for web search services.
 */
export abstract class IWebSearchService extends Service {
  static override readonly serviceType = ServiceType.WEB_SEARCH;

  public readonly capabilityDescription =
    "Web search and content discovery capabilities";

  /**
   * Perform a general web search.
   * @param query Search query.
   * @param options Search options.
   */
  abstract search(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResponse>;

  /**
   * Search for news articles.
   * @param query Search query.
   * @param options News search options.
   */
  abstract searchNews(
    query: string,
    options?: NewsSearchOptions,
  ): Promise<SearchResponse>;

  /**
   * Search for images.
   * @param query Search query.
   * @param options Image search options.
   */
  abstract searchImages(
    query: string,
    options?: ImageSearchOptions,
  ): Promise<SearchResponse>;

  /**
   * Search for videos.
   * @param query Search query.
   * @param options Video search options.
   */
  abstract searchVideos(
    query: string,
    options?: VideoSearchOptions,
  ): Promise<SearchResponse>;

  /**
   * Get search suggestions for a query.
   * @param query Partial search query.
   */
  abstract getSuggestions(query: string): Promise<string[]>;

  /**
   * Get trending searches.
   * @param region Optional region code.
   */
  abstract getTrendingSearches(region?: string): Promise<string[]>;

  /**
   * Get detailed information about a specific URL.
   * @param url URL to analyze.
   */
  abstract getPageInfo(url: string): Promise<{
    title: string;
    description: string;
    content: string;
    metadata: Record<string, string>;
    images: string[];
    links: string[];
```