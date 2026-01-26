# a7046c18:packages_core_typescript_src___tests___messages.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/messages.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeAll, describe, expect, it, test } from "bun:test";
import { formatEntities } from "../entities";
import type { Content, Entity, Memory, UUID } from "../types";
import { formatMessages, formatTimestamp } from "../utils";

describe("Messages Library", () => {
  let entities: Entity[];
  let entityId: UUID;

  beforeAll(() => {
    // Mock user data with proper UUID format
    entityId = "123e4567-e89b-12d3-a456-426614174000" as UUID;
    entities = [
      {
        id: entityId,
        names: ["Test User"],
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
      },
    ];
  });

  test("formatEntities should format entities into a readable string", () => {
    const formattedEntities = formatEntities({ entities });

    expect(formattedEntities).toContain("Test User");
  });

  test("formatMessages should format messages into a readable string", () => {
    const messages: Memory[] = [
      {
        content: { text: "Hello, world!" } as Content,
        entityId: entityId,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        createdAt: Date.now(),
        agentId: "" as UUID, // assuming agentId is an empty string here
      },
    ];

    const formattedMessages = formatMessages({ messages, entities });

    // Assertions
    expect(formattedMessages).toContain("Hello, world!");
    expect(formattedMessages).toContain("Test User");
  });

  test("formatTimestamp should return correct time string", () => {
    const timestamp = Date.now() - 60000; // 1 minute ago
    const result = formatTimestamp(timestamp);

    // Assertions
    expect(result).toBe("1 minute ago");
  });

  test("formatMessages should include attachments if present", () => {
    const messages: Memory[] = [
      {
        content: {
          text: "Check this attachment",
          attachments: [
            {
              id: "123e4567-e89b-12d3-a456-426614174003" as UUID,
              title: "Image",
              url: "http://example.com/image.jpg",
            },
          ],
        } as Content,
        entityId: entityId,
        roomId: "123e4567-e89b-12d3-a456-426614174004" as UUID,
        createdAt: Date.now(),
        agentId: "" as UUID, // assuming agentId is an empty string here
      },
    ];

    const formattedMessages = formatMessages({ messages, entities });

    // Assertions
    expect(formattedMessages).toContain("Check this attachment");
    expect(formattedMessages).toContain("Attachments: [");
  });

  test("formatMessages should handle empty attachments gracefully", () => {
    const messages: Memory[] = [
      {
        content: {
          text: "No attachments here",
        } as Content,
        entityId: entityId,
        roomId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        createdAt: Date.now(),
        agentId: "" as UUID, // assuming agentId is an empty string here
      },
    ];

    const formattedMessages = formatMessages({ messages, entities });

    // Assertions
    expect(formattedMessages).toContain("No attachments here");
    expect(formattedMessages).not.toContain("Attachments");
  });
});

describe("Messages", () => {
  const mockEntities: Entity[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174006" as UUID,
      names: ["Alice"],
      agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174007" as UUID,
      names: ["Bob"],
      agentId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
    },
  ];

  describe("formatEntities", () => {
    it("should format entities with complete details", () => {
      const formatted = formatEntities({ entities: mockEntities });
      expect(formatted).toContain('"Alice"\nID:');
      expect(formatted).toContain('"Bob"\nID:');
    });

    it("should handle entities without details", () => {
      const actorsWithoutDetails: Entity[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174013" as UUID,
          names: ["Charlie"],
          agentId: "123e4567-e89b-12d3-a456-426614174003" as UUID,
        },
      ];
      const formatted = formatEntities({ entities: actorsWithoutDetails });
      expect(formatted).toContain('"Charlie"\nID:');
    });

    it("should handle empty entities array", () => {
      const formatted = formatEntities({ entities: [] });
      expect(formatted).toBe("");
    });
  });

  describe("formatMessages", () => {
    it("should handle messages from unknown users", () => {
      const messagesWithUnknownUser: Memory[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174014" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174009" as UUID,
          entityId: "123e4567-e89b-12d3-a456-426614174015" as UUID,
          createdAt: Date.now(),
          content: { text: "Test message" } as Content,
          agentId: "123e4567-e89b-12d3-a456-426614174001",
```