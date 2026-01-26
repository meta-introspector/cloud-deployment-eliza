# a7046c18:packages_core_typescript_src_utils.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                  lines.push(`Description: ${media.description}`);
                return lines.join("\n");
              })
              .join(
                // Use comma separator only if all attachments are single-line (no text/description)
                attachments.every((media) => !media.text && !media.description)
                  ? ", "
                  : "\n",
              )})`
          : null;

      const messageTime = new Date(message.createdAt || 0);
      const hours = messageTime.getHours().toString().padStart(2, "0");
      const minutes = messageTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      const timestamp = formatTimestamp(message.createdAt || 0);

      // const shortId = message.entityId.slice(-5);

      const thoughtString = messageThought
        ? `(${formattedName}'s internal thought: ${messageThought})`
        : null;

      const timestampString = `${timeString} (${timestamp}) [${message.entityId}]`;
      const textString = messageText
        ? `${timestampString} ${formattedName}: ${messageText}`
        : null;
      const actionString =
        messageActions && messageActions.length > 0
          ? `${
              textString ? "" : timestampString
            } (${formattedName}'s actions: ${messageActions.join(", ")})`
          : null;

      // for each thought, action, text or attachment, add a new line, with text first, then thought, then action, then attachment
      const messageString = [
        textString,
        thoughtString,
        actionString,
        attachmentString,
      ]
        .filter(Boolean)
        .join("\n");

      return messageString;
    })
    .join("\n");
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
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  return `${days} day${days !== 1 ? "s" : ""} ago`;
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
export function parseKeyValueXml<T = Record<string, unknown>>(
  text: string,
): T | null {
  if (!text) return null;

  // First, try to find a specific <response> block using linear search (avoids regex ReDoS)
  let xmlContent: string | null = null;
  const responseStart = text.indexOf("<response>");
  if (responseStart !== -1) {
    const contentStart = responseStart + "<response>".length;
    const responseEnd = text.indexOf("</response>", contentStart);
    if (responseEnd !== -1) {
      xmlContent = text.slice(contentStart, responseEnd);
    }
  }

  if (!xmlContent) {
    // Fall back: perform a linear scan to find the first simple XML element and its matching close tag
    // This avoids potentially expensive backtracking on crafted inputs
    const findFirstXmlBlock = (
      input: string,
    ): { tag: string; content: string } | null => {
      let i = 0;
      const length = input.length;
      while (i < length) {
        const openIdx = input.indexOf("<", i);
        if (openIdx === -1) break;
        // Skip closing tags and comments/decls
        if (
          input.startsWith("</", openIdx) ||
          input.startsWith("<!--", openIdx) ||
          input.startsWith("<?", openIdx)
        ) {
          i = openIdx + 1;
          continue;
        }
        // Extract tag name [letters, digits, dash, underscore]
        let j = openIdx + 1;
        let tag = "";
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
        const startTagEnd = input.indexOf(">", j);
        if (startTagEnd === -1) break;
        // Self-closing tag? tolerate whitespace before '/>'
        const startTagText = input.slice(openIdx, startTagEnd + 1);
        if (/\/\s*>$/.test(startTagText)) {
```