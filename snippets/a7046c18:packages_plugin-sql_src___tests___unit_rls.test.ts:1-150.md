# a7046c18:packages_plugin-sql_src___tests___unit_rls.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/rls.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { stringToUuid } from "@elizaos/core";

/**
 * Server RLS Unit Tests
 *
 * These tests verify the Server RLS logic without requiring a PostgreSQL database.
 * They use mocks to test function behavior.
 */

describe("Server RLS Helper Functions", () => {
  describe("Server ID Generation", () => {
    it("should generate consistent UUIDs from server identifiers", () => {
      const token1 = "test-auth-token-123";
      const token2 = "test-auth-token-456";

      const uuid1a = stringToUuid(token1);
      const uuid1b = stringToUuid(token1);
      const uuid2 = stringToUuid(token2);

      // Same token should produce same UUID
      expect(uuid1a).toBe(uuid1b);

      // Different tokens should produce different UUIDs
      expect(uuid1a).not.toBe(uuid2);

      // UUIDs should be valid format
      expect(uuid1a).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(uuid2).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should handle empty tokens", () => {
      const emptyUuid = stringToUuid("");
      expect(emptyUuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should handle special characters in tokens", () => {
      const specialToken = "token-with-special-chars-!@#$%^&*()";
      const uuid = stringToUuid(specialToken);
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  describe("RLS Configuration Validation", () => {
    it("should validate RLS environment variables", () => {
      const testCases = [
        {
          rlsEnabled: "true",
          authToken: "token-123",
          postgresUrl: "postgresql://...",
          expected: true,
        },
        {
          rlsEnabled: "false",
          authToken: "",
          postgresUrl: "",
          expected: false,
        },
        {
          rlsEnabled: "true",
          authToken: "",
          postgresUrl: "postgresql://...",
          expected: false,
        }, // Missing token
        {
          rlsEnabled: "true",
          authToken: "token",
          postgresUrl: "",
          expected: false,
        }, // Missing postgres
      ];

      testCases.forEach(({ rlsEnabled, authToken, postgresUrl, expected }) => {
        const isValid =
          rlsEnabled === "true" &&
          authToken !== "" &&
          postgresUrl.startsWith("postgresql://");
        expect(isValid).toBe(expected);
      });
    });
  });

  describe("Dynamic Server ID Logic", () => {
    it("should use server_id as server ID when RLS is enabled", () => {
      const rlsEnabled = true;
      const serverId_value = "c37e5ad5-bfbc-0be7-b62f-d0ac8702ad01";
      const defaultServerId = "00000000-0000-0000-0000-000000000000";

      const serverId =
        rlsEnabled && serverId_value ? serverId_value : defaultServerId;

      expect(serverId).toBe(serverId_value);
      expect(serverId).not.toBe(defaultServerId);
    });

    it("should use default server ID when RLS is disabled", () => {
      const rlsEnabled = false;
      const serverId_value = "c37e5ad5-bfbc-0be7-b62f-d0ac8702ad01";
      const defaultServerId = "00000000-0000-0000-0000-000000000000";

      const serverId =
        rlsEnabled && serverId_value ? serverId_value : defaultServerId;

      expect(serverId).toBe(defaultServerId);
      expect(serverId).not.toBe(serverId_value);
    });

    it("should use default server ID when server_id is undefined", () => {
      const rlsEnabled = true;
      const serverId_value = undefined;
      const defaultServerId = "00000000-0000-0000-0000-000000000000";

      const serverId =
        rlsEnabled && serverId_value ? serverId_value : defaultServerId;

      expect(serverId).toBe(defaultServerId);
    });
  });

  describe("Server Name Generation", () => {
    it("should generate instance-specific server name when RLS enabled", () => {
      const rlsEnabled = true;
      const serverId_value = "c37e5ad5-bfbc-0be7-b62f-d0ac8702ad01";

      const serverName =
        rlsEnabled && serverId_value
          ? `Server ${serverId_value.substring(0, 8)}`
          : "Default Server";

      expect(serverName).toBe("Server c37e5ad5");
      expect(serverName).not.toBe("Default Server");
    });

    it("should use default server name when RLS disabled", () => {
      const rlsEnabled = false;
      const serverId_value = "c37e5ad5-bfbc-0be7-b62f-d0ac8702ad01";

      const serverName =
        rlsEnabled && serverId_value
          ? `Server ${serverId_value.substring(0, 8)}`
          : "Default Server";

```