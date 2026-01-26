# a7046c18:packages_core_typescript_src_utils.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    return pairs;
  };

  const children = extractDirectChildren(xmlContent);
  for (const { key, value } of children) {
    if (key === "actions" || key === "providers" || key === "evaluators") {
      result[key] = value ? value.split(",").map((s) => s.trim()) : [];
    } else if (key === "simple") {
      result[key] = value.toLowerCase() === "true";
    } else {
      result[key] = value;
    }
  }

  // Return null if no key-value pairs were found
  if (Object.keys(result).length === 0) {
    logger.warn(
      { src: "core:utils" },
      "No key-value pairs extracted from XML content",
    );
    return null;
  }

  return result as T;
}

/**
 * Parses a JSON object from a given text. The function looks for a JSON block wrapped in triple backticks
 * with `json` language identifier, and if not found, it searches for an object pattern within the text.
 * It then attempts to parse the JSON string into a JavaScript object. If parsing is successful and the result
 * is an object (but not an array), it returns the object; otherwise, it tries to parse an array if the result
 * is an array, or returns null if parsing is unsuccessful or the result is neither an object nor an array.
 *
 * @param text - The input text from which to extract and parse the JSON object.
 * @returns An object parsed from the JSON string if successful; otherwise, null or the result of parsing an array.
 */
export function parseJSONObjectFromText(
  text: string,
): Record<string, unknown> | null {
  const jsonBlockMatch = text.match(jsonBlockPattern);

  let jsonData: Record<string, unknown> | null = null;
  try {
    if (jsonBlockMatch) {
      // Parse the JSON from inside the code block
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
  if (jsonData && typeof jsonData === "object" && !Array.isArray(jsonData)) {
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
  str = str.replace(/\{\s+/, "{").replace(/\s+\}/, "}").trim();

  // "key": unquotedValue → "key": "unquotedValue"
  str = str.replace(
    /("[\w\d_-]+")\s*: \s*(?!"|\[)([\s\S]+?)(?=(,\s*"|\}$))/g,
    '$1: "$2"',
  );

  // "key": 'value' → "key": "value"
  str = str.replace(
    /"([^"]+)"\s*:\s*'([^']*)'/g,
    (_, key, value) => `"${key}": "${value}"`,
  );

  // "key": someWord → "key": "someWord"
  str = str.replace(/("[\w\d_-]+")\s*:\s*([A-Za-z_]+)(?!["\w])/g, '$1: "$2"');

  return str;
};

/**
 * Truncate text to fit within the character limit, ensuring it ends at a complete sentence.
 */
export function truncateToCompleteSentence(
  text: string,
  maxLength: number,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Attempt to truncate at the last period within the limit
  const lastPeriodIndex = text.lastIndexOf(".", maxLength - 1);
  if (lastPeriodIndex !== -1) {
    const truncatedAtPeriod = text.slice(0, lastPeriodIndex + 1).trim();
    if (truncatedAtPeriod.length > 0) {
      return truncatedAtPeriod;
    }
  }

  // If no period, truncate to the nearest whitespace within the limit
  const lastSpaceIndex = text.lastIndexOf(" ", maxLength - 1);
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

export async function splitChunks(
  content: string,
  chunkSize = 512,
  bleed = 20,
): Promise<string[]> {
  const characterstoTokens = 3.5;

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: Number(Math.floor(chunkSize * characterstoTokens)),
    chunkOverlap: Number(Math.floor(bleed * characterstoTokens)),
  });

  const chunks = await textSplitter.splitText(content);

  return chunks;
```