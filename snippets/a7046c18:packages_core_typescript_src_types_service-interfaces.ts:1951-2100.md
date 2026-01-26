# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1951-2100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1951-2100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  /** Enable comments */
  enableComments?: boolean;
  /** Enable sharing */
  enableSharing?: boolean;
  /** Content warning */
  contentWarning?: string;
  /** Mark as sensitive */
  sensitive?: boolean;
}

/**
 * Post search options.
 */
export interface PostSearchOptions {
  /** Search query */
  query?: string;
  /** Filter by author */
  author?: UUID;
  /** Filter by platform */
  platform?: string;
  /** Filter by tags */
  tags?: string[];
  /** Filter by mentions */
  mentions?: UUID[];
  /** Filter posts since date */
  since?: Date;
  /** Filter posts before date */
  before?: Date;
  /** Maximum results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Filter with media only */
  hasMedia?: boolean;
  /** Filter with location only */
  hasLocation?: boolean;
  /** Filter by visibility */
  visibility?: PostInfo["visibility"];
  /** Sort order */
  sortBy?: "date" | "engagement" | "relevance";
}

/**
 * Post analytics.
 */
export interface PostAnalytics {
  /** Post ID */
  postId: UUID;
  /** Platform name */
  platform: string;
  /** Total impressions */
  impressions: number;
  /** Unique reach */
  reach: number;
  /** Engagement metrics */
  engagement: PostEngagement;
  /** Link clicks */
  clicks: number;
  /** Shares */
  shares: number;
  /** Saves */
  saves: number;
  /** Demographics */
  demographics?: {
    age?: Record<string, number>;
    gender?: Record<string, number>;
    location?: Record<string, number>;
  };
  /** Top performing hours */
  topPerformingHours?: Array<{
    hour: number;
    engagement: number;
  }>;
}

/**
 * Interface for social media posting services.
 */
export abstract class IPostService extends Service {
  static override readonly serviceType = ServiceType.POST;

  public readonly capabilityDescription =
    "Social media posting and content management capabilities";

  /**
   * Create and publish a new post.
   * @param content Post content.
   * @param options Publishing options.
   * @returns Post ID.
   */
  abstract createPost(
    content: PostContent,
    options?: PostCreateOptions,
  ): Promise<UUID>;

  /**
   * Get posts from timeline or specific user.
   * @param options Search options.
   */
  abstract getPosts(options?: PostSearchOptions): Promise<PostInfo[]>;

  /**
   * Get a specific post by ID.
   * @param postId Post ID.
   */
  abstract getPost(postId: UUID): Promise<PostInfo>;

  /**
   * Edit an existing post.
   * @param postId Post ID.
   * @param content New post content.
   */
  abstract editPost(postId: UUID, content: PostContent): Promise<void>;

  /**
   * Delete a post.
   * @param postId Post ID.
   */
  abstract deletePost(postId: UUID): Promise<void>;

  /**
   * Like/unlike a post.
   * @param postId Post ID.
   * @param like True to like, false to unlike.
   */
  abstract likePost(postId: UUID, like: boolean): Promise<void>;

  /**
   * Share/repost a post.
   * @param postId Post ID.
   * @param comment Optional comment when sharing.
   * @returns Share ID.
   */
  abstract sharePost(postId: UUID, comment?: string): Promise<UUID>;

  /**
   * Save/unsave a post.
   * @param postId Post ID.
   * @param save True to save, false to unsave.
   */
  abstract savePost(postId: UUID, save: boolean): Promise<void>;

  /**
   * Comment on a post.
   * @param postId Post ID.
   * @param content Comment content.
   * @returns Comment ID.
   */
  abstract commentOnPost(postId: UUID, content: PostContent): Promise<UUID>;

```