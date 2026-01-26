# a7046c18:packages_core_typescript_src_testing_ollama-provider.ts:151-277

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/ollama-provider.ts:151-277
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  params: GenerateTextParams,
): Promise<string> {
  logger.debug(
    { src: "ollama", model: DEFAULT_MODELS.text_large },
    "TEXT_LARGE request",
  );

  return generateTextWithOllama(DEFAULT_MODELS.text_large, params.prompt, {
    system: runtime.character.system ?? undefined,
    temperature: params.temperature,
    maxTokens: params.maxTokens,
    stopSequences: params.stopSequences,
  });
}

/**
 * Handle TEXT_EMBEDDING model requests
 */
async function handleTextEmbedding(
  _runtime: IAgentRuntime,
  params: TextEmbeddingParams,
): Promise<number[]> {
  logger.debug(
    { src: "ollama", model: DEFAULT_MODELS.embedding },
    "TEXT_EMBEDDING request",
  );

  return generateEmbeddingWithOllama(DEFAULT_MODELS.embedding, params.text);
}

/**
 * Handle OBJECT_SMALL model requests (uses JSON mode)
 */
async function handleObjectSmall(
  runtime: IAgentRuntime,
  params: GenerateTextParams,
): Promise<Record<string, unknown>> {
  logger.debug(
    { src: "ollama", model: DEFAULT_MODELS.text_small },
    "OBJECT_SMALL request",
  );

  const jsonPrompt = `${params.prompt}\n\nRespond with valid JSON only:`;
  const response = await generateTextWithOllama(
    DEFAULT_MODELS.text_small,
    jsonPrompt,
    {
      system: runtime.character.system ?? undefined,
      temperature: params.temperature ?? 0.3, // Lower temp for structured output
      maxTokens: params.maxTokens,
    },
  );

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    }
    return JSON.parse(response) as Record<string, unknown>;
  } catch {
    logger.warn(
      { src: "ollama", response },
      "Failed to parse JSON response, returning as text",
    );
    return { text: response, error: "Failed to parse as JSON" };
  }
}

/**
 * Handle OBJECT_LARGE model requests (uses JSON mode)
 */
async function handleObjectLarge(
  runtime: IAgentRuntime,
  params: GenerateTextParams,
): Promise<Record<string, unknown>> {
  logger.debug(
    { src: "ollama", model: DEFAULT_MODELS.text_large },
    "OBJECT_LARGE request",
  );

  const jsonPrompt = `${params.prompt}\n\nRespond with valid JSON only:`;
  const response = await generateTextWithOllama(
    DEFAULT_MODELS.text_large,
    jsonPrompt,
    {
      system: runtime.character.system ?? undefined,
      temperature: params.temperature ?? 0.3,
      maxTokens: params.maxTokens,
    },
  );

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    }
    return JSON.parse(response) as Record<string, unknown>;
  } catch {
    logger.warn(
      { src: "ollama", response },
      "Failed to parse JSON response, returning as text",
    );
    return { text: response, error: "Failed to parse as JSON" };
  }
}

/**
 * Model handler type for registration
 */
type ModelHandler = (
  runtime: IAgentRuntime,
  params: Record<string, unknown>,
) => Promise<string | number[] | Record<string, unknown>>;

/**
 * Create all Ollama model handlers for registration
 */
export function createOllamaModelHandlers(): Record<string, ModelHandler> {
  return {
    [ModelType.TEXT_SMALL]: handleTextSmall as ModelHandler,
    [ModelType.TEXT_LARGE]: handleTextLarge as ModelHandler,
    [ModelType.TEXT_EMBEDDING]: handleTextEmbedding as unknown as ModelHandler,
    [ModelType.OBJECT_SMALL]: handleObjectSmall as ModelHandler,
    [ModelType.OBJECT_LARGE]: handleObjectLarge as ModelHandler,
  };
}
```