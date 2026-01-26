# 5e8c73c1:packages_core_src_runtime.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          ) {
            normalizedSchema[key] = value as
              | string
              | number
              | boolean
              | Record<string, unknown>
              | null;
          }
        }
        return { name: p.name, schema: normalizedSchema };
      });

    if (pluginsWithSchemas.length === 0) {
      this.logger.debug(
        { src: 'agent', agentId: this.agentId },
        'No plugins with schemas, skipping migrations'
      );
      return;
    }

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
```