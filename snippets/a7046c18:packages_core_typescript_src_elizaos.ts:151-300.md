# a7046c18:packages_core_typescript_src_elizaos.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/elizaos.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        ? await resolvePlugins(agent.plugins, options?.isTestMode || false)
        : [];

      // Filter out plugin-sql if databaseAdapter is provided
      if (agent.databaseAdapter) {
        resolvedPlugins = resolvedPlugins.filter(
          (p) => p.name !== "@elizaos/plugin-sql",
        );
      }

      const runtime = new AgentRuntime({
        character,
        plugins: resolvedPlugins,
        settings: agent.settings || {},
      });

      // Register pre-initialized database adapter if provided
      if (agent.databaseAdapter) {
        (runtime as IAgentRuntime).registerDatabaseAdapter(
          agent.databaseAdapter,
        );
      }

      runtime.elizaOS = this;

      // Only store in registry if not ephemeral
      if (!options?.ephemeral) {
        this.runtimes.set(runtime.agentId, runtime);
      }

      if (typeof agent.init === "function") {
        this.initFunctions.set(runtime.agentId, agent.init);
      }

      const { settings, ...characterWithoutSecrets } = character;
      const { secrets, ...settingsWithoutSecrets } = settings || {};

      this.dispatchEvent(
        new CustomEvent("agent:added", {
          detail: {
            agentId: runtime.agentId,
            character: {
              ...characterWithoutSecrets,
              settings: settingsWithoutSecrets,
            },
            ephemeral: options?.ephemeral,
          },
        }),
      );

      createdRuntimes.push(runtime);
      return runtime.agentId;
    });

    const ids = await Promise.all(promises);

    // Auto-start if requested (useful for serverless)
    if (options?.autoStart) {
      await Promise.all(
        createdRuntimes.map(async (runtime) => {
          await runtime.initialize({ skipMigrations: options?.skipMigrations });

          // Run init function if provided
          const initFn = this.initFunctions.get(runtime.agentId);
          if (initFn) {
            await initFn(runtime);
            this.initFunctions.delete(runtime.agentId);
          }

          this.dispatchEvent(
            new CustomEvent("agent:started", {
              detail: { agentId: runtime.agentId },
            }),
          );
        }),
      );
    }

    this.dispatchEvent(
      new CustomEvent("agents:added", {
        detail: {
          agentIds: ids,
          count: ids.length,
          ephemeral: options?.ephemeral,
        },
      }),
    );

    // Return runtimes directly if requested (serverless pattern)
    if (options?.returnRuntimes) {
      return createdRuntimes;
    }

    return ids;
  }

  /**
   * Register an existing runtime
   */
  registerAgent(runtime: IAgentRuntime): void {
    if (this.runtimes.has(runtime.agentId)) {
      throw new Error(`Agent ${runtime.agentId} already registered`);
    }

    runtime.elizaOS = this;

    this.runtimes.set(runtime.agentId, runtime);

    this.dispatchEvent(
      new CustomEvent("agent:registered", {
        detail: { agentId: runtime.agentId, runtime },
      }),
    );
  }

  /**
   * Update an agent's character
   */
  async updateAgent(agentId: UUID, updates: Partial<Character>): Promise<void> {
    if (!this.editableMode) {
      throw new Error("Editable mode not enabled");
    }

    const runtime = this.runtimes.get(agentId);
    if (!runtime) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Update character properties
    Object.assign(runtime.character, updates);

    this.dispatchEvent(
      new CustomEvent("agent:updated", {
        detail: { agentId, updates },
      }),
    );
  }

  /**
   * Delete agents
   */
  async deleteAgents(agentIds: UUID[]): Promise<void> {
    await this.stopAgents(agentIds);

    for (const id of agentIds) {
      this.runtimes.delete(id);
      this.initFunctions.delete(id);
    }

    this.dispatchEvent(
```