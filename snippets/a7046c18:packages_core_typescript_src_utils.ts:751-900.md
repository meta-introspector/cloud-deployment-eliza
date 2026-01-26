# a7046c18:packages_core_typescript_src_utils.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/**
 * Trims the provided text prompt to a specified token limit using a tokenizer model and type.
 */
export async function trimTokens(
  prompt: string,
  maxTokens: number,
  runtime: IAgentRuntime,
) {
  if (!prompt) throw new Error("Trim tokens received a null prompt");

  // if prompt is less than of maxtokens / 5, skip
  if (prompt.length < maxTokens / 5) return prompt;

  if (maxTokens <= 0) throw new Error("maxTokens must be positive");

  const tokens = await runtime.useModel(ModelType.TEXT_TOKENIZER_ENCODE, {
    prompt,
    modelType: ModelType.TEXT_TOKENIZER_ENCODE,
  });

  // If already within limits, return unchanged
  if (tokens.length <= maxTokens) {
    return prompt;
  }

  // Keep the most recent tokens by slicing from the end
  const truncatedTokens = tokens.slice(-maxTokens);

  // Decode back to text
  return await runtime.useModel(ModelType.TEXT_TOKENIZER_DECODE, {
    tokens: truncatedTokens,
    modelType: ModelType.TEXT_TOKENIZER_DECODE,
  });
}

export function safeReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
}

/**
 * Parses a string to determine its boolean equivalent.
 *
 * Recognized affirmative values: "YES", "Y", "TRUE", "T", "1", "ON", "ENABLE"
 * Recognized negative values: "NO", "N", "FALSE", "F", "0", "OFF", "DISABLE"
 *
 * @param {string | undefined | null} value - The input text to parse
 * @returns {boolean} - Returns `true` for affirmative inputs, `false` for negative or unrecognized inputs
 */
export function parseBooleanFromText(
  value: string | undefined | null,
): boolean {
  if (!value) return false;
  // shouldn't need this but we're hitting where value is true at runtime
  if (typeof value === "boolean") return value;

  const affirmative = ["YES", "Y", "TRUE", "T", "1", "ON", "ENABLE"];
  const negative = ["NO", "N", "FALSE", "F", "0", "OFF", "DISABLE"];

  const normalizedText = value.trim().toUpperCase();

  if (affirmative.includes(normalizedText)) {
    return true;
  }
  if (negative.includes(normalizedText)) {
    return false;
  }

  // For environment variables, we'll treat unrecognized values as false
  return false;
}

// UUID Utils

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Invalid UUID format",
  ) as z.ZodType<UUID>;

/**
 * Validates a UUID value.
 *
 * @param {unknown} value - The value to validate.
 * @returns {UUID | null} Returns the validated UUID value or null if validation fails.
 */
export function validateUuid(value: unknown): UUID | null {
  const result = uuidSchema.safeParse(value);
  return result.success ? result.data : null;
}

/**
 * Converts a string or number to a UUID.
 *
 * @param {string | number} target - The string or number to convert to a UUID.
 * @returns {UUID} The UUID generated from the input target.
 * @throws {TypeError} Throws an error if the input target is not a string.
 */
export function stringToUuid(target: string | number): UUID {
  if (typeof target === "number") {
    target = (target as number).toString();
  }

  if (typeof target !== "string") {
    throw TypeError("Value must be string");
  }

  // If already a UUID, return as-is to avoid re-hashing
  const maybeUuid = validateUuid(target);
  if (maybeUuid) return maybeUuid;

  const escapedStr = encodeURIComponent(target);

  // Deterministic UUID derived from SHA-1(escapedStr)
  // Use WebCrypto if available (sync via cache), otherwise pure JS
  const digest = getCachedSha1(escapedStr); // 20 bytes
  const bytes = digest.slice(0, 16);

  // Set RFC4122 variant bits: 10xxxxxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  // Set custom version nibble to 0x0 to indicate legacy/custom (matches prior tests expecting '0')
  bytes[6] = (bytes[6] & 0x0f) | 0x00;

  return bytesToUuid(bytes) as UUID;
}

/**
 * Pre-warm the SHA-1 cache with common values using WebCrypto
 * Call this during initialization to improve performance
 */
export async function prewarmUuidCache(values: string[]): Promise<void> {
  if (!checkWebCrypto()) return;

  const promises = values.map(async (value) => {
    const escapedStr = encodeURIComponent(value);
    const digest = await sha1BytesAsync(escapedStr);
    sha1Cache.set(escapedStr, digest);
  });

```