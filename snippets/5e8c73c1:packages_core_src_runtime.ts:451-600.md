# 5e8c73c1:packages_core_src_runtime.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      this.logger.debug({ src: 'agent', agentId: this.agentId }, 'Plugin migrations completed');
    }

    // Ensure character has the agent ID set before calling ensureAgentExists
    // We create a new object with the ID to avoid mutating the original character
    const existingAgent = await this.ensureAgentExists({
      ...this.character,
      id: this.agentId,
    } as Partial<Agent>);
    if (!existingAgent) {
      const errorMsg = `Agent ${this.agentId} does not exist in database after ensureAgentExists call`;
      throw new Error(errorMsg);
    }

    // Merge DB-persisted settings back into runtime character
    // This ensures settings from previous runs are available
    if (existingAgent.settings) {
      this.character.settings = {
        ...existingAgent.settings,
        ...this.character.settings, // Character file overrides DB
      };

      // Merge secrets from both character.secrets and settings.secrets
      // getSetting() checks character.secrets first, so we need to merge there too
      const dbSecrets =
        existingAgent.settings.secrets && typeof existingAgent.settings.secrets === 'object'
          ? existingAgent.settings.secrets
          : {};
      const settingsSecrets =
        this.character.settings.secrets && typeof this.character.settings.secrets === 'object'
          ? this.character.settings.secrets
          : {};
      const characterSecrets =
        this.character.secrets && typeof this.character.secrets === 'object'
          ? this.character.secrets
          : {};

      // Merge into both locations that getSetting() checks
      const mergedSecrets = {
        ...dbSecrets,
        ...characterSecrets,
        ...settingsSecrets, // settings.secrets has priority
      };

      if (Object.keys(mergedSecrets).length > 0) {
        const filteredSecrets: Record<string, string | boolean | number> = {};
        for (const [key, value] of Object.entries(mergedSecrets)) {
          if (value !== null && value !== undefined) {
            filteredSecrets[key] = value as string | boolean | number;
          }
        }
        if (Object.keys(filteredSecrets).length > 0) {
          this.character.secrets = filteredSecrets;
          this.character.settings.secrets = filteredSecrets;
        }
      }
    }

    // No need to transform agent's own ID
    let agentEntity = await this.getEntityById(this.agentId);

    if (!agentEntity) {
      const created = await this.createEntity({
        id: this.agentId,
        names: [this.character.name],
        metadata: {},
        agentId: existingAgent.id!,
      });
      if (!created) {
        const errorMsg = `Failed to create entity for agent ${this.agentId}`;
        throw new Error(errorMsg);
      }

      agentEntity = await this.getEntityById(this.agentId);
      if (!agentEntity) throw new Error(`Agent entity not found for ${this.agentId}`);

      this.logger.debug({ src: 'agent', agentId: this.agentId }, 'Agent entity created');
    }

    // Room creation and participant setup
    const room = await this.getRoom(this.agentId);
    if (!room) {
      await this.createRoom({
        id: this.agentId,
        name: this.character.name,
        source: 'elizaos',
        type: ChannelType.SELF,
        channelId: this.agentId,
        messageServerId: this.agentId,
        worldId: this.agentId,
      });
    }
    const participants = await this.adapter.getParticipantsForRoom(this.agentId);
    if (!participants.includes(this.agentId)) {
      const added = await this.addParticipant(this.agentId, this.agentId);
      if (!added) {
        throw new Error(`Failed to add agent ${this.agentId} as participant to its own room`);
      }
      this.logger.debug({ src: 'agent', agentId: this.agentId }, 'Agent linked to room');
    }

    const embeddingModel = this.getModel(ModelType.TEXT_EMBEDDING);
    if (!embeddingModel) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId },
        'No TEXT_EMBEDDING model registered, skipping embedding setup'
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
        { src: 'agent', agentId: this.agentId },
        'Database adapter not found, skipping plugin migrations'
      );
      return;
    }

    if (typeof this.adapter.runPluginMigrations !== 'function') {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId },
        'Database adapter does not support plugin migrations'
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
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null ||
            (typeof value === 'object' && value !== null && !Array.isArray(value))
```