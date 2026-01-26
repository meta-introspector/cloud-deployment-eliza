# 5e8c73c1:packages_core_src_runtime.ts:1651-1800

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1651-1800
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      });
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, worldId: id, messageServerId },
        'World created'
      );
    }
  }

  async ensureRoomExists({
    id,
    name,
    source,
    type,
    channelId,
    messageServerId,
    worldId,
    metadata,
  }: Room) {
    if (!worldId) throw new Error('worldId is required');
    const room = await this.getRoom(id);
    if (!room) {
      await this.createRoom({
        id,
        name,
        agentId: this.agentId,
        source,
        type,
        channelId,
        messageServerId,
        worldId,
        metadata,
      });
      this.logger.debug({ src: 'agent', agentId: this.agentId, channelId: id }, 'Room created');
    }
  }

  async composeState(
    message: Memory,
    includeList: string[] | null = null,
    onlyInclude = false,
    skipCache = false
  ): Promise<State> {
    const filterList = onlyInclude ? includeList : null;
    const emptyObj = {
      values: {},
      data: {},
      text: '',
    } as State;
    const cachedState =
      skipCache || !message.id ? emptyObj : (await this.stateCache.get(message.id)) || emptyObj;
    const providerNames = new Set<string>();
    if (filterList && filterList.length > 0) {
      filterList.forEach((name) => providerNames.add(name));
    } else {
      this.providers
        .filter((p) => !p.private && !p.dynamic)
        .forEach((p) => providerNames.add(p.name));
    }
    if (!filterList && includeList && includeList.length > 0) {
      includeList.forEach((name) => providerNames.add(name));
    }
    const providersToGet = Array.from(
      new Set(this.providers.filter((p) => providerNames.has(p.name)))
    ).sort((a, b) => (a.position || 0) - (b.position || 0));
    const providerData = await Promise.all(
      providersToGet.map(async (provider) => {
        const start = Date.now();
        const result = await provider.get(this as IAgentRuntime, message, cachedState);
        const duration = Date.now() - start;

        // only need to inform if it's taking a long time
        if (duration > 100) {
          this.logger.debug(
            { src: 'agent', agentId: this.agentId, provider: provider.name, duration },
            'Slow provider'
          );
        }
        return {
          ...result,
          providerName: provider.name,
        };
      })
    );
    const currentProviderResults: Record<
      string,
      { text?: string; values?: Record<string, unknown>; providerName: string }
    > = {
      ...((cachedState.data?.providers as Record<
        string,
        { text?: string; values?: Record<string, unknown>; providerName: string }
      >) || {}),
    };
    for (const freshResult of providerData) {
      currentProviderResults[freshResult.providerName] = freshResult;
    }
    const orderedTexts: string[] = [];
    for (const provider of providersToGet) {
      const result = currentProviderResults[provider.name];
      if (result && result.text && typeof result.text === 'string' && result.text.trim() !== '') {
        orderedTexts.push(result.text);
      }
    }
    const providersText = orderedTexts.join('\n');
    const aggregatedStateValues: Record<string, unknown> = { ...(cachedState.values || {}) };
    for (const provider of providersToGet) {
      const providerResult = currentProviderResults[provider.name];
      if (
        providerResult &&
        providerResult.values &&
        typeof providerResult.values === 'object' &&
        providerResult.values !== null
      ) {
        Object.assign(aggregatedStateValues, providerResult.values);
      }
    }
    for (const providerName in currentProviderResults) {
      if (!providersToGet.some((p) => p.name === providerName)) {
        const providerResult = currentProviderResults[providerName];
        if (
          providerResult &&
          providerResult.values &&
          typeof providerResult.values === 'object' &&
          providerResult.values !== null
        ) {
          Object.assign(aggregatedStateValues, providerResult.values);
        }
      }
    }
    const newState = {
      values: {
        ...aggregatedStateValues,
        providers: providersText,
      },
      data: {
        ...(cachedState.data || {}),
        providers: currentProviderResults,
      },
      text: providersText,
    } as State;
    if (message.id) {
      this.stateCache.set(message.id, newState);
    }
    return newState;
  }

  getService<T extends Service = Service>(serviceName: ServiceTypeName | string): T | null {
    const serviceInstances = this.services.get(serviceName as ServiceTypeName);
    if (!serviceInstances || serviceInstances.length === 0) {
      // it's not a warn, a plugin might just not be installed
      this.logger.debug({ src: 'agent', agentId: this.agentId, serviceName }, 'Service not found');
```