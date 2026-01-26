# a7046c18:packages_ts-plugin-starter_src___tests___plugin.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/plugin.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const helloMessages = [
      "hello",
      "hi there",
      "hey!",
      "greetings",
      "howdy partner",
    ];
    for (const text of helloMessages) {
      const message = createTestMemory({
        content: { text, source: "test" },
      });
      const isValid = await helloWorldAction.validate(runtime, message);
      expect(isValid).toBe(true);
    }

    // Test that it accepts all messages (simple implementation)
    const nonHelloMessages = [
      "goodbye",
      "what is the weather",
      "tell me a joke",
      "",
    ];
    for (const text of nonHelloMessages) {
      const message = createTestMemory({
        content: { text, source: "test" },
      });
      const isValid = await helloWorldAction.validate(runtime, message);
      expect(isValid).toBe(true);
    }
  });

  it("should handle hello world action with callback", async () => {
    if (!helloWorldAction?.handler) {
      throw new Error("Hello world action handler not found");
    }

    const message = createTestMemory({
      content: { text: "say hello", source: "test" },
    });

    let callbackContent: any = null;
    const callback: HandlerCallback = async (content: Content) => {
      callbackContent = content;
      return [];
    };

    const result = await helloWorldAction.handler(
      runtime,
      message,
      undefined,
      undefined,
      callback,
    );

    // The action returns a simple greeting
    expect(result).toHaveProperty("text", "Hello world!");
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("data");
    expect((result as ActionResult).data).toHaveProperty("actions", [
      "HELLO_WORLD",
    ]);
    expect((result as ActionResult).data).toHaveProperty("source", "test");

    // Callback should receive the same greeting
    expect(callbackContent).toBeDefined();
    expect(callbackContent.text).toBe("Hello world!");
    expect(callbackContent.actions).toEqual(["HELLO_WORLD"]);
    expect(callbackContent.source).toBe("test");
  });

  it("should handle errors gracefully", async () => {
    if (!helloWorldAction?.handler) {
      throw new Error("Hello world action handler not found");
    }

    const message = createTestMemory({
      content: { text: "say hello", source: "test" },
    });

    const errorCallback: HandlerCallback = async () => {
      throw new Error("Callback error");
    };

    const result = await helloWorldAction.handler(
      runtime,
      message,
      undefined,
      undefined,
      errorCallback,
    );

    expect(result).toHaveProperty("success", false);
    expect(result).toHaveProperty("error");
    expect((result as ActionResult).error).toBeInstanceOf(Error);
    expect(
      (result as ActionResult).error instanceof Error
        ? (result as ActionResult).error.message
        : String((result as ActionResult).error),
    ).toBe("Callback error");
    // Logger is mocked but not set up as a spy in runtime
    expect(logger.error).toHaveBeenCalled();
  });

  it("should handle missing callback gracefully", async () => {
    if (!helloWorldAction?.handler) {
      throw new Error("Hello world action handler not found");
    }

    const message = createTestMemory({
      content: { text: "say hello", source: "test" },
    });

    const result = await helloWorldAction.handler(
      runtime,
      message,
      undefined,
      undefined,
      undefined,
    );

    // The action returns a simple greeting
    expect(result).toHaveProperty("text", "Hello world!");
    expect(result).toHaveProperty("success", true);
  });

  it("should handle state parameter correctly", async () => {
    if (!helloWorldAction?.handler) {
      throw new Error("Hello world action handler not found");
    }

    const message = createTestMemory({
      content: { text: "say hello", source: "test" },
    });

    const state = createTestState({
      values: { customValue: "test-state" },
    });

    const result = await helloWorldAction.handler(
      runtime,
      message,
      state,
      undefined,
      undefined,
    );

    expect(result).toHaveProperty("success", true);
  });
});

```