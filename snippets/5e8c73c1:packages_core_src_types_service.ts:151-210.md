# 5e8c73c1:packages_core_src_types_service.ts:151-210

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/service.ts:151-210
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
  serviceType: ServiceTypeName
): TypedService<ConfigType, InputType, ResultType> | null {
  return runtime.getService<TypedService<ConfigType, InputType, ResultType>>(serviceType);
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
export function createServiceError(error: unknown, code = 'UNKNOWN_ERROR'): ServiceError {
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