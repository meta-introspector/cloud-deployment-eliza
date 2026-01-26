# a7046c18:packages_core_typescript_src_testing_ollama-provider.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/ollama-provider.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview Ollama Model Provider for Integration Testing
 *
 * Provides real inference through local Ollama instance.
 * This is used when no cloud API keys are configured.
 */

import { logger } from "../logger";
import type {
  GenerateTextParams,
  IAgentRuntime,
  TextEmbeddingParams,
} from "../types";
import { ModelType } from "../types";

/** Default Ollama endpoint */
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/** Default models for different types */
const DEFAULT_MODELS = {
  text_small: process.env.OLLAMA_SMALL_MODEL || "llama3.2:1b",
  text_large: process.env.OLLAMA_LARGE_MODEL || "llama3.2:3b",
  embedding: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
};

/**
 * Check if Ollama is available and responding
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * List available models in Ollama
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) return [];
    const data = (await response.json()) as {
      models?: Array<{ name: string }>;
    };
    return data.models?.map((m) => m.name) ?? [];
  } catch {
    return [];
  }
}

/**
 * Generate text using Ollama
 */
async function generateTextWithOllama(
  model: string,
  prompt: string,
  options: {
    system?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
  } = {},
): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      system: options.system,
      options: {
        temperature: options.temperature ?? 0.7,
        num_predict: options.maxTokens ?? 2048,
        stop: options.stopSequences,
      },
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}

/**
 * Generate embeddings using Ollama
 */
async function generateEmbeddingWithOllama(
  model: string,
  text: string,
): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ollama embedding request failed: ${response.status} ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    embeddings?: number[][];
    embedding?: number[];
  };
  // Handle both array of embeddings and single embedding response
  return data.embeddings?.[0] ?? data.embedding ?? [];
}

/**
 * Handle TEXT_SMALL model requests
 */
async function handleTextSmall(
  runtime: IAgentRuntime,
  params: GenerateTextParams,
): Promise<string> {
  logger.debug(
    { src: "ollama", model: DEFAULT_MODELS.text_small },
    "TEXT_SMALL request",
  );

  return generateTextWithOllama(DEFAULT_MODELS.text_small, params.prompt, {
    system: runtime.character.system ?? undefined,
    temperature: params.temperature,
    maxTokens: params.maxTokens,
    stopSequences: params.stopSequences,
  });
}

/**
 * Handle TEXT_LARGE model requests
 */
async function handleTextLarge(
  runtime: IAgentRuntime,
```