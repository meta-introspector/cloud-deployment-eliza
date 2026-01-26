# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1801-1950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1801-1950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    latitude: number;
    longitude: number;
  };
  /** Place ID from location service */
  placeId?: string;
}

/**
 * Post author information.
 */
export interface PostAuthor {
  /** Author ID */
  id: UUID;
  /** Username */
  username: string;
  /** Display name */
  displayName: string;
  /** Avatar URL */
  avatar?: string;
  /** Verified badge */
  verified?: boolean;
  /** Follower count */
  followerCount?: number;
  /** Following count */
  followingCount?: number;
  /** Bio */
  bio?: string;
  /** Website URL */
  website?: string;
}

/**
 * Post engagement metrics.
 */
export interface PostEngagement {
  /** Number of likes */
  likes: number;
  /** Number of shares */
  shares: number;
  /** Number of comments */
  comments: number;
  /** Number of views */
  views?: number;
  /** Whether current user has liked */
  hasLiked: boolean;
  /** Whether current user has shared */
  hasShared: boolean;
  /** Whether current user has commented */
  hasCommented: boolean;
  /** Whether current user has saved */
  hasSaved: boolean;
}

/**
 * Post content.
 */
export interface PostContent {
  /** Text content */
  text?: string;
  /** HTML content */
  html?: string;
  /** Media attachments */
  media?: PostMedia[];
  /** Location */
  location?: PostLocation;
  /** Hashtags */
  tags?: string[];
  /** Mentioned user IDs */
  mentions?: UUID[];
  /** Link previews */
  links?: Array<{
    url: string;
    title?: string;
    description?: string;
    image?: string;
  }>;
  /** Poll */
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: number;
    }>;
    expiresAt?: Date;
    multipleChoice?: boolean;
  };
}

/**
 * Post information.
 */
export interface PostInfo {
  /** Post ID */
  id: UUID;
  /** Post author */
  author: PostAuthor;
  /** Post content */
  content: PostContent;
  /** Platform name */
  platform: string;
  /** Platform-specific ID */
  platformId: string;
  /** Post URL */
  url: string;
  /** Created timestamp */
  createdAt: Date;
  /** Edited timestamp */
  editedAt?: Date;
  /** Scheduled timestamp */
  scheduledAt?: Date;
  /** Engagement metrics */
  engagement: PostEngagement;
  /** Visibility level */
  visibility: "public" | "private" | "followers" | "friends" | "unlisted";
  /** Reply to post ID */
  replyTo?: UUID;
  /** Thread information */
  thread?: {
    id: UUID;
    position: number;
    total: number;
  };
  /** Cross-post information */
  crossPosted?: Array<{
    platform: string;
    platformId: string;
    url: string;
  }>;
}

/**
 * Post creation options.
 */
export interface PostCreateOptions {
  /** Target platforms */
  platforms?: string[];
  /** Scheduled time */
  scheduledAt?: Date;
  /** Visibility level */
  visibility?: PostInfo["visibility"];
  /** Reply to post ID */
  replyTo?: UUID;
  /** Create as thread */
  thread?: boolean;
  /** Location */
  location?: PostLocation;
  /** Hashtags */
  tags?: string[];
  /** Mentioned user IDs */
  mentions?: UUID[];
```