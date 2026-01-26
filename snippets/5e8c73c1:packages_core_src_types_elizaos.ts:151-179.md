# 5e8c73c1:packages_core_src_types_elizaos.ts:151-179

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/elizaos.ts:151-179
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  handleMessage(
    agentId: UUID,
    message: Partial<Memory> & {
      entityId: UUID;
      roomId: UUID;
      content: Content;
      worldId?: UUID;
    },
    options?: HandleMessageOptions
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