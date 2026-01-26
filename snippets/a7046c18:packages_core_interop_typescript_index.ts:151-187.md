# a7046c18:packages_core_interop_typescript_index.ts:151-187

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/index.ts:151-187
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/**
 * Resolve a path relative to base
 */
async function resolvePath(base: string, relative: string): Promise<string> {
  if (relative.startsWith("/") || relative.startsWith("http")) {
    return relative;
  }

  const isNode =
    typeof globalThis.process !== "undefined" &&
    globalThis.process.versions &&
    globalThis.process.versions.node;
  if (isNode) {
    const path = await import("node:path");
    return path.resolve(base, relative);
  } else {
    return `${base}/${relative}`;
  }
}

/**
 * Infer interop config from manifest if not provided
 */
function inferInterop(manifest: PluginManifest): PluginInteropConfig {
  switch (manifest.language) {
    case "rust":
      return { protocol: "wasm", wasmPath: `./dist/${manifest.name}.wasm` };
    case "python":
      return { protocol: "ipc" };
    case "typescript":
      return { protocol: "native" };
    default:
      return { protocol: "native" };
  }
}
```