# a7046c18:packages_core_typescript_src_types_elizaos.ts:151-179

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/elizaos.ts:151-179
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  handleMessage(
    agentId: UUID,
    message: Partial<Memory> & {
      entityId: UUID;
      roomId: UUID;
      content: Content;
      worldId?: UUID;
    },
    options?: HandleMessageOptions,
  ): Promise<HandleMessageResult>;

  /**
   * Get an agent runtime by ID.
   *
   * Use this to access the runtime instance of a registered agent,
   * allowing direct interaction with agent services, state, and methods.
   *
   * @param agentId - The UUID of the agent
   * @returns The agent runtime instance or undefined if agent not found
   *
   * @example
   * const runtime = elizaOS.getAgent(agentId);
   * if (runtime) {
   *   console.log("Agent character:", runtime.character.name);
   *   await runtime.messageService.handleMessage(...);
   * }
   */
  getAgent(agentId: UUID): IAgentRuntime | undefined;
}
```