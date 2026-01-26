# a7046c18:packages_core_typescript_src_types_bun-test.d.ts:1-50

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/bun-test.d.ts:1-50
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Extended type definitions for Bun's test module
 * Provides proper typing for mock functions with mockResolvedValue and other methods
 */

declare module "bun:test" {
  /**
   * Mock function interface with all bun:test mock methods
   */
  export interface MockFunction<T extends (...args: never[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T>;
    mockResolvedValue: <R = Awaited<ReturnType<T>>>(
      value: R,
    ) => MockFunction<T>;
    mockResolvedValueOnce: <R = Awaited<ReturnType<T>>>(
      value: R,
    ) => MockFunction<T>;
    mockRejectedValue: (error: unknown) => MockFunction<T>;
    mockRejectedValueOnce: (error: unknown) => MockFunction<T>;
    mockReturnValue: <R = ReturnType<T>>(value: R) => MockFunction<T>;
    mockReturnValueOnce: <R = ReturnType<T>>(value: R) => MockFunction<T>;
    mockImplementation: (fn: T) => MockFunction<T>;
    mockImplementationOnce: (fn: T) => MockFunction<T>;
    mockClear: () => void;
    mockReset: () => void;
    mockRestore: () => void;
    mock: {
      calls: Parameters<T>[];
      results: ReturnType<T>[];
    };
    toHaveBeenCalled: () => void;
    toHaveBeenCalledWith: (...args: Parameters<T>) => void;
    toHaveBeenCalledTimes: (count: number) => void;
  }

  /**
   * Mock function creator with proper typing
   */
  export function mock<T extends (...args: never[]) => unknown>(
    implementation?: T,
  ): MockFunction<T>;

  /**
   * Spy on object method with proper typing
   */
  export function spyOn<T extends object, K extends keyof T>(
    object: T,
    method: K,
  ): T[K] extends (...args: never[]) => unknown ? MockFunction<T[K]> : never;
}
```