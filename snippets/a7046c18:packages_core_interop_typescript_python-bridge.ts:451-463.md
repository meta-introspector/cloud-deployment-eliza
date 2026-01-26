# a7046c18:packages_core_interop_typescript_python-bridge.ts:451-463

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/python-bridge.ts:451-463
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/**
 * Stop a Python plugin bridge
 */
export async function stopPythonPlugin(plugin: Plugin): Promise<void> {
  const extended = plugin as Plugin & {
    _bridge?: { current: PythonPluginBridge };
  };
  if (extended._bridge && extended._bridge.current) {
    await extended._bridge.current.stop();
  }
}
```