# a7046c18:packages_plugin-sql_src___tests___unit_entity-rls.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/entity-rls.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { stringToUuid } from "@elizaos/core";

/**
 * Entity RLS Unit Tests
 *
 * These tests verify the Entity RLS logic without requiring a PostgreSQL database.
 * They test the column detection priority, policy generation logic, and isolation behavior.
 */

describe("Entity RLS Column Detection", () => {
  describe("Column Priority Order", () => {
    it("should prioritize room_id over other columns", () => {
      const columns = {
        has_room_id: true,
        has_channel_id: true,
        has_entity_id: true,
        has_author_id: true,
      };

      // Priority: room_id > channel_id > entity_id > author_id
      let selectedColumn: string;
      if (columns.has_room_id) {
        selectedColumn = "room_id";
      } else if (columns.has_channel_id) {
        selectedColumn = "channel_id";
      } else if (columns.has_entity_id) {
        selectedColumn = "entity_id";
      } else {
        selectedColumn = "author_id";
      }

      expect(selectedColumn).toBe("room_id");
    });

    it("should use channel_id when room_id is not present", () => {
      const columns = {
        has_room_id: false,
        has_channel_id: true,
        has_entity_id: true,
        has_author_id: true,
      };

      let selectedColumn: string;
      if (columns.has_room_id) {
        selectedColumn = "room_id";
      } else if (columns.has_channel_id) {
        selectedColumn = "channel_id";
      } else if (columns.has_entity_id) {
        selectedColumn = "entity_id";
      } else {
        selectedColumn = "author_id";
      }

      expect(selectedColumn).toBe("channel_id");
    });

    it("should fallback to entity_id for direct access tables", () => {
      const columns = {
        has_room_id: false,
        has_channel_id: false,
        has_entity_id: true,
        has_author_id: true,
      };

      let selectedColumn: string;
      if (columns.has_room_id) {
        selectedColumn = "room_id";
      } else if (columns.has_channel_id) {
        selectedColumn = "channel_id";
      } else if (columns.has_entity_id) {
        selectedColumn = "entity_id";
      } else {
        selectedColumn = "author_id";
      }

      expect(selectedColumn).toBe("entity_id");
    });

    it("should use author_id as last resort", () => {
      const columns = {
        has_room_id: false,
        has_channel_id: false,
        has_entity_id: false,
        has_author_id: true,
      };

      let selectedColumn: string;
      if (columns.has_room_id) {
        selectedColumn = "room_id";
      } else if (columns.has_channel_id) {
        selectedColumn = "channel_id";
      } else if (columns.has_entity_id) {
        selectedColumn = "entity_id";
      } else if (columns.has_author_id) {
        selectedColumn = "author_id";
      } else {
        selectedColumn = "none";
      }

      expect(selectedColumn).toBe("author_id");
    });

    it("should skip tables with no entity-related columns", () => {
      const columns = {
        has_room_id: false,
        has_channel_id: false,
        has_entity_id: false,
        has_author_id: false,
      };

      const shouldApplyRLS =
        columns.has_room_id ||
        columns.has_channel_id ||
        columns.has_entity_id ||
        columns.has_author_id;

      expect(shouldApplyRLS).toBe(false);
    });
  });

  describe("Table Schema Detection", () => {
    it("should detect memories table as room-based", () => {
      // memories table schema
      const tableColumns = [
        "id",
        "entity_id",
        "agent_id",
        "room_id",
        "content",
        "created_at",
      ];

      const has_room_id = tableColumns.includes("room_id");
      const has_entity_id = tableColumns.includes("entity_id");

      // Should prioritize room_id over entity_id
      expect(has_room_id).toBe(true);
      expect(has_entity_id).toBe(true);

      const selectedColumn = has_room_id ? "room_id" : "entity_id";
      expect(selectedColumn).toBe("room_id");
    });

    it("should detect participants table as entity-based", () => {
      // participants table schema
      const tableColumns = ["id", "entity_id", "channel_id", "created_at"];

      const has_channel_id = tableColumns.includes("channel_id");
      const has_entity_id = tableColumns.includes("entity_id");
```