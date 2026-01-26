# a69475c0:packages_core_src_utils.ts:451-600

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:451-600
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      return null;
    };

    const fb = findFirstXmlBlock(text);
    if (!fb) {
      logger.warn({ src: 'core:utils' }, 'Could not find XML block in text');
      return null;
    }
    xmlContent = fb.content;
  }

  const result: Record<string, unknown> = {};

  // Safer linear scan to extract direct child <key>value</key> elements
  // Avoids potentially expensive backtracking from broad regexes
  const extractDirectChildren = (input: string): Array<{ key: string; value: string }> => {
    const pairs: Array<{ key: string; value: string }> = [];
    const length = input.length;
    let i = 0;

    while (i < length) {
      const openIdx = input.indexOf('<', i);
      if (openIdx === -1) break;

      // Skip closing tags and comments/decls
      if (
        input.startsWith('</', openIdx) ||
        input.startsWith('<!--', openIdx) ||
        input.startsWith('<?', openIdx)
      ) {
        i = openIdx + 1;
        continue;
      }

      // Extract tag name [letters, digits, dash, underscore]
      let j = openIdx + 1;
      let tag = '';
      while (j < length) {
        const ch = input[j];
        if (/^[A-Za-z0-9_-]$/.test(ch)) {
          tag += ch;
          j++;
          continue;
        }
        break;
      }
      if (!tag) {
        i = openIdx + 1;
        continue;
      }

      // Find end of start tag '>' (skip attributes if present)
      const startTagEnd = input.indexOf('>', j);
      if (startTagEnd === -1) break;

      // Self-closing tag? tolerate whitespace before '/>'
      const startTagText = input.slice(openIdx, startTagEnd + 1);
      if (/\/\s*>$/.test(startTagText)) {
        i = startTagEnd + 1;
        continue;
      }

      // Find the matching close tag, handling nested tags with the same name
      const closeSeq = `</${tag}>`;
      let depth = 1;
      let searchStart = startTagEnd + 1;
      while (depth > 0 && searchStart < length) {
        const nextOpen = input.indexOf(`<${tag}`, searchStart);
        const nextClose = input.indexOf(closeSeq, searchStart);
        if (nextClose === -1) {
          break;
        }
        if (nextOpen !== -1 && nextOpen < nextClose) {
          const nestedStartEnd = input.indexOf('>', nextOpen + 1);
          if (nestedStartEnd === -1) {
            break;
          }
          const nestedStartText = input.slice(nextOpen, nestedStartEnd + 1);
          if (!/\/\s*>$/.test(nestedStartText)) {
            depth++;
          }
          searchStart = nestedStartEnd + 1;
        } else {
          depth--;
          searchStart = nextClose + closeSeq.length;
        }
      }
      if (depth !== 0) {
        // Unbalanced tag, advance to avoid infinite loops
        i = startTagEnd + 1;
        continue;
      }

      const closeIdx = searchStart - closeSeq.length;
      const innerRaw = input.slice(startTagEnd + 1, closeIdx);

      // Basic unescaping for common XML entities (add more as needed)
      const unescaped = innerRaw
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .trim();

      pairs.push({ key: tag, value: unescaped });
      // Move cursor past this element to avoid processing nested children as direct siblings
      i = searchStart;
    }

    return pairs;
  };

  const children = extractDirectChildren(xmlContent);
  for (const { key, value } of children) {
    if (key === 'actions' || key === 'providers' || key === 'evaluators') {
      result[key] = value ? value.split(',').map((s) => s.trim()) : [];
    } else if (key === 'simple') {
      result[key] = value.toLowerCase() === 'true';
    } else {
      result[key] = value;
    }
  }

  // Return null if no key-value pairs were found
  if (Object.keys(result).length === 0) {
    logger.warn({ src: 'core:utils' }, 'No key-value pairs extracted from XML content');
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
export function parseJSONObjectFromText(text: string): Record<string, unknown> | null {
  const jsonBlockMatch = text.match(jsonBlockPattern);

  let jsonData: Record<string, unknown> | null = null;
  try {
    if (jsonBlockMatch) {
      // Parse the JSON from inside the code block
```