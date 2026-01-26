# 5e8c73c1:packages_core_src_types_service.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/service.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { Metadata } from './primitives';
import type { IAgentRuntime } from './runtime';

/**
 * Core service type registry that can be extended by plugins via module augmentation.
 * Plugins can extend this interface to add their own service types:
 *
 * @example
 * ```typescript
 * declare module '@elizaos/core' {
 *   interface ServiceTypeRegistry {
 *     MY_CUSTOM_SERVICE: 'my_custom_service';
 *   }
 * }
 * ```
 */
export interface ServiceTypeRegistry {
  TRANSCRIPTION: 'transcription';
  VIDEO: 'video';
  BROWSER: 'browser';
  PDF: 'pdf';
  REMOTE_FILES: 'aws_s3';
  WEB_SEARCH: 'web_search';
  EMAIL: 'email';
  TEE: 'tee';
  TASK: 'task';
  WALLET: 'wallet';
  LP_POOL: 'lp_pool';
  TOKEN_DATA: 'token_data';
  MESSAGE_SERVICE: 'message_service';
  MESSAGE: 'message';
  POST: 'post';
  UNKNOWN: 'unknown';
}

/**
 * Type for service names that includes both core services and any plugin-registered services
 */
export type ServiceTypeName = ServiceTypeRegistry[keyof ServiceTypeRegistry];

/**
 * Helper type to extract service type values from the registry
 */
export type ServiceTypeValue<K extends keyof ServiceTypeRegistry> = ServiceTypeRegistry[K];

/**
 * Helper type to check if a service type exists in the registry
 */
export type IsValidServiceType<T extends string> = T extends ServiceTypeName ? true : false;

/**
 * Type-safe service class definition
 */
export type TypedServiceClass<T extends ServiceTypeName> = {
  new (runtime?: IAgentRuntime): Service;
  serviceType: T;
  start(runtime: IAgentRuntime): Promise<Service>;
};

/**
 * Map of service type names to their implementation classes
 */
export interface ServiceClassMap {
  // Core services will be added here, plugins extend via module augmentation
}

/**
 * Helper to infer service instance type from service type name
 */
export type ServiceInstance<T extends ServiceTypeName> = T extends keyof ServiceClassMap
  ? InstanceType<ServiceClassMap[T]>
  : Service;

/**
 * Runtime service registry type
 */
export type ServiceRegistry<T extends ServiceTypeName = ServiceTypeName> = Map<T, Service>;

/**
 * Enumerates the recognized types of services that can be registered and used by the agent runtime.
 * Services provide specialized functionalities like audio transcription, video processing,
 * web browsing, PDF handling, file storage (e.g., AWS S3), web search, email integration,
 * secure execution via TEE (Trusted Execution Environment), and task management.
 * This constant is used in `AgentRuntime` for service registration and retrieval (e.g., `getService`).
 * Each service typically implements the `Service` abstract class or a more specific interface like `IVideoService`.
 */
export const ServiceType = {
  TRANSCRIPTION: 'transcription',
  VIDEO: 'video',
  BROWSER: 'browser',
  PDF: 'pdf',
  REMOTE_FILES: 'aws_s3',
  WEB_SEARCH: 'web_search',
  EMAIL: 'email',
  TEE: 'tee',
  TASK: 'task',
  WALLET: 'wallet',
  LP_POOL: 'lp_pool',
  TOKEN_DATA: 'token_data',
  MESSAGE_SERVICE: 'message_service',
  MESSAGE: 'message',
  POST: 'post',
  UNKNOWN: 'unknown',
} as const satisfies ServiceTypeRegistry;

/**
 * Client instance
 */
export abstract class Service {
  /** Runtime instance */
  protected runtime!: IAgentRuntime;

  constructor(runtime?: IAgentRuntime) {
    if (runtime) {
      this.runtime = runtime;
    }
  }

  abstract stop(): Promise<void>;

  /** Service type */
  static serviceType: string;

  /** Service name */
  abstract capabilityDescription: string;

  /** Service configuration */
  config?: Metadata;

  /** Start service connection */
  static async start(_runtime: IAgentRuntime): Promise<Service> {
    throw new Error('Not implemented');
  }

  /** Stop service connection */
  static async stop(_runtime: IAgentRuntime): Promise<void> {
    throw new Error('Not implemented');
  }

  /** Optional static method to register send handlers */
  static registerSendHandlers?(runtime: IAgentRuntime, service: Service): void;
}

/**
 * Generic service interface that provides better type checking for services
 * @template ConfigType The configuration type for this service
 * @template ResultType The result type returned by the service operations
 */
export interface TypedService<
  ConfigType extends Metadata = Metadata,
```