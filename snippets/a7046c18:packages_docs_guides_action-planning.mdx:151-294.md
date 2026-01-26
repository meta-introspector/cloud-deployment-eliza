# a7046c18:packages_docs_guides_action-planning.mdx:151-294

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/action-planning.mdx:151-294
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      success: true
    };
  }
};
```

## Retrieving Results After Execution

After message processing, retrieve action results programmatically:

```typescript
// Process a message
const result = await runtime.handleMessage({
  entityId: userId,
  roomId: roomId,
  content: { text: 'Search and summarize AI news', source: 'api' }
});

// Get the action results from that message
const actionResults = runtime.getActionResults(result.messageId);

for (const result of actionResults) {
  console.log(`${result.action}: ${result.success ? 'OK' : 'FAILED'}`);
  console.log(`Output: ${result.text}`);
  if (result.data) {
    console.log(`Data:`, result.data);
  }
}
```

## Designing Actions for Chaining

When building actions that work well in chains:

<CardGroup cols={2}>
  <Card title="Return structured data" icon="database">
    Include a `data` field in results for downstream actions to consume programmatically.
  </Card>
  <Card title="Be idempotent" icon="rotate">
    Actions may be retried. Avoid side effects that can't be repeated safely.
  </Card>
  <Card title="Check prerequisites" icon="check-double">
    Verify required previous results exist before proceeding.
  </Card>
  <Card title="Fail gracefully" icon="shield">
    Return `success: false` with a clear error message rather than throwing.
  </Card>
</CardGroup>

### Example: Data Pipeline

```typescript
// Step 1: Fetch data
const fetchAction: Action = {
  name: 'FETCH_DATA',
  async handler(runtime, message, state) {
    const data = await fetchFromAPI();
    return {
      text: `Fetched ${data.length} records`,
      action: 'FETCH_DATA',
      success: true,
      data: { records: data }  // Structured data for next step
    };
  }
};

// Step 2: Transform data (uses Step 1 output)
const transformAction: Action = {
  name: 'TRANSFORM_DATA',
  async handler(runtime, message, state) {
    const fetchResult = state?.data?.actionResults?.find(
      r => r.action === 'FETCH_DATA'
    );

    if (!fetchResult?.data?.records) {
      return { text: 'No data to transform', action: 'TRANSFORM_DATA', success: false };
    }

    const transformed = fetchResult.data.records.map(r => ({
      ...r,
      processed: true,
      timestamp: Date.now()
    }));

    return {
      text: `Transformed ${transformed.length} records`,
      action: 'TRANSFORM_DATA',
      success: true,
      data: { records: transformed }
    };
  }
};

// Step 3: Store data (uses Step 2 output)
const storeAction: Action = {
  name: 'STORE_DATA',
  async handler(runtime, message, state) {
    const transformResult = state?.data?.actionResults?.find(
      r => r.action === 'TRANSFORM_DATA'
    );

    if (!transformResult?.data?.records) {
      return { text: 'No data to store', action: 'STORE_DATA', success: false };
    }

    await database.insert(transformResult.data.records);

    return {
      text: `Stored ${transformResult.data.records.length} records`,
      action: 'STORE_DATA',
      success: true
    };
  }
};
```

## ActionResult Type

```typescript
interface ActionResult {
  action: string;       // Action name
  text: string;         // Human-readable result
  success: boolean;     // Did it work?
  error?: string;       // Error message if failed
  data?: Record<string, unknown>;  // Structured data for chaining
}
```

## Next Steps

<CardGroup cols={2}>
  <Card title="Actions Reference" icon="bolt" href="/plugins/components#actions">
    Complete action handler API
  </Card>
  <Card title="State Management" icon="layer-group" href="/runtime/core#state">
    How state flows through the runtime
  </Card>
  <Card title="Background Tasks" icon="clock" href="/guides/background-tasks">
    Long-running actions with task workers
  </Card>
  <Card title="Streaming" icon="wave-pulse" href="/guides/streaming-responses">
    Stream action outputs in real-time
  </Card>
</CardGroup>
```