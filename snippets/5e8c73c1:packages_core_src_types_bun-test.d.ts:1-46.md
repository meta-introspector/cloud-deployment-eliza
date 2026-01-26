# 5e8c73c1:packages_core_src_types_bun-test.d.ts:1-46

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/bun-test.d.ts:1-46
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Extended type definitions for Bun's test module
 * Provides proper typing for mock functions with mockResolvedValue and other methods
 */

declare module 'bun:test' {
  /**
   * Mock function interface with all bun:test mock methods
   */
  export interface MockFunction<T extends (...args: never[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T>;
    mockResolvedValue: <R = Awaited<ReturnType<T>>>(value: R) => MockFunction<T>;
    mockResolvedValueOnce: <R = Awaited<ReturnType<T>>>(value: R) => MockFunction<T>;
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
    implementation?: T
  ): MockFunction<T>;

  /**
   * Spy on object method with proper typing
   */
  export function spyOn<T extends object, K extends keyof T>(
    object: T,
    method: K
  ): T[K] extends (...args: never[]) => unknown ? MockFunction<T[K]> : never;
}
```