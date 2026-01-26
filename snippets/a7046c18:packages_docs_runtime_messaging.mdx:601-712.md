# a7046c18:packages_docs_runtime_messaging.mdx:601-712

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/messaging.mdx:601-712
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

SSE Events:
```
event: user_message
data: {"id": "...", "text": "Hello"}

event: chunk
data: {"messageId": "...", "chunk": "Hi", "index": 0}

event: chunk
data: {"messageId": "...", "chunk": " there!", "index": 1}

event: done
data: {"text": "Hi there!", "actions": []}
```

JavaScript client:
```javascript
const response = await fetch('/api/messaging/channels/{channelId}/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Hello', entityId: '...', mode: 'stream' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Parse SSE format: "event: xxx\ndata: {...}\n\n"
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log('Chunk:', data);
    }
  }
}
```

### Sync Mode

Waits for complete agent response before returning. Useful for scripts and testing.

```bash
curl -X POST /api/messaging/channels/{channelId}/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "entityId": "...", "mode": "sync"}'
```

Response:
```json
{
  "success": true,
  "userMessage": { "id": "...", "text": "Hello" },
  "agentResponse": {
    "text": "Hi there! How can I help you today?",
    "actions": []
  }
}
```

### Stream Extractors (Advanced)

For plugin developers, ElizaOS provides stream extractors to control what content is streamed from LLM responses.

```typescript
import { IStreamExtractor } from '@elizaos/core';

interface IStreamExtractor {
  /** Whether extraction is complete */
  readonly done: boolean;

  /**
   * Process a chunk from the LLM stream
   * @returns Text to stream to client (empty = nothing yet)
   */
  push(chunk: string): string;
}
```

Available extractors:

| Extractor | Purpose |
|-----------|---------|
| `PassthroughExtractor` | Streams all content as-is |
| `XmlTagExtractor` | Extracts content from specific XML tags |
| `ResponseStreamExtractor` | Default - action-aware XML extraction |
| `ActionStreamFilter` | Auto-detects content type (JSON/XML/text) |

## See Also

<CardGroup cols={2}>
  <Card title="Sessions API" icon="comments" href="/runtime/sessions-api">
    Build persistent conversations on messaging
  </Card>

  <Card title="Services" icon="server" href="/runtime/services">
    Create messaging service integrations
  </Card>

  <Card title="Events" icon="bolt" href="/runtime/events">
    Handle real-time messaging events
  </Card>

  <Card title="Providers" icon="database" href="/runtime/providers">
    Supply message context to providers
  </Card>
</CardGroup>
```