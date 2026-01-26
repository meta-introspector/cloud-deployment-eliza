# a7046c18:packages_core_typescript_src_testing_inference-provider.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/inference-provider.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview Inference Provider Detection and Validation
 *
 * Detects available inference providers and ensures tests have access to
 * real inference capabilities. Throws errors if no provider is found.
 */

import { logger } from "../logger";

/** Default Ollama endpoint */
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/**
 * Detected inference provider information
 */
export interface InferenceProviderInfo {
  /** Provider name (e.g., "ollama", "openai", "anthropic") */
  name: string;
  /** Whether the provider is available */
  available: boolean;
  /** Endpoint URL if applicable */
  endpoint?: string;
  /** Available models if detectable */
  models?: string[];
  /** Any error message if provider check failed */
  error?: string;
}

/**
 * Result of inference provider detection
 */
export interface InferenceProviderDetectionResult {
  /** Whether any inference provider is available */
  hasProvider: boolean;
  /** The primary provider to use */
  primaryProvider: InferenceProviderInfo | null;
  /** All detected providers */
  allProviders: InferenceProviderInfo[];
  /** Summary message for logging */
  summary: string;
}

/**
 * Check if Ollama is available and list its models
 */
async function checkOllama(): Promise<InferenceProviderInfo> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        name: "ollama",
        available: false,
        endpoint: OLLAMA_URL,
        error: `Ollama returned status ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      models?: Array<{ name: string }>;
    };
    const models = data.models?.map((m) => m.name) ?? [];

    return {
      name: "ollama",
      available: true,
      endpoint: OLLAMA_URL,
      models,
    };
  } catch (error) {
    return {
      name: "ollama",
      available: false,
      endpoint: OLLAMA_URL,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if OpenAI API is configured
 */
function checkOpenAI(): InferenceProviderInfo {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return {
      name: "openai",
      available: true,
      endpoint: "https://api.openai.com/v1",
    };
  }
  return {
    name: "openai",
    available: false,
    error: "OPENAI_API_KEY not set",
  };
}

/**
 * Check if Anthropic API is configured
 */
function checkAnthropic(): InferenceProviderInfo {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    return {
      name: "anthropic",
      available: true,
      endpoint: "https://api.anthropic.com",
    };
  }
  return {
    name: "anthropic",
    available: false,
    error: "ANTHROPIC_API_KEY not set",
  };
}

/**
 * Check if Google AI API is configured
 */
function checkGoogleAI(): InferenceProviderInfo {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (apiKey) {
    return {
      name: "google",
      available: true,
      endpoint: "https://generativelanguage.googleapis.com",
    };
  }
  return {
    name: "google",
    available: false,
    error: "GOOGLE_API_KEY not set",
  };
}

/**
 * Detect all available inference providers
 */
export async function detectInferenceProviders(): Promise<InferenceProviderDetectionResult> {
  const providers: InferenceProviderInfo[] = [];

  // Check cloud providers first (faster, no network timeout)
  const openai = checkOpenAI();
  const anthropic = checkAnthropic();
  const google = checkGoogleAI();

```