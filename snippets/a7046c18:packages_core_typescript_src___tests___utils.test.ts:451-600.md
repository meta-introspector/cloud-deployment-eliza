# a7046c18:packages_core_typescript_src___tests___utils.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    it("should return null when no key-value pairs are found", () => {
      // This tests lines 400-403 - no key-value pairs extracted
      const xml = "<response></response>"; // Empty response
      const result = parseKeyValueXml(xml);
      expect(result).toBeNull();

      // Also test with content that doesn't match the pattern
      const xml2 = "<response>Just plain text</response>";
      const result2 = parseKeyValueXml(xml2);
      expect(result2).toBeNull();
    });

    it("should handle empty comma-separated lists", () => {
      const xml = `<response>
                <actions></actions>
                <providers> </providers>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        actions: [],
        providers: [],
      });
    });

    it("should correctly handle nested same-name tags in fallback scan", () => {
      // No <response> tag so fallback scanner is used
      const xml = "<container><text><text>inner</text>outer</text></container>";
      const result = parseKeyValueXml(xml);
      // Ensure we did not truncate at the inner </text>
      expect(result).not.toBeNull();
      expect(result?.text).toContain("outer");
      expect(result?.text).toContain("<text>inner</text>");
    });

    it("should treat self-closing tags with whitespace as self-closing and skip them", () => {
      // First tag is self-closing with whitespace before '/>'
      const xml = "<sc /> <container><key>value</key></container>";
      const result = parseKeyValueXml(xml);
      expect(result).toEqual({ key: "value" });
    });

    it("should handle malicious input without ReDoS (unclosed response tag)", () => {
      // This input would cause exponential backtracking with regex /<response>([\s\S]*?)<\/response>/
      // With linear search, it should complete in O(n) time
      const maliciousInput = `<response>${"a".repeat(10000)}`;
      const startTime = Date.now();
      const result = parseKeyValueXml(maliciousInput);
      const elapsed = Date.now() - startTime;

      // Should return null (no closing tag) and complete quickly (< 100ms)
      expect(result).toBeNull();
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe("formatMessages", () => {
    const mockEntities: Entity[] = [
      {
        id: stringToUuid("entity-1"),
        names: ["Alice"],
        metadata: {},
        agentId: stringToUuid("agent-1"),
      },
      {
        id: stringToUuid("entity-2"),
        names: ["Bob"],
        metadata: {},
        agentId: stringToUuid("agent-1"),
      },
    ];

    it("should format messages with basic content", () => {
      const entityId = stringToUuid("entity-1");
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId,
          roomId: stringToUuid("room-1"),
          createdAt: Date.now() - 60000, // 1 minute ago
          content: {
            text: "Hello world",
            source: "chat",
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain("Alice");
      expect(result).toContain("Hello world");
      expect(result).toContain("1 minute ago");
      expect(result).toContain(`[${entityId}]`);
    });

    it("should format messages with actions and thoughts", () => {
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: stringToUuid("entity-2"),
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: {
            text: "Doing something",
            thought: "I should help",
            actions: ["SEARCH", "REPLY"],
            source: "chat",
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain("Bob");
      expect(result).toContain("Doing something");
      expect(result).toContain("(Bob's internal thought: I should help)");
      expect(result).toContain("(Bob's actions: SEARCH, REPLY)");
    });

    it("should handle attachments", () => {
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: stringToUuid("entity-1"),
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: {
            text: "Check this out",
            attachments: [
              {
                id: "att-1",
                title: "Image",
                url: "http://example.com/img.jpg",
              },
              {
                id: "att-2",
                title: "Document",
                url: "http://example.com/doc.pdf",
              },
            ],
            source: "chat",
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain(
```