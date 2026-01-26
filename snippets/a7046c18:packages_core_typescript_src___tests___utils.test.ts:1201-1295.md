# a7046c18:packages_core_typescript_src___tests___utils.test.ts:1201-1295

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:1201-1295
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    interface SelfReferencingObject {
      a: number;
      self?: SelfReferencingObject;
    }
    const obj: SelfReferencingObject = { a: 1 };
    obj.self = obj;
    const str = JSON.stringify(obj, safeReplacer());
    expect(str).toContain("[Circular]");
  });

  it("validateUuid validates correct uuid and rejects bad values", () => {
    const valid = validateUuid("123e4567-e89b-12d3-a456-426614174000");
    const invalid = validateUuid("not-a-uuid");
    expect(valid).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(invalid).toBeNull();
  });

  it("composePrompt inserts state values", () => {
    //const spy = vi.spyOn(utils, 'composeRandomUser').mockImplementation((t) => t);
    const out = utils.composePrompt({
      state: { a: "x" },
      template: "Hello {{a}}",
    });
    expect(out).toBe("Hello x");
    //spy.mockRestore();
  });

  it("composePromptFromState flattens state values", () => {
    //const spy = vi.spyOn(utils, 'composeRandomUser').mockImplementation((t) => t);
    const out = utils.composePromptFromState({
      state: { values: { b: "y" }, data: {}, text: "", c: "z" },
      template: "{{b}} {{c}}",
    });
    expect(out).toBe("y z");
    //spy.mockRestore();
  });

  it("formatPosts formats conversation text", () => {
    const messages = [
      {
        id: "1",
        entityId: "e1",
        roomId: "r1",
        createdAt: 1,
        content: { text: "hi", source: "chat" },
      },
      {
        id: stringToUuid("2"),
        entityId: stringToUuid("e1"),
        roomId: stringToUuid("r1"),
        createdAt: 2,
        content: { text: "there", source: "chat" },
      },
    ] as Memory[];
    const entities: Entity[] = [
      {
        id: stringToUuid("e1"),
        names: ["Alice"],
        metadata: {},
        agentId: stringToUuid("agent-1"),
      },
    ];
    const result = utils.formatPosts({ messages, entities });
    expect(result).toContain("Conversation:");
    expect(result).toContain("Alice");
    expect(result).toContain("hi");
    expect(result).toContain("there");
  });

  it("trimTokens truncates using runtime tokenizer", async () => {
    const runtime = {
      useModel: mock(
        async (
          type: (typeof ModelType)[keyof typeof ModelType],
          params:
            | TokenizeTextParams
            | DetokenizeTextParams
            | Record<string, unknown>,
        ) => {
          if (type === ModelType.TEXT_TOKENIZER_ENCODE) {
            const encodeParams = params as TokenizeTextParams;
            return encodeParams.prompt.split(" ");
          }
          if (type === ModelType.TEXT_TOKENIZER_DECODE) {
            const decodeParams = params as DetokenizeTextParams;
            return decodeParams.tokens.join(" ");
          }
          return [];
        },
      ),
    } as Partial<IAgentRuntime> as IAgentRuntime;
    const result = await utils.trimTokens("a b c d e", 3, runtime);
    expect(result).toBe("c d e");
  });
});
```