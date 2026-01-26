# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:1201-1249

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:1201-1249
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      }
    }

    return true;
  },
};
```

### Streaming Response Pattern

```typescript
const streamingAction: Action = {
  name: 'STREAM_DATA',

  handler: async (runtime, message, state, options, callback) => {
    const dataStream = await getDataStream(message.content.query);

    // Initial response
    await callback({
      text: 'Streaming data as it arrives...',
      actions: ['STREAM_START'],
    });

    // Stream chunks
    for await (const chunk of dataStream) {
      await callback({
        text: chunk.data,
        actions: ['STREAM_CHUNK'],
        metadata: {
          chunkId: chunk.id,
          isPartial: true,
        },
      });

      // Rate limit streaming
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Final summary
    await callback({
      text: "Streaming complete! Here's a summary of the data...",
      actions: ['STREAM_COMPLETE'],
      metadata: { totalChunks: dataStream.length },
    });

    return true;
  },
};
```
```