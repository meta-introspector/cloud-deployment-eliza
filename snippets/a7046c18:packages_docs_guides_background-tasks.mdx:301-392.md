# a7046c18:packages_docs_guides_background-tasks.mdx:301-392

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/background-tasks.mdx:301-392
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  description: 'Schedule a background report generation',

  async handler(runtime, message, state) {
    const taskId = await runtime.createTask({
      name: 'GENERATE_REPORT',
      description: 'Weekly analytics report',
      roomId: message.roomId,
      tags: ['report', 'analytics'],
      metadata: {
        format: 'pdf',
        recipients: ['team@example.com']
      }
    });

    return {
      text: `Report scheduled. Task ID: ${taskId}`,
      action: 'SCHEDULE_REPORT',
      success: true,
      data: { taskId }
    };
  }
};
```

### With Progress Updates

```typescript
const progressWorker: TaskWorker = {
  name: 'LONG_PROCESSING',

  async execute(runtime, options, task) {
    const items = options.items as string[];
    let processed = 0;

    for (const item of items) {
      await processItem(item);
      processed++;

      // Update progress in metadata
      if (task.id && processed % 10 === 0) {
        await runtime.updateTask(task.id, {
          metadata: {
            ...task.metadata,
            progress: Math.round((processed / items.length) * 100)
          }
        });
      }
    }
  }
};
```

### Chained Tasks

```typescript
const step1Worker: TaskWorker = {
  name: 'PIPELINE_STEP_1',

  async execute(runtime, options, task) {
    const result = await doStep1();

    // Create next step
    await runtime.createTask({
      name: 'PIPELINE_STEP_2',
      description: 'Continue pipeline',
      roomId: task.roomId,
      tags: task.tags,
      metadata: {
        previousResult: result,
        pipelineId: options.pipelineId
      }
    });
  }
};
```

## Next Steps

<CardGroup cols={2}>
  <Card title="Actions Reference" icon="bolt" href="/plugins/components#actions">
    Trigger tasks from agent actions
  </Card>
  <Card title="Events System" icon="bell" href="/runtime/events">
    Monitor task lifecycle with events
  </Card>
  <Card title="Jobs API" icon="briefcase" href="/rest-reference/jobs/create-job">
    External task creation via REST
  </Card>
  <Card title="Database Adapter" icon="database" href="/runtime/core#database">
    Task persistence internals
  </Card>
</CardGroup>
```