# a7046c18:packages_core_typescript_src_elizaos.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/elizaos.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        processingOptions,
      );
      if (!messagePromise) {
        throw new Error("Message service not available");
      }
      const processing =
        await handleMessageWithEntityContext<MessageProcessingResult>(
          () => messagePromise,
        );

      if (options?.onComplete) await options.onComplete();

      // Emit event for tracking
      this.dispatchEvent(
        new CustomEvent("message:sent", {
          detail: { agentId, messageId, mode: "sync", processing },
        }),
      );

      return { messageId, userMessage, processing };
    }
  }

  /**
   * Handle messages to multiple agents in parallel
   *
   * Useful for batch operations where you need to send messages to multiple agents at once.
   * All messages are handled in parallel for maximum performance.
   *
   * @param messages - Array of messages to handle, each with agentId and message data
   * @returns Promise with array of results, one per message
   *
   * @example
   * const results = await elizaOS.handleMessages([
   *   {
   *     agentId: agent1Id,
   *     message: {
   *       entityId: user.id,
   *       roomId: room.id,
   *       content: { text: "Hello Agent 1", source: "web" }
   *     }
   *   },
   *   {
   *     agentId: agent2Id,
   *     message: {
   *       entityId: user.id,
   *       roomId: room.id,
   *       content: { text: "Hello Agent 2", source: "web" }
   *     },
   *     options: {
   *       onResponse: async (response) => {
   *         console.log("Agent 2 responded:", response.text);
   *       }
   *     }
   *   }
   * ]);
   */
  async handleMessages(
    messages: Array<{
      agentId: UUID;
      message: Partial<Memory> & {
        entityId: UUID;
        roomId: UUID;
        content: Content;
        worldId?: UUID;
      };
      options?: HandleMessageOptions;
    }>,
  ): Promise<
    Array<{ agentId: UUID; result: HandleMessageResult; error?: Error }>
  > {
    const results = await Promise.all(
      messages.map(async ({ agentId, message, options }) => {
        try {
          const result = await this.handleMessage(agentId, message, options);
          return { agentId, result };
        } catch (error) {
          return {
            agentId,
            result: {
              messageId: (message.id || "") as UUID,
              userMessage: message as Memory,
            },
            error: error instanceof Error ? error : new Error(String(error)),
          };
        }
      }),
    );

    this.dispatchEvent(
      new CustomEvent("messages:sent", {
        detail: { results, count: messages.length },
      }),
    );

    return results;
  }

  /**
   * Validate API keys for agents
   */
  async validateApiKeys(agents?: UUID[]): Promise<Map<UUID, boolean>> {
    const results = new Map<UUID, boolean>();
    const ids = agents || Array.from(this.runtimes.keys());

    for (const id of ids) {
      const runtime = this.runtimes.get(id);
      if (runtime) {
        // Check if runtime has required API keys
        const hasKeys = !!(
          runtime.getSetting("OPENAI_API_KEY") ||
          runtime.getSetting("ANTHROPIC_API_KEY")
        );
        results.set(id, hasKeys);
      }
    }

    return results;
  }

  /**
   * Health check for agents
   */
  async healthCheck(agents?: UUID[]): Promise<Map<UUID, HealthStatus>> {
    const results = new Map<UUID, HealthStatus>();
    const ids = agents || Array.from(this.runtimes.keys());

    for (const id of ids) {
      const runtime = this.runtimes.get(id);
      const status: HealthStatus = {
        alive: !!runtime,
        responsive: true,
      };

      // Add memory and uptime info if available (Node.js only)
      if (typeof process !== "undefined") {
        status.memoryUsage = process.memoryUsage().heapUsed;
        status.uptime = process.uptime();
      }

      results.set(id, status);
    }

    return results;
  }

  /**
   * Get a read-only runtime accessor
   */
  getRuntimeAccessor(): ReadonlyRuntime {
```