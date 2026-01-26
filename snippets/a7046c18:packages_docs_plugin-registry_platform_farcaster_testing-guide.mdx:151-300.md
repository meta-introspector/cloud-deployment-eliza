# a7046c18:packages_docs_plugin-registry_platform_farcaster_testing-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/testing-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  
  it("should filter by channel", async () => {
    const runtime = createMockRuntime();
    const casts = await castProvider.getCasts(runtime, {
      channel: "/elizaos",
      limit: 5
    });
    
    casts.forEach(cast => {
      expect(cast.channel).toBe("/elizaos");
    });
  });
  
  it("should include replies when requested", async () => {
    const runtime = createMockRuntime();
    const casts = await castProvider.getCasts(runtime, {
      includeReplies: true
    });
    
    const replies = casts.filter(c => c.parentHash);
    expect(replies.length).toBeGreaterThan(0);
  });
});
```

### Evaluator Tests

```typescript
// test/evaluators/engagement.test.ts
import { describe, it, expect } from "bun:test";
import { engagementEvaluator } from "@elizaos/plugin-farcaster";

describe("Engagement Evaluator", () => {
  it("should evaluate high-quality casts positively", async () => {
    const cast = {
      text: "Just deployed a new feature for elizaOS agents!",
      author: { fid: 123, username: "dev" },
      reactions: { count: 15 },
      recasts: { count: 5 }
    };
    
    const score = await engagementEvaluator.evaluate(cast);
    expect(score).toBeGreaterThan(0.7);
  });
  
  it("should evaluate spam negatively", async () => {
    const cast = {
      text: "Buy now! Click here! Limited offer!",
      author: { fid: 456, username: "spammer" },
      reactions: { count: 0 },
      recasts: { count: 0 }
    };
    
    const score = await engagementEvaluator.evaluate(cast);
    expect(score).toBeLessThan(0.3);
  });
  
  it("should consider author reputation", async () => {
    const cast = {
      text: "Interesting thought",
      author: { 
        fid: 789, 
        username: "trusted",
        followerCount: 1000
      }
    };
    
    const score = await engagementEvaluator.evaluate(cast);
    expect(score).toBeGreaterThan(0.5);
  });
});
```

## Integration Tests

### Service Integration

```typescript
// test/integration/service.test.ts
import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { FarcasterService } from "@elizaos/plugin-farcaster";
import { createTestRuntime } from "@elizaos/test-utils";
import { MockHubServer } from "../mocks/hub-server";

describe("Farcaster Service Integration", () => {
  let service: FarcasterService;
  let runtime: any;
  let hubServer: MockHubServer;
  
  beforeAll(async () => {
    hubServer = new MockHubServer();
    await hubServer.start();
    
    runtime = await createTestRuntime();
    service = new FarcasterService();
    await service.start(runtime);
  });
  
  afterAll(async () => {
    await service.stop();
    await hubServer.stop();
  });
  
  it("should connect to hub", async () => {
    expect(service.isConnected()).toBe(true);
  });
  
  it("should post and retrieve casts", async () => {
    const cast = await service.postCast("Integration test");
    expect(cast.hash).toBeDefined();
    
    const retrieved = await service.getCast(cast.hash);
    expect(retrieved.text).toBe("Integration test");
  });
  
  it("should handle reply chains", async () => {
    const original = await service.postCast("Original cast");
    const reply = await service.replyCast(
      "Reply to original",
      original.hash,
      original.fid
    );
    
    expect(reply.parentHash).toBe(original.hash);
    
    const thread = await service.getThread(original.hash);
    expect(thread).toHaveLength(2);
  });
});
```

### Event System Tests

```typescript
// test/integration/events.test.ts
import { describe, it, expect } from "bun:test";
import { createTestRuntime } from "@elizaos/test-utils";
import { farcasterPlugin } from "@elizaos/plugin-farcaster";

describe("Farcaster Event System", () => {
  it("should emit cast events", async () => {
    const runtime = await createTestRuntime({
      plugins: [farcasterPlugin]
    });
    
    let eventFired = false;
    runtime.on("farcaster:cast:new", () => {
      eventFired = true;
    });
    
```