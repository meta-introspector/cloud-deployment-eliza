# a7046c18:packages_ts-plugin-starter_src___tests___plugin.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/plugin.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      runtime,
    );

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("API Routes", () => {
  let runtime: IAgentRuntime;

  beforeEach(() => {
    runtime = createMockRuntime();
  });

  it("should handle hello world route", async () => {
    const helloRoute = starterPlugin.routes?.find(
      (r) => r.name === "hello-world-route",
    );
    if (!helloRoute?.handler) {
      throw new Error("Hello world route handler not found");
    }

    const mockRes = {
      json: (data: any) => {
        mockRes._jsonData = data;
      },
      _jsonData: null,
    };

    await helloRoute.handler({}, mockRes, runtime);

    expect(mockRes._jsonData).toBeDefined();
    expect(mockRes._jsonData.message).toBe("Hello World!");
  });

  it("should validate route configuration", () => {
    const helloRoute = starterPlugin.routes?.find(
      (r) => r.name === "hello-world-route",
    );

    expect(helloRoute).toBeDefined();
    expect(helloRoute?.path).toBe("/helloworld");
    expect(helloRoute?.type).toBe("GET");
    // Routes don't have a public property in the current implementation
    expect(helloRoute?.handler).toBeDefined();
  });

  it("should handle request with query parameters", async () => {
    const helloRoute = starterPlugin.routes?.find(
      (r) => r.name === "hello-world-route",
    );
    if (!helloRoute?.handler) {
      throw new Error("Hello world route handler not found");
    }

    const mockReq = {
      query: {
        name: "Test User",
      },
    };

    const mockRes = {
      json: (data: any) => {
        mockRes._jsonData = data;
      },
      _jsonData: null,
    };

    await helloRoute.handler(mockReq, mockRes, runtime);

    expect(mockRes._jsonData).toBeDefined();
    expect(mockRes._jsonData.message).toBe("Hello World!");
  });
});

describe("Event Handlers", () => {
  beforeEach(() => {
    // Clear logger spy calls
    // Note: logger methods are mocked in test setup, but bun:test doesn't expose .calls directly
    // These assignments are for compatibility with test setup
    if ("calls" in logger.debug) {
      (logger.debug as Mock).mockClear();
    }
    if ("calls" in logger.info) {
      (logger.info as Mock).mockClear();
    }
    if ("calls" in logger.error) {
      (logger.error as Mock).mockClear();
    }
  });

  it("should log when MESSAGE_RECEIVED event is triggered", async () => {
    const handler = starterPlugin.events?.[EventType.MESSAGE_RECEIVED]?.[0];
    if (!handler) {
      throw new Error("MESSAGE_RECEIVED event handler not found");
    }

    const payload = testFixtures.messagePayload();
    await handler(payload);

    expect(logger.debug).toHaveBeenCalled();
  });

  it("should handle malformed event payload", async () => {
    const handler = starterPlugin.events?.[EventType.MESSAGE_RECEIVED]?.[0];
    if (!handler) {
      throw new Error("MESSAGE_RECEIVED event handler not found");
    }

    const malformedPayload = {
      // Missing required fields
      runtime: createMockRuntime(),
    };

    // Should not throw
    // Handler doesn't actually use the payload, just logs
    await handler(malformedPayload as unknown as MessagePayload);
  });

  it("should handle event with empty message content", async () => {
    const handler = starterPlugin.events?.[EventType.MESSAGE_RECEIVED]?.[0];
    if (!handler) {
      throw new Error("MESSAGE_RECEIVED event handler not found");
    }

    const payload = testFixtures.messagePayload({
      content: {},
    });

    await handler(payload);
    expect(logger.debug).toHaveBeenCalled();
  });
});

describe("StarterService", () => {
  let runtime: IAgentRuntime;

  beforeEach(() => {
    runtime = createMockRuntime();
    // Clear logger spy calls
    if ("calls" in logger.info) {
      (logger.info as Mock).mockClear();
    }
    if ("calls" in logger.error) {
      (logger.error as Mock).mockClear();
    }
  });

  it("should start the service", async () => {
```