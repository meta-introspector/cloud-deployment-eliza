# a7046c18:packages_core_typescript_src_utils.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
            const nestedStartEnd = input.indexOf(">", nextOpen + 1);
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
      return null;
    };

    const fb = findFirstXmlBlock(text);
    if (!fb) {
      logger.warn({ src: "core:utils" }, "Could not find XML block in text");
      return null;
    }
    xmlContent = fb.content;
  }

  const result: Record<string, unknown> = {};

  // Safer linear scan to extract direct child <key>value</key> elements
  // Avoids potentially expensive backtracking from broad regexes
  const extractDirectChildren = (
    input: string,
  ): Array<{ key: string; value: string }> => {
    const pairs: Array<{ key: string; value: string }> = [];
    const length = input.length;
    let i = 0;

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
          const nestedStartEnd = input.indexOf(">", nextOpen + 1);
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
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .trim();

      pairs.push({ key: tag, value: unescaped });
      // Move cursor past this element to avoid processing nested children as direct siblings
      i = searchStart;
    }
```