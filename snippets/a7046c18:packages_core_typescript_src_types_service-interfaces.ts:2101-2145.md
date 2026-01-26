# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:2101-2145

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:2101-2145
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  /**
   * Get comments for a post.
   * @param postId Post ID.
   * @param options Search options.
   */
  abstract getComments(
    postId: UUID,
    options?: PostSearchOptions,
  ): Promise<PostInfo[]>;

  /**
   * Schedule a post for later publishing.
   * @param content Post content.
   * @param scheduledAt When to publish.
   * @param options Publishing options.
   * @returns Scheduled post ID.
   */
  abstract schedulePost(
    content: PostContent,
    scheduledAt: Date,
    options?: PostCreateOptions,
  ): Promise<UUID>;

  /**
   * Get analytics for a post.
   * @param postId Post ID.
   */
  abstract getPostAnalytics(postId: UUID): Promise<PostAnalytics>;

  /**
   * Get trending posts.
   * @param options Search options.
   */
  abstract getTrendingPosts(options?: PostSearchOptions): Promise<PostInfo[]>;

  /**
   * Search posts across platforms.
   * @param query Search query.
   * @param options Search options.
   */
  abstract searchPosts(
    query: string,
    options?: PostSearchOptions,
  ): Promise<PostInfo[]>;
}
```