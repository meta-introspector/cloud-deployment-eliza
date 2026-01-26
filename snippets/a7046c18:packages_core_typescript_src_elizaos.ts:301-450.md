# a7046c18:packages_core_typescript_src_elizaos.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/elizaos.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      new CustomEvent("agents:deleted", {
        detail: { agentIds, count: agentIds.length },
      }),
    );
  }

  /**
   * Start multiple agents
   */
  async startAgents(agentIds?: UUID[]): Promise<void> {
    const ids = agentIds || Array.from(this.runtimes.keys());

    await Promise.all(
      ids.map(async (id) => {
        const runtime = this.runtimes.get(id);
        if (!runtime) {
          throw new Error(`Agent ${id} not found`);
        }
        await runtime.initialize();

        this.dispatchEvent(
          new CustomEvent("agent:started", {
            detail: { agentId: id },
          }),
        );
      }),
    );

    for (const id of ids) {
      const initFn = this.initFunctions.get(id);
      if (initFn) {
        const runtime = this.runtimes.get(id);
        if (runtime) {
          await initFn(runtime);
          this.initFunctions.delete(id);
        }
      }
    }

    this.dispatchEvent(
      new CustomEvent("agents:started", {
        detail: { agentIds: ids, count: ids.length },
      }),
    );
  }

  /**
   * Stop agents
   */
  async stopAgents(agentIds?: UUID[]): Promise<void> {
    const ids = agentIds || Array.from(this.runtimes.keys());

    await Promise.all(
      ids.map(async (id) => {
        const runtime = this.runtimes.get(id);
        if (runtime) {
          await runtime.stop();
        }
      }),
    );

    this.dispatchEvent(
      new CustomEvent("agents:stopped", {
        detail: { agentIds: ids, count: ids.length },
      }),
    );
  }

  /**
   * Get a single agent
   */
  getAgent(id: UUID): IAgentRuntime | undefined {
    return this.runtimes.get(id);
  }

  /**
   * Get all agents
   */
  getAgents(): IAgentRuntime[] {
    return Array.from(this.runtimes.values());
  }

  /**
   * Get agents by IDs
   */
  getAgentsByIds(ids: UUID[]): IAgentRuntime[] {
    return ids
      .map((id) => this.runtimes.get(id))
      .filter((runtime): runtime is IAgentRuntime => runtime !== undefined);
  }

  /**
   * Get agents by names
   */
  getAgentsByNames(names: string[]): IAgentRuntime[] {
    const nameSet = new Set(names.map((n) => n.toLowerCase()));
    return this.getAgents().filter((runtime) =>
      nameSet.has(runtime.character.name.toLowerCase()),
    );
  }

  /**
   * Get agent by ID (alias for getAgent for consistency)
   */
  getAgentById(id: UUID): IAgentRuntime | undefined {
    return this.getAgent(id);
  }

  /**
   * Get agent by name
   */
  getAgentByName(name: string): IAgentRuntime | undefined {
    const lowercaseName = name.toLowerCase();
    return this.getAgents().find(
      (runtime) => runtime.character.name.toLowerCase() === lowercaseName,
    );
  }

  /**
   * Get agent by character name (alias for getAgentByName)
   */
  getAgentByCharacterName(name: string): IAgentRuntime | undefined {
    return this.getAgentByName(name);
  }

  /**
   * Get agent by character ID
   */
  getAgentByCharacterId(characterId: UUID): IAgentRuntime | undefined {
    return this.getAgents().find(
      (runtime) => runtime.character.id === characterId,
    );
  }

  /**
   * Send a message to a specific agent
   *
   * @param target - The agent ID (UUID) or runtime instance to send the message to
   * @param message - Partial Memory object (missing fields auto-filled)
   * @param options - Optional callbacks and processing options
   * @returns Promise with message ID and result
   *
   * @example
   * // SYNC mode with agent ID (HTTP API)
   * const result = await elizaOS.handleMessage(agentId, {
   *   entityId: user.id,
   *   roomId: room.id,
   *   content: { text: "Hello", source: 'web' }
   * });
   *
```