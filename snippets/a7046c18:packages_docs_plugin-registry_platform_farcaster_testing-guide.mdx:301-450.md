# a7046c18:packages_docs_plugin-registry_platform_farcaster_testing-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/testing-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    await runtime.action("POST_CAST", {
      text: "Event test"
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(eventFired).toBe(true);
  });
  
  it("should handle mention events", async () => {
    const runtime = await createTestRuntime({
      plugins: [farcasterPlugin]
    });
    
    const mentions: any[] = [];
    runtime.on("farcaster:mention", (event) => {
      mentions.push(event);
    });
    
    // Simulate incoming mention
    await runtime.simulateEvent("farcaster:mention", {
      cast: {
        text: "@agent hello!",
        author: { fid: 123 }
      }
    });
    
    expect(mentions).toHaveLength(1);
    expect(mentions[0].cast.text).toContain("@agent");
  });
});
```

## End-to-End Tests

### Full Flow Test

```typescript
// test/e2e/full-flow.test.ts
import { describe, it, expect } from "bun:test";
import { createAgent } from "@elizaos/core";
import { farcasterPlugin } from "@elizaos/plugin-farcaster";

describe("E2E: Farcaster Agent Flow", () => {
  it("should perform complete interaction flow", async () => {
    // Create agent with Farcaster plugin
    const agent = await createAgent({
      name: "TestAgent",
      plugins: [farcasterPlugin],
      env: {
        FARCASTER_MNEMONIC: "test mnemonic ...",
        FARCASTER_FID: "99999",
        FARCASTER_DRY_RUN: "true"
      }
    });
    
    // Start agent
    await agent.start();
    
    // Post initial cast
    const cast = await agent.execute("POST_CAST", {
      text: "Hello from test agent!"
    });
    
    expect(cast.success).toBe(true);
    
    // Simulate incoming reply
    await agent.handleEvent({
      type: "farcaster:reply",
      data: {
        cast: {
          text: "Welcome to Farcaster!",
          parentHash: cast.hash,
          author: { fid: 123 }
        }
      }
    });
    
    // Check if agent responded
    const responses = await agent.getResponses();
    expect(responses).toHaveLength(1);
    expect(responses[0].type).toBe("REPLY_CAST");
    
    // Stop agent
    await agent.stop();
  });
});
```

### Load Testing

```typescript
// test/load/cast-load.test.ts
import { describe, it, expect } from "bun:test";
import { FarcasterService } from "@elizaos/plugin-farcaster";
import { createTestRuntime } from "@elizaos/test-utils";

describe("Load Testing", () => {
  it("should handle rapid casting via actions", async () => {
    const runtime = await createTestRuntime();
    const service = new FarcasterService();
    await service.start(runtime);
    
    const castService = service.getCastService(runtime.agentId);
    const promises = [];
    
    // Send 50 casts rapidly
    for (let i = 0; i < 50; i++) {
      promises.push(
        castService.publishCast(`Load test cast ${i}`)
          .catch(err => ({ error: err }))
      );
    }
    
    const results = await Promise.all(promises);
    
    // Check success rate
    const successful = results.filter(r => !r.error);
    const successRate = successful.length / results.length;
    
    expect(successRate).toBeGreaterThan(0.8); // 80% success rate
  });
  
  it("should handle concurrent message operations", async () => {
    const runtime = await createTestRuntime();
    const service = new FarcasterService();
    await service.start(runtime);
    
    const messageService = service.getMessageService(runtime.agentId);
    
    // Perform multiple operations concurrently
    const operations = await Promise.all([
      messageService.sendMessage({ text: "Concurrent 1" }),
      messageService.sendMessage({ text: "Concurrent 2" }),
      messageService.sendMessage({ text: "Concurrent 3" })
    ]);
    
    expect(operations).toHaveLength(3);
    operations.forEach(op => {
      expect(op.error).toBeUndefined();
    });
  });
});
```

## Mock Data Generators

```typescript
// test/utils/generators.ts
export function generateMockCast(overrides = {}) {
  return {
```