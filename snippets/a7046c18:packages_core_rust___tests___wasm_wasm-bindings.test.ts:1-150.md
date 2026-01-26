# a7046c18:packages_core_rust___tests___wasm_wasm-bindings.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/wasm/wasm-bindings.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview WASM Bindings Tests
 *
 * Tests the Rust WASM bindings to ensure they work correctly from TypeScript.
 * These tests verify that the WASM module can be loaded and used properly.
 *
 * Note: These tests require the WASM module to be built first:
 *   cd packages/core/rust && ./build-wasm.sh
 */

import { beforeAll, describe, expect, it } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

// Types for the WASM module
interface WasmModule {
  WasmUUID: {
    new (): { toString: () => string };
    fromString(s: string): { toString: () => string };
  };
  WasmMemory: {
    fromJson(json: string): {
      toJson: () => string;
      id: string | null;
      entityId: string;
      roomId: string;
      content: string;
    };
  };
  WasmCharacter: {
    fromJson(json: string): {
      toJson: () => string;
      name: string;
      system: string | null;
    };
  };
  WasmAgent: {
    fromJson(json: string): {
      toJson: () => string;
      id: string;
      name: string;
    };
  };
  WasmPlugin: {
    fromJson(json: string): {
      toJson: () => string;
      name: string;
      description: string | null;
    };
  };
  parseCharacter(
    json: string,
  ): ReturnType<WasmModule["WasmCharacter"]["fromJson"]>;
  parseMemory(json: string): ReturnType<WasmModule["WasmMemory"]["fromJson"]>;
  validateUUID(uuid: string): boolean;
  generateUUID(): string;
  stringToUuid(input: string): string;
  getVersion(): string;
  testMemoryRoundTrip(json: string): boolean;
  testCharacterRoundTrip(json: string): boolean;
  testAgentRoundTrip(json: string): boolean;
}

// Check if WASM module is built
const wasmPkgPath = path.join(__dirname, "../../pkg");
const wasmNodePath = path.join(__dirname, "../../pkg-node");
const wasmExists = fs.existsSync(wasmPkgPath) || fs.existsSync(wasmNodePath);

// Skip tests if WASM not built
const describeWasm = wasmExists ? describe : describe.skip;

describeWasm("WASM Bindings", () => {
  let wasm: WasmModule;

  beforeAll(async () => {
    // Try to load WASM module
    try {
      // For Node.js, use the node-specific build
      if (fs.existsSync(wasmNodePath)) {
        wasm = await import("../../pkg-node/elizaos_core.js");
      } else {
        wasm = await import("../../pkg/elizaos_core.js");
      }
    } catch (error) {
      console.warn("WASM module not available:", error);
    }
  });

  describe("UUID Operations", () => {
    it("should generate valid UUIDs", () => {
      if (!wasm) return;

      const uuid = wasm.generateUUID();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe("string");
      expect(uuid.length).toBe(36);
      expect(wasm.validateUUID(uuid)).toBe(true);
    });

    it("should validate UUIDs correctly", () => {
      if (!wasm) return;

      expect(wasm.validateUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(
        true,
      );
      expect(wasm.validateUUID("invalid-uuid")).toBe(false);
      expect(wasm.validateUUID("")).toBe(false);
    });

    it("should convert strings to UUIDs deterministically", () => {
      if (!wasm) return;

      const uuid1 = wasm.stringToUuid("test-input");
      const uuid2 = wasm.stringToUuid("test-input");
      expect(uuid1).toBe(uuid2);

      const uuid3 = wasm.stringToUuid("different-input");
      expect(uuid1).not.toBe(uuid3);
    });

    it("should create UUID instances", () => {
      if (!wasm) return;

      const uuid = new wasm.WasmUUID();
      expect(uuid.toString()).toBeDefined();
      expect(uuid.toString().length).toBe(36);
    });

    it("should parse UUID from string", () => {
      if (!wasm) return;

      const uuidStr = "550e8400-e29b-41d4-a716-446655440000";
      const uuid = wasm.WasmUUID.fromString(uuidStr);
      expect(uuid.toString()).toBe(uuidStr);
    });
  });

  describe("Memory Operations", () => {
    const testMemoryJson = JSON.stringify({
      id: "550e8400-e29b-41d4-a716-446655440000",
      entityId: "550e8400-e29b-41d4-a716-446655440001",
      roomId: "550e8400-e29b-41d4-a716-446655440002",
      content: {
        text: "Hello, world!",
        source: "test",
      },
      createdAt: 1704067200000,
    });

    it("should parse memory from JSON", () => {
```