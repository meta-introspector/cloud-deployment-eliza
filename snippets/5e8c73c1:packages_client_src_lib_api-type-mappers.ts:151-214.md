# 5e8c73c1:packages_client_src_lib_api-type-mappers.ts:151-214

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/lib/api-type-mappers.ts:151-214
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    roomId: apiLog.roomId,
    body: apiLog.body as AgentLogBody,
    createdAt: apiLog.createdAt ? apiDateToTimestamp(apiLog.createdAt) : undefined,
  };
}

// Body type for AgentLog
export interface AgentLogBody {
  modelType?: string;
  modelKey?: string;
  action?: string;
  actionId?: string;
  params?: Record<string, unknown> & { prompt?: string };
  prompts?: Array<{ name?: string; content?: string; modelType?: string; prompt?: string }>;
  promptCount?: number;
  response?:
    | string
    | {
        usage?: {
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
        };
        [key: string]: unknown;
      };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  [key: string]: unknown;
}

// Type for client-side AgentLog
export interface AgentLog {
  id?: UUID;
  type?: string;
  timestamp?: number;
  message?: string;
  details?: string;
  roomId?: UUID;
  body?: AgentLogBody;
  createdAt?: number;
}

// Map API Memory to client Memory
export function mapApiMemoryToClient(apiMemory: ApiMemory): Memory {
  // Extract entityId from available sources, fallback to agentId if none available
  const entityId = (apiMemory.entityId ||
    apiMemory.metadata?.entityId ||
    apiMemory.metadata?.userId ||
    apiMemory.agentId) as UUID;

  return {
    id: apiMemory.id as UUID,
    entityId,
    agentId: apiMemory.agentId as UUID,
    content: apiMemory.content as Memory['content'],
    embedding: apiMemory.embedding,
    roomId: apiMemory.roomId as UUID,
    createdAt: apiDateToTimestamp(apiMemory.createdAt),
    unique: apiMemory.metadata?.unique as boolean | undefined,
  };
}
```