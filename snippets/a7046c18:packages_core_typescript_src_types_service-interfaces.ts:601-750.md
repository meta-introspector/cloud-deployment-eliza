# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  subtitles?: boolean;
  /** Embed subtitles in video */
  embedSubs?: boolean;
  /** Write info JSON file */
  writeInfoJson?: boolean;
}

/**
 * Video processing options.
 */
export interface VideoProcessingOptions {
  /** Start time in seconds */
  startTime?: number;
  /** End time in seconds */
  endTime?: number;
  /** Output format */
  outputFormat?: string;
  /** Target resolution */
  resolution?: string;
  /** Target bitrate */
  bitrate?: string;
  /** Target framerate */
  framerate?: number;
  /** Audio codec */
  audioCodec?: string;
  /** Video codec */
  videoCodec?: string;
}

/**
 * Interface for video processing and download services.
 */
export abstract class IVideoService extends Service {
  static override readonly serviceType = ServiceType.VIDEO;

  public readonly capabilityDescription =
    "Video download, processing, and conversion capabilities";

  /**
   * Get video information without downloading.
   * @param url Video URL.
   */
  abstract getVideoInfo(url: string): Promise<VideoInfo>;

  /**
   * Download a video from URL.
   * @param url Video URL.
   * @param options Download options.
   * @returns Downloaded file path.
   */
  abstract downloadVideo(
    url: string,
    options?: VideoDownloadOptions,
  ): Promise<string>;

  /**
   * Extract audio from video.
   * @param videoPath Path to video file or video URL.
   * @param outputPath Optional output path for audio file.
   * @returns Audio file path.
   */
  abstract extractAudio(
    videoPath: string,
    outputPath?: string,
  ): Promise<string>;

  /**
   * Generate thumbnail from video.
   * @param videoPath Path to video file or video URL.
   * @param timestamp Timestamp in seconds to capture thumbnail.
   * @returns Thumbnail image path.
   */
  abstract getThumbnail(videoPath: string, timestamp?: number): Promise<string>;

  /**
   * Convert video to different format.
   * @param videoPath Path to input video file.
   * @param outputPath Path for output video file.
   * @param options Processing options.
   * @returns Converted video path.
   */
  abstract convertVideo(
    videoPath: string,
    outputPath: string,
    options?: VideoProcessingOptions,
  ): Promise<string>;

  /**
   * Get available formats for a video URL.
   * @param url Video URL.
   */
  abstract getAvailableFormats(url: string): Promise<VideoFormat[]>;
}

// ============================================================================
// Browser Interfaces
// ============================================================================

/**
 * Browser navigation options.
 */
export interface BrowserNavigationOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Wait until condition */
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  /** Viewport size */
  viewport?: {
    width: number;
    height: number;
  };
  /** User agent string */
  userAgent?: string;
  /** Additional headers */
  headers?: Record<string, string>;
}

/**
 * Screenshot options.
 */
export interface ScreenshotOptions {
  /** Capture full page */
  fullPage?: boolean;
  /** Clip region */
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Image format */
  format?: "png" | "jpeg" | "webp";
  /** Image quality (0-100) */
  quality?: number;
  /** Omit background */
  omitBackground?: boolean;
}

/**
 * Element selector options.
 */
export interface ElementSelector {
  /** CSS selector */
  selector: string;
  /** Text content to match */
  text?: string;
  /** Timeout in milliseconds */
  timeout?: number;
}

```