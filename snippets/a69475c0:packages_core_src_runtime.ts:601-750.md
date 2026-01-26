# a69475c0:packages_core_src_runtime.ts:601-750

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:601-750
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, count: pluginsWithSchemas.length },
      'Found plugins with schemas'
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const forceDestructive = process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS === 'true';

    await this.adapter.runPluginMigrations(pluginsWithSchemas, {
      verbose: !isProduction,
      force: forceDestructive,
      dryRun: false,
    });

    this.logger.debug({ src: 'agent', agentId: this.agentId }, 'Plugin migrations completed');
  }

  async getConnection(): Promise<unknown> {
    // Updated return type
    if (!this.adapter) {
      throw new Error('Database adapter not registered');
    }
    return this.adapter.getConnection();
  }

  setSetting(key: string, value: string | boolean | null, secret = false) {
    if (secret) {
      if (!this.character.secrets) {
        this.character.secrets = {};
      }
      if (value !== null && value !== undefined) {
        this.character.secrets[key] = value as string | boolean | number;
      }
    } else {
      if (!this.character.settings) {
        this.character.settings = {};
      }
      if (value !== null && value !== undefined) {
        this.character.settings[key] = value as string | number | boolean | Record<string, unknown>;
      }
    }
  }

  getSetting(key: string): string | boolean | number | null {
    const settings = this.character.settings;
    const secrets = this.character.secrets;
    const nestedSecrets =
      typeof settings === 'object' &&
        settings !== null &&
        'secrets' in settings &&
        typeof settings.secrets === 'object' &&
        settings.secrets !== null
        ? (settings.secrets as Record<string, string | undefined>)
        : undefined;

    const value = secrets?.[key] || settings?.[key] || nestedSecrets?.[key] || this.settings[key];

    // Handle each type appropriately
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      // Only decrypt string values
      const decrypted = decryptSecret(value, getSalt());
      if (decrypted === 'true') return true;
      if (decrypted === 'false') return false;
      return decrypted;
    }

    return null;
  }

  getConversationLength() {
    return this.#conversationLength;
  }

  registerDatabaseAdapter(adapter: IDatabaseAdapter) {
    if (this.adapter) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId },
        'Database adapter already registered, ignoring'
      );
    } else {
      this.adapter = adapter;
      this.logger.debug({ src: 'agent', agentId: this.agentId }, 'Database adapter registered');
    }
  }

  registerProvider(provider: Provider) {
    this.providers.push(provider);
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, provider: provider.name },
      'Provider registered'
    );
  }

  registerAction(action: Action) {
    if (this.actions.find((a) => a.name === action.name)) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, action: action.name },
        'Action already registered, skipping'
      );
    } else {
      this.actions.push(action);
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, action: action.name },
        'Action registered'
      );
    }
  }

  registerEvaluator(evaluator: Evaluator) {
    this.evaluators.push(evaluator);
  }

  // Helper functions for immutable action plan updates
  private updateActionPlan<T>(plan: T, updates: Partial<T>): T {
    return { ...plan, ...updates };
  }

  private updateActionStep<T, S>(
    plan: T & { steps: S[] },
    index: number,
    stepUpdates: Partial<S>
  ): T & { steps: S[] } {
    // Add bounds checking
    if (!plan.steps || index < 0 || index >= plan.steps.length) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, index, stepsCount: plan.steps?.length || 0 },
        'Invalid step index'
      );
      return plan;
    }
    return {
      ...plan,
      steps: plan.steps.map((step: S, i: number) =>
        i === index ? { ...step, ...stepUpdates } : step
      ),
    };
  }

```