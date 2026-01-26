# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  speed?: number;
  /** Output format */
  format?: "mp3" | "wav" | "flac" | "aac";
  /** Response format */
  response_format?: "mp3" | "opus" | "aac" | "flac";
}

/**
 * Interface for audio transcription and speech services.
 */
export abstract class ITranscriptionService extends Service {
  static override readonly serviceType = ServiceType.TRANSCRIPTION;

  public readonly capabilityDescription =
    "Audio transcription and speech processing capabilities";

  /**
   * Transcribe audio file to text.
   * @param audioPath Path to audio file or audio buffer.
   * @param options Transcription options.
   */
  abstract transcribeAudio(
    audioPath: string | Buffer,
    options?: TranscriptionOptions,
  ): Promise<TranscriptionResult>;

  /**
   * Transcribe video file to text (extracts audio first).
   * @param videoPath Path to video file or video buffer.
   * @param options Transcription options.
   */
  abstract transcribeVideo(
    videoPath: string | Buffer,
    options?: TranscriptionOptions,
  ): Promise<TranscriptionResult>;

  /**
   * Real-time speech to text from audio stream.
   * @param audioStream Audio stream or buffer.
   * @param options Speech to text options.
   */
  abstract speechToText(
    audioStream: NodeJS.ReadableStream | Buffer,
    options?: SpeechToTextOptions,
  ): Promise<TranscriptionResult>;

  /**
   * Convert text to speech.
   * @param text Text to convert to speech.
   * @param options Text to speech options.
   * @returns Audio buffer.
   */
  abstract textToSpeech(
    text: string,
    options?: TextToSpeechOptions,
  ): Promise<Buffer>;

  /**
   * Get supported languages for transcription.
   */
  abstract getSupportedLanguages(): Promise<string[]>;

  /**
   * Get available voices for text to speech.
   */
  abstract getAvailableVoices(): Promise<
    Array<{
      id: string;
      name: string;
      language: string;
      gender?: "male" | "female" | "neutral";
    }>
  >;

  /**
   * Detect language of audio file.
   * @param audioPath Path to audio file or audio buffer.
   */
  abstract detectLanguage(audioPath: string | Buffer): Promise<string>;
}

// ============================================================================
// Video Interfaces
// ============================================================================

/**
 * Video information.
 */
export interface VideoInfo {
  /** Video title */
  title?: string;
  /** Duration in seconds */
  duration?: number;
  /** Video URL */
  url: string;
  /** Thumbnail URL */
  thumbnail?: string;
  /** Video description */
  description?: string;
  /** Uploader name */
  uploader?: string;
  /** View count */
  viewCount?: number;
  /** Upload date */
  uploadDate?: Date;
  /** Available formats */
  formats?: VideoFormat[];
}

/**
 * Video format information.
 */
export interface VideoFormat {
  /** Format ID */
  formatId: string;
  /** Download URL */
  url: string;
  /** File extension */
  extension: string;
  /** Quality label */
  quality: string;
  /** File size in bytes */
  fileSize?: number;
  /** Video codec */
  videoCodec?: string;
  /** Audio codec */
  audioCodec?: string;
  /** Resolution (e.g., "1920x1080") */
  resolution?: string;
  /** Frames per second */
  fps?: number;
  /** Bitrate */
  bitrate?: number;
}

/**
 * Video download options.
 */
export interface VideoDownloadOptions {
  /** Preferred format */
  format?: string;
  /** Quality preference */
  quality?: "best" | "worst" | "bestvideo" | "bestaudio" | string;
  /** Output file path */
  outputPath?: string;
  /** Extract audio only */
  audioOnly?: boolean;
  /** Extract video only (no audio) */
  videoOnly?: boolean;
  /** Download subtitles */
```