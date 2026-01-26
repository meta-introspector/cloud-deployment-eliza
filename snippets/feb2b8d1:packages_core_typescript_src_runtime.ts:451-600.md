# feb2b8d1:packages_core_typescript_src_runtime.ts:451-600

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:451-600
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
    }
    await Promise.all(pluginRegistrationPromises);

    if (!this.adapter) {
      this.logger.error(
        { src: "agent", agentId: this.agentId },
        "Database adapter not initialized",
      );
      throw new Error(
        "Database adapter not initialized. The SQL plugin (@elizaos/plugin-sql) is required for agent initialization. Please ensure it is included in your character configuration.",
      );
    }

    // Make adapter init idempotent - check if already initialized
    if (!(await this.adapter.isReady())) {
      await this.adapter.init();
    }

    // Initialize message service
    this.messageService = new DefaultMessageService();

    // Run migrations for all loaded plugins (unless explicitly skipped for serverless mode)
    const skipMigrations = (options && options.skipMigrations) ?? false;
    if (skipMigrations) {
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "Skipping plugin migrations",
      );
    } else {
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "Running plugin migrations",
      );
      await this.runPluginMigrations();
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "Plugin migrations completed",
      );
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
        existingAgent.settings.secrets &&
        typeof existingAgent.settings.secrets === "object"
          ? existingAgent.settings.secrets
          : {};
      const settingsSecrets =
        this.character.settings.secrets &&
        typeof this.character.settings.secrets === "object"
          ? this.character.settings.secrets
          : {};
      const characterSecrets =
        this.character.secrets && typeof this.character.secrets === "object"
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
      if (!existingAgent.id) {
        throw new Error(`Agent ${this.agentId} has no ID`);
      }
      const created = await this.createEntity({
        id: this.agentId,
        names: [this.character.name],
        metadata: {},
        agentId: existingAgent.id,
      });
      if (!created) {
        const errorMsg = `Failed to create entity for agent ${this.agentId}`;
        throw new Error(errorMsg);
      }

      agentEntity = await this.getEntityById(this.agentId);
      if (!agentEntity)
        throw new Error(`Agent entity not found for ${this.agentId}`);

      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "Agent entity created",
      );
    }

    // Room creation and participant setup
    const room = await this.getRoom(this.agentId);
    if (!room) {
      await this.createRoom({
        id: this.agentId,
        name: this.character.name,
        source: "elizaos",
        type: ChannelType.SELF,
        channelId: this.agentId,
        messageServerId: this.agentId,
        worldId: this.agentId,
      });
    }
    const participants = await this.adapter.getParticipantsForRoom(
      this.agentId,
    );
    if (!participants.includes(this.agentId)) {
      const added = await this.addParticipant(this.agentId, this.agentId);
      if (!added) {
        throw new Error(
          `Failed to add agent ${this.agentId} as participant to its own room`,
        );
      }
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
```