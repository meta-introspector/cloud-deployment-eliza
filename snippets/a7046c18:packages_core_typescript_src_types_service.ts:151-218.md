# a7046c18:packages_core_typescript_src_types_service.ts:151-218

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service.ts:151-218
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 */
export interface TypedService<
  ConfigType extends Metadata = Metadata,
  InputType = unknown,
  ResultType = unknown,
> extends Service {
  /**
   * The configuration for this service instance
   */
  config?: ConfigType;

  /**
   * Process an input with this service
   * @param input The input to process
   * @returns A promise resolving to the result
   */
  process(input: InputType): Promise<ResultType>;
}

/**
 * Generic factory function to create a typed service instance
 * @param runtime The agent runtime
 * @param serviceType The type of service to get
 * @returns The service instance or null if not available
 */
export function getTypedService<
  ConfigType extends Metadata = Metadata,
  InputType = unknown,
  ResultType = unknown,
>(
  runtime: IAgentRuntime,
  serviceType: ServiceTypeName,
): TypedService<ConfigType, InputType, ResultType> | null {
  return runtime.getService<TypedService<ConfigType, InputType, ResultType>>(
    serviceType,
  );
}

/**
 * Standardized service error type for consistent error handling
 */
export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown> | string | number | boolean | null;
  cause?: Error;
}

/**
 * Safely create a ServiceError from any caught error
 */
export function createServiceError(
  error: unknown,
  code = "UNKNOWN_ERROR",
): ServiceError {
  if (error instanceof Error) {
    return {
      code,
      message: error.message,
      cause: error,
    };
  }

  return {
    code,
    message: String(error),
  };
}
```