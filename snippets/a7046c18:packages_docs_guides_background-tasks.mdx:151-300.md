# a7046c18:packages_docs_guides_background-tasks.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/background-tasks.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
interface TaskWorker {
  name: string;                 // Unique identifier

  execute: (
    runtime: IAgentRuntime,
    options: Record<string, unknown>,  // From task.metadata
    task: Task
  ) => Promise<void>;

  validate?: (              // Optional pre-creation check
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ) => Promise<boolean>;
}
```

## Managing Tasks

### Query Tasks

```typescript
// Get tasks by room
const roomTasks = await runtime.getTasks({
  roomId: 'room-uuid'
});

// Get tasks by tags
const syncTasks = await runtime.getTasks({
  tags: ['sync']
});

// Get tasks by entity
const userTasks = await runtime.getTasks({
  entityId: 'user-uuid'
});

// Get tasks by name
const allSyncWorkers = await runtime.getTasksByName('SYNC_EXTERNAL_DATA');

// Get specific task
const task = await runtime.getTask('task-uuid');
```

### Update Tasks

```typescript
await runtime.updateTask(taskId, {
  description: 'Updated description',
  metadata: {
    ...existingMetadata,
    sourceUrl: 'https://new-api.example.com'
  }
});
```

### Delete Tasks

```typescript
// Stop a recurring task
await runtime.deleteTask(taskId);
```

## Recurring Tasks

Set `metadata.updateInterval` to create tasks that run periodically:

```typescript
// Daily summary at midnight
await runtime.createTask({
  name: 'DAILY_SUMMARY',
  description: 'Generate daily activity summary',
  tags: ['scheduled', 'daily'],
  metadata: {
    updateInterval: 24 * 60 * 60 * 1000  // 24 hours
  }
});

// Check external service every 5 minutes
await runtime.createTask({
  name: 'HEALTH_CHECK',
  description: 'Ping external service',
  tags: ['scheduled', 'monitoring'],
  metadata: {
    updateInterval: 5 * 60 * 1000,  // 5 minutes
    serviceUrl: 'https://api.example.com/health'
  }
});
```

## Error Handling

Handle errors gracefully in your workers:

```typescript
const robustWorker: TaskWorker = {
  name: 'ROBUST_SYNC',

  async execute(runtime, options, task) {
    try {
      await performSync(options);
    } catch (error) {
      // Log the error
      console.error(`Task ${task.id} failed:`, error);

      // Optionally update task with error info
      if (task.id) {
        await runtime.updateTask(task.id, {
          metadata: {
            ...task.metadata,
            lastError: error.message,
            lastErrorAt: Date.now()
          }
        });
      }

      // Re-throw to mark task as failed
      // Or swallow to silently continue (for recurring tasks)
      throw error;
    }
  }
};
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Keep workers idempotent" icon="rotate">
    Tasks may be retried on failure. Design workers to handle duplicate execution safely.
  </Card>
  <Card title="Use meaningful tags" icon="tags">
    Tags make querying easier. Use consistent naming like `sync:crm`, `schedule:daily`.
  </Card>
  <Card title="Set reasonable intervals" icon="clock">
    Avoid too-frequent recurring tasks. Consider rate limits and system load.
  </Card>
  <Card title="Validate before creating" icon="check">
    Use the `validate` function to prevent invalid tasks from being queued.
  </Card>
</CardGroup>

## Common Patterns

### Triggered by Actions

```typescript
const scheduleAction: Action = {
  name: 'SCHEDULE_REPORT',
```