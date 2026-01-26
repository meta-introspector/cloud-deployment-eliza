# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  ): Promise<PoolInfo[]>;

  /**
   * Adds liquidity to a specified pool.
   */
  abstract addLiquidity(params: {
    userVault: unknown;
    poolId: string;
    tokenAAmountLamports: string;
    tokenBAmountLamports?: string;
    slippageBps: number;
    tickLowerIndex?: number;
    tickUpperIndex?: number;
  }): Promise<TransactionResult & { lpTokensReceived?: TokenBalance }>;

  /**
   * Removes liquidity from a specified pool.
   */
  abstract removeLiquidity(params: {
    userVault: unknown;
    poolId: string;
    lpTokenAmountLamports: string;
    slippageBps: number;
  }): Promise<TransactionResult & { tokensReceived?: TokenBalance[] }>;

  /**
   * Fetches the details of a specific LP position for a user.
   */
  abstract getLpPositionDetails(
    userAccountPublicKey: string,
    poolOrPositionIdentifier: string,
  ): Promise<LpPositionDetails | null>;

  /**
   * Fetches the latest market data for a list of pools.
   */
  abstract getMarketDataForPools(
    poolIds: string[],
  ): Promise<Record<string, Partial<PoolInfo>>>;
}

// ============================================================================
// Transcription & Audio Interfaces
// ============================================================================

/**
 * Options for audio transcription.
 */
export interface TranscriptionOptions {
  /** Language code for transcription */
  language?: string;
  /** Model to use for transcription */
  model?: string;
  /** Temperature for generation */
  temperature?: number;
  /** Prompt to guide transcription */
  prompt?: string;
  /** Response format */
  response_format?: "json" | "text" | "srt" | "vtt" | "verbose_json";
  /** Timestamp granularities to include */
  timestamp_granularities?: ("word" | "segment")[];
  /** Include word-level timestamps */
  word_timestamps?: boolean;
  /** Include segment-level timestamps */
  segment_timestamps?: boolean;
}

/**
 * Result of audio transcription.
 */
export interface TranscriptionResult {
  /** Transcribed text */
  text: string;
  /** Detected language */
  language?: string;
  /** Audio duration in seconds */
  duration?: number;
  /** Transcription segments */
  segments?: TranscriptionSegment[];
  /** Word-level transcription */
  words?: TranscriptionWord[];
  /** Overall confidence score */
  confidence?: number;
}

/**
 * A segment of transcription.
 */
export interface TranscriptionSegment {
  /** Segment ID */
  id: number;
  /** Segment text */
  text: string;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Confidence score */
  confidence?: number;
  /** Token IDs */
  tokens?: number[];
  /** Temperature used */
  temperature?: number;
  /** Average log probability */
  avg_logprob?: number;
  /** Compression ratio */
  compression_ratio?: number;
  /** No speech probability */
  no_speech_prob?: number;
}

/**
 * A word in transcription.
 */
export interface TranscriptionWord {
  /** The word */
  word: string;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Confidence score */
  confidence?: number;
}

/**
 * Options for speech-to-text.
 */
export interface SpeechToTextOptions {
  /** Language code */
  language?: string;
  /** Model to use */
  model?: string;
  /** Enable continuous recognition */
  continuous?: boolean;
  /** Return interim results */
  interimResults?: boolean;
  /** Maximum alternatives to return */
  maxAlternatives?: number;
}

/**
 * Options for text-to-speech.
 */
export interface TextToSpeechOptions {
  /** Voice to use */
  voice?: string;
  /** Model to use */
  model?: string;
  /** Speech speed */
```