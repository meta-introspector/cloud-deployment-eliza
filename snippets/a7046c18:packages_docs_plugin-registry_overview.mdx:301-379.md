# a7046c18:packages_docs_plugin-registry_overview.mdx:301-379

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/overview.mdx:301-379
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

From the Plugin interface:
```typescript
export type Route = {
  type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'STATIC';
  path: string;
  filePath?: string;                    // For static files
  public?: boolean;                     // Public access
  name?: string;                        // Route name
  handler?: (req: RouteRequest, res: RouteResponse, runtime: IAgentRuntime) => Promise<void>;
  isMultipart?: boolean;                // File uploads
};
```

Example from starter plugin:
```typescript
routes: [
  {
    name: 'hello-world-route',
    path: '/helloworld',
    type: 'GET',
    handler: async (_req: any, res: any) => {
      res.json({ message: 'Hello World!' });
    }
  }
]
```

## 6. Event System Integration

From `/Users/studio/Documents/GitHub/eliza/packages/core/src/types/events.ts`:

### Event Types
Standard events include:
- World events: WORLD_JOINED, WORLD_CONNECTED, WORLD_LEFT
- Entity events: ENTITY_JOINED, ENTITY_LEFT, ENTITY_UPDATED
- Room events: ROOM_JOINED, ROOM_LEFT
- Message events: MESSAGE_RECEIVED, MESSAGE_SENT, MESSAGE_DELETED
- Voice events: VOICE_MESSAGE_RECEIVED, VOICE_MESSAGE_SENT
- Run events: RUN_STARTED, RUN_ENDED, RUN_TIMEOUT
- Action/Evaluator events: ACTION_STARTED/COMPLETED, EVALUATOR_STARTED/COMPLETED
- Model events: MODEL_USED

### Plugin Event Handlers
```typescript
export type PluginEvents = {
  [K in keyof EventPayloadMap]?: EventHandler<K>[];
} & {
  [key: string]: ((params: any) => Promise<any>)[];
};
```

## 7. Database Adapter Plugins

From `/Users/studio/Documents/GitHub/eliza/packages/core/src/types/database.ts`:

The IDatabaseAdapter interface is extensive, including methods for:
- Agents, Entities, Components
- Memories (with embeddings)
- Rooms, Participants
- Relationships
- Tasks
- Caching
- Logs

Example: SQL Plugin creates database adapters:
```typescript
export const plugin: Plugin = {
  name: '@elizaos/plugin-sql',
  description: 'A plugin for SQL database access with dynamic schema migrations',
  priority: 0,
  schema,
  init: async (_, runtime: IAgentRuntime) => {
    const dbAdapter = createDatabaseAdapter(config, runtime.agentId);
    runtime.registerDatabaseAdapter(dbAdapter);
  }
};
```

```