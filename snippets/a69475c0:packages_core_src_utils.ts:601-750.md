# a69475c0:packages_core_src_utils.ts:601-750

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:601-750
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      jsonData = JSON.parse(normalizeJsonString(jsonBlockMatch[1].trim()));
    } else {
      // Try to parse the text directly if it's not in a code block
      jsonData = JSON.parse(normalizeJsonString(text.trim()));
    }
  } catch {
    // Return null on parse error
    return null;
  }

  // Ensure we have a non-null object that's not an array
  if (jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData)) {
    return jsonData;
  }

  return null;
}

/**
 * Normalizes a JSON-like string by correcting formatting issues:
 * - Removes extra spaces after '{' and before '}'.
 * - Wraps unquoted values in double quotes.
 * - Converts single-quoted values to double-quoted.
 * - Ensures consistency in key-value formatting.
 * - Normalizes mixed adjacent quote pairs.
 *
 * This is useful for cleaning up improperly formatted JSON strings
 * before parsing them into valid JSON.
 *
 * @param str - The JSON-like string to normalize.
 * @returns A properly formatted JSON string.
 */

export const normalizeJsonString = (str: string) => {
  // Remove extra spaces after '{' and before '}'
  str = str.replace(/\{\s+/, '{').replace(/\s+\}/, '}').trim();

  // "key": unquotedValue → "key": "unquotedValue"
  str = str.replace(/("[\w\d_-]+")\s*: \s*(?!"|\[)([\s\S]+?)(?=(,\s*"|\}$))/g, '$1: "$2"');

  // "key": 'value' → "key": "value"
  str = str.replace(/"([^"]+)"\s*:\s*'([^']*)'/g, (_, key, value) => `"${key}": "${value}"`);

  // "key": someWord → "key": "someWord"
  str = str.replace(/("[\w\d_-]+")\s*:\s*([A-Za-z_]+)(?!["\w])/g, '$1: "$2"');

  return str;
};

/**
 * Truncate text to fit within the character limit, ensuring it ends at a complete sentence.
 */
export function truncateToCompleteSentence(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Attempt to truncate at the last period within the limit
  const lastPeriodIndex = text.lastIndexOf('.', maxLength - 1);
  if (lastPeriodIndex !== -1) {
    const truncatedAtPeriod = text.slice(0, lastPeriodIndex + 1).trim();
    if (truncatedAtPeriod.length > 0) {
      return truncatedAtPeriod;
    }
  }

  // If no period, truncate to the nearest whitespace within the limit
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength - 1);
  if (lastSpaceIndex !== -1) {
    const truncatedAtSpace = text.slice(0, lastSpaceIndex).trim();
    if (truncatedAtSpace.length > 0) {
      return `${truncatedAtSpace}...`;
    }
  }

  // Fallback: Hard truncate and add ellipsis
  const hardTruncated = text.slice(0, maxLength - 3).trim();
  return `${hardTruncated}...`;
}

export async function splitChunks(content: string, chunkSize = 512, bleed = 20): Promise<string[]> {
  const characterstoTokens = 3.5;

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: Number(Math.floor(chunkSize * characterstoTokens)),
    chunkOverlap: Number(Math.floor(bleed * characterstoTokens)),
  });

  const chunks = await textSplitter.splitText(content);

  return chunks;
}

/**
 * Trims the provided text prompt to a specified token limit using a tokenizer model and type.
 */
export async function trimTokens(prompt: string, maxTokens: number, runtime: IAgentRuntime) {
  if (!prompt) throw new Error('Trim tokens received a null prompt');

  // if prompt is less than of maxtokens / 5, skip
  if (prompt.length < maxTokens / 5) return prompt;

  if (maxTokens <= 0) throw new Error('maxTokens must be positive');

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
  return function (_key: string, value: unknown) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
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
export function parseBooleanFromText(value: string | undefined | null): boolean {
  if (!value) return false;
  // shouldn't need this but we're hitting where value is true at runtime
  if (typeof value === 'boolean') return value;
```