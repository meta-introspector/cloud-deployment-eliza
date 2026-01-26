# a69475c0:packages_core_src_utils.ts:301-450

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:301-450
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
          ? `${
              textString ? '' : timestampString
            } (${formattedName}'s actions: ${messageActions.join(', ')})`
          : null;

      // for each thought, action, text or attachment, add a new line, with text first, then thought, then action, then attachment
      const messageString = [textString, thoughtString, actionString, attachmentString]
        .filter(Boolean)
        .join('\n');

      return messageString;
    })
    .join('\n');
  return messageStrings;
};

export const formatTimestamp = (messageDate: number) => {
  const now = new Date();
  const diff = now.getTime() - messageDate;

  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (absDiff < 60000) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;

/**
 * Parses key-value pairs from a simple XML structure within a given text.
 * It looks for an XML block (e.g., <response>...</response>) and extracts
 * text content from direct child elements (e.g., <key>value</key>).
 *
 * Note: This uses regex and is suitable for simple, predictable XML structures.
 * For complex XML, a proper parsing library is recommended.
 *
 * @typeParam T - The expected shape of the parsed result. Defaults to Record<string, unknown>.
 * @param text - The input text containing the XML structure.
 * @returns The parsed object cast to type T, or null if parsing fails.
 *
 * @example
 * interface MyResponse { thought: string; message: string; }
 * const result = parseKeyValueXml<MyResponse>(xmlText);
 * // result is MyResponse | null
 */
export function parseKeyValueXml<T = Record<string, unknown>>(text: string): T | null {
  if (!text) return null;

  // First, try to find a specific <response> block using linear search (avoids regex ReDoS)
  let xmlContent: string | null = null;
  const responseStart = text.indexOf('<response>');
  if (responseStart !== -1) {
    const contentStart = responseStart + '<response>'.length;
    const responseEnd = text.indexOf('</response>', contentStart);
    if (responseEnd !== -1) {
      xmlContent = text.slice(contentStart, responseEnd);
    }
  }

  if (!xmlContent) {
    // Fall back: perform a linear scan to find the first simple XML element and its matching close tag
    // This avoids potentially expensive backtracking on crafted inputs
    const findFirstXmlBlock = (input: string): { tag: string; content: string } | null => {
      let i = 0;
      const length = input.length;
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
        const closeSeq = `</${tag}>`;
        // Implement nested tag counting for same-named tags
        let depth = 1;
        let searchStart = startTagEnd + 1;
        while (depth > 0 && searchStart < length) {
          const nextOpen = input.indexOf(`<${tag}`, searchStart);
          const nextClose = input.indexOf(closeSeq, searchStart);
          if (nextClose === -1) {
            break;
          }
          if (nextOpen !== -1 && nextOpen < nextClose) {
            // Determine if the next open is self-closing; if so, do not increase depth
            const nestedStartEnd = input.indexOf('>', nextOpen + 1);
            if (nestedStartEnd === -1) {
              break;
            }
            const nestedStartText = input.slice(nextOpen, nestedStartEnd + 1);
            if (/\/\s*>$/.test(nestedStartText)) {
              // self-closing; skip without changing depth
              searchStart = nestedStartEnd + 1;
            } else {
              depth++;
              searchStart = nestedStartEnd + 1;
            }
          } else {
            depth--;
            searchStart = nextClose + closeSeq.length;
          }
        }
        if (depth === 0) {
          const closeIdx = searchStart - closeSeq.length;
          const inner = input.slice(startTagEnd + 1, closeIdx);
          return { tag, content: inner };
        }
        i = startTagEnd + 1;
      }
```