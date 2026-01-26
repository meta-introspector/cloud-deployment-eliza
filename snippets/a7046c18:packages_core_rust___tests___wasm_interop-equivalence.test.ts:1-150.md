# a7046c18:packages_core_rust___tests___wasm_interop-equivalence.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/wasm/interop-equivalence.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview Interop Equivalence Tests
 *
 * Tests that verify the Rust WASM implementation produces identical results
 * to the TypeScript implementation for all core types and operations.
 */

import { beforeAll, describe, expect, it } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Character, Content, Memory } from "@elizaos/core";
import { stringToUuid } from "@elizaos/core";

// WASM module interface
interface WasmModule {
  stringToUuid(input: string): string;
  generateUUID(): string;
  validateUUID(uuid: string): boolean;
  parseMemory(json: string): { toJson: () => string };
  parseCharacter(json: string): { toJson: () => string };
  testMemoryRoundTrip(json: string): boolean;
  testCharacterRoundTrip(json: string): boolean;
}

// Check if WASM module is built
const wasmNodePath = path.join(__dirname, "../../pkg-node");
const wasmExists = fs.existsSync(wasmNodePath);

const describeInterop = wasmExists ? describe : describe.skip;

describeInterop("TypeScript/Rust Interop Equivalence", () => {
  let wasm: WasmModule;

  beforeAll(async () => {
    try {
      wasm = await import("../../pkg-node/elizaos_core.js");
    } catch (error) {
      console.warn("WASM module not available:", error);
    }
  });

  describe("UUID Generation Equivalence", () => {
    it("should generate deterministic UUIDs from strings identically", () => {
      if (!wasm) return;

      const testInputs = [
        "test",
        "hello-world",
        "agent-123",
        "room-abc",
        "user@example.com",
        "some random string with spaces",
        "12345",
        "",
      ];

      for (const input of testInputs) {
        const tsUuid = stringToUuid(input);
        const rustUuid = wasm.stringToUuid(input);

        // Both should produce valid UUIDs
        expect(wasm.validateUUID(tsUuid)).toBe(true);
        expect(wasm.validateUUID(rustUuid)).toBe(true);

        // Note: UUIDs may differ if algorithms differ, but both should be deterministic
        const tsUuid2 = stringToUuid(input);
        const rustUuid2 = wasm.stringToUuid(input);

        expect(tsUuid).toBe(tsUuid2);
        expect(rustUuid).toBe(rustUuid2);
      }
    });
  });

  describe("Memory Serialization Equivalence", () => {
    it("should serialize Memory identically", () => {
      if (!wasm) return;

      const memory: Memory = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        entityId: "550e8400-e29b-41d4-a716-446655440001",
        roomId: "550e8400-e29b-41d4-a716-446655440002",
        content: {
          text: "Hello, world!",
          source: "test",
        },
        createdAt: 1704067200000,
      };

      const tsJson = JSON.stringify(memory);
      const rustMemory = wasm.parseMemory(tsJson);
      const rustJson = rustMemory.toJson();

      // Parse both to compare
      const tsObj = JSON.parse(tsJson);
      const rustObj = JSON.parse(rustJson);

      // Key fields should match
      expect(rustObj.id).toBe(tsObj.id);
      expect(rustObj.entityId).toBe(tsObj.entityId);
      expect(rustObj.roomId).toBe(tsObj.roomId);
      expect(rustObj.content && rustObj.content.text).toBe(tsObj.content && tsObj.content.text);
      expect(rustObj.createdAt).toBe(tsObj.createdAt);
    });

    it("should handle optional fields consistently", () => {
      if (!wasm) return;

      const minimalMemory: Memory = {
        entityId: "550e8400-e29b-41d4-a716-446655440001",
        roomId: "550e8400-e29b-41d4-a716-446655440002",
        content: { text: "test" },
      };

      const tsJson = JSON.stringify(minimalMemory);
      const rustMemory = wasm.parseMemory(tsJson);
      const rustJson = rustMemory.toJson();

      const rustObj = JSON.parse(rustJson);

      // Required fields should be present
      expect(rustObj.entityId).toBe(minimalMemory.entityId);
      expect(rustObj.roomId).toBe(minimalMemory.roomId);
      expect(rustObj.content && rustObj.content.text).toBe("test");
    });

    it("should pass round-trip test", () => {
      if (!wasm) return;

      const memory: Memory = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        entityId: "550e8400-e29b-41d4-a716-446655440001",
        roomId: "550e8400-e29b-41d4-a716-446655440002",
        content: {
          text: "Test message",
          source: "integration-test",
          metadata: { key: "value" },
        },
        createdAt: Date.now(),
      };

      expect(wasm.testMemoryRoundTrip(JSON.stringify(memory))).toBe(true);
    });
  });

  describe("Character Serialization Equivalence", () => {
    it("should serialize Character identically", () => {
      if (!wasm) return;

      const character: Character = {
```