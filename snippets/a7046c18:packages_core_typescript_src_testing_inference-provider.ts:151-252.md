# a7046c18:packages_core_typescript_src_testing_inference-provider.ts:151-252

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/inference-provider.ts:151-252
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  providers.push(openai, anthropic, google);

  // Check Ollama (requires network call)
  const ollama = await checkOllama();
  providers.push(ollama);

  // Find available providers
  const availableProviders = providers.filter((p) => p.available);
  const hasProvider = availableProviders.length > 0;

  // Determine primary provider (prefer cloud providers for reliability)
  let primaryProvider: InferenceProviderInfo | null = null;
  if (openai.available) {
    primaryProvider = openai;
  } else if (anthropic.available) {
    primaryProvider = anthropic;
  } else if (google.available) {
    primaryProvider = google;
  } else if (ollama.available) {
    primaryProvider = ollama;
  }

  // Build summary message
  let summary: string;
  if (!hasProvider) {
    summary =
      "NO INFERENCE PROVIDER AVAILABLE\n" +
      "   Integration tests require a working inference provider.\n\n" +
      "   Options:\n" +
      "   1. Start Ollama locally: ollama serve\n" +
      "   2. Set OPENAI_API_KEY environment variable\n" +
      "   3. Set ANTHROPIC_API_KEY environment variable\n" +
      "   4. Set GOOGLE_API_KEY environment variable";
  } else {
    const providerList = availableProviders
      .map((p) => {
        let info = `   - ${p.name.toUpperCase()}`;
        if (p.endpoint) info += ` (${p.endpoint})`;
        if (p.models?.length) info += ` - ${p.models.length} models`;
        return info;
      })
      .join("\n");

    summary =
      `Using inference provider: ${primaryProvider?.name.toUpperCase() ?? "NONE"}\n` +
      `   Available providers:\n${providerList}`;
  }

  return {
    hasProvider,
    primaryProvider,
    allProviders: providers,
    summary,
  };
}

/**
 * Validate that an inference provider is available for testing.
 * Throws an error with helpful instructions if no provider is found.
 */
export async function requireInferenceProvider(): Promise<InferenceProviderInfo> {
  const detection = await detectInferenceProviders();

  // Log the detection result
  console.log(`\n${"=".repeat(60)}`);
  console.log("INFERENCE PROVIDER DETECTION");
  console.log("=".repeat(60));
  console.log(detection.summary);
  console.log(`${"=".repeat(60)}\n`);

  if (!detection.hasProvider || !detection.primaryProvider) {
    throw new Error(
      "No inference provider available for integration tests.\n\n" +
        "Integration tests require a working inference provider.\n\n" +
        "Options:\n" +
        "  1. Start Ollama locally:\n" +
        "     $ ollama serve\n" +
        "     $ ollama pull llama3.2:1b  # for TEXT_SMALL\n" +
        "     $ ollama pull llama3.2:3b  # for TEXT_LARGE\n" +
        "     $ ollama pull nomic-embed-text  # for embeddings\n\n" +
        "  2. Set a cloud API key:\n" +
        "     $ export OPENAI_API_KEY=sk-...\n" +
        "     $ export ANTHROPIC_API_KEY=sk-...\n" +
        "     $ export GOOGLE_API_KEY=...\n",
    );
  }

  logger.info(
    { src: "testing", provider: detection.primaryProvider.name },
    `Using ${detection.primaryProvider.name} for test inference`,
  );

  return detection.primaryProvider;
}

/**
 * Check if any inference provider is available without throwing
 */
export async function hasInferenceProvider(): Promise<boolean> {
  const detection = await detectInferenceProviders();
  return detection.hasProvider;
}
```