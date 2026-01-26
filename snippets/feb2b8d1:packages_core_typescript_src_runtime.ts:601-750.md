# feb2b8d1:packages_core_typescript_src_runtime.ts:601-750

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:601-750
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
        "Agent linked to room",
      );
    }

    const embeddingModel = this.getModel(ModelType.TEXT_EMBEDDING);
    if (!embeddingModel) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId },
        "No TEXT_EMBEDDING model registered, skipping embedding setup",
      );
    } else {
      await this.ensureEmbeddingDimension();
    }

    // Resolve init promise to allow services to start
    if (this.initResolver) {
      this.initResolver();
      this.initResolver = undefined;
    }
  }

  async runPluginMigrations(): Promise<void> {
    if (!this.adapter) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId },
        "Database adapter not found, skipping plugin migrations",
      );
      return;
    }

    if (typeof this.adapter.runPluginMigrations !== "function") {
      this.logger.warn(
        { src: "agent", agentId: this.agentId },
        "Database adapter does not support plugin migrations",
      );
      return;
    }

    const pluginsWithSchemas = this.plugins
      .filter((p) => p.schema)
      .map((p) => {
        const schema = p.schema || {};
        const normalizedSchema: Record<
          string,
          string | number | boolean | Record<string, unknown> | null
        > = {};
        for (const [key, value] of Object.entries(schema)) {
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            value === null ||
            (typeof value === "object" &&
              value !== null &&
              !Array.isArray(value))
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
        { src: "agent", agentId: this.agentId },
        "No plugins with schemas, skipping migrations",
      );
      return;
    }

    this.logger.debug(
      { src: "agent", agentId: this.agentId, count: pluginsWithSchemas.length },
      "Found plugins with schemas",
    );

    const isProduction = process.env.NODE_ENV === "production";
    const forceDestructive =
      process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS === "true";

    await this.adapter.runPluginMigrations(pluginsWithSchemas, {
      verbose: !isProduction,
      force: forceDestructive,
      dryRun: false,
    });

    this.logger.debug(
      { src: "agent", agentId: this.agentId },
      "Plugin migrations completed",
    );
  }

  async getConnection(): Promise<unknown> {
    // Updated return type
    if (!this.adapter) {
      throw new Error("Database adapter not registered");
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
        this.character.settings[key] = value as
          | string
          | number
          | boolean
          | Record<string, unknown>;
      }
    }
  }

  getSetting(key: string): string | boolean | number | null {
    const settings = this.character.settings;
    const secrets = this.character.secrets;
    const nestedSecrets =
      typeof settings === "object" &&
      settings !== null &&
      "secrets" in settings &&
      typeof settings.secrets === "object" &&
      settings.secrets !== null
        ? (settings.secrets as Record<string, string | undefined>)
        : undefined;

    const value =
      (secrets && secrets[key]) ||
      (settings && settings[key]) ||
      (nestedSecrets && nestedSecrets[key]) ||
      this.settings[key];

    // Handle each type appropriately
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === "number") {
```