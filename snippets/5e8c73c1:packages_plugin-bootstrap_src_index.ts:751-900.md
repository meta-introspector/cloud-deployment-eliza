# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 * @param {string} serverId - The unique identifier for the server.
 * @param {string} channelId - The unique identifier for the channel.
 * @param {ChannelType} type - The type of channel.
 * @param {string} source - The source of the user data.
 * @returns {Promise<void>} A promise that resolves once the user is synced.
 */
const syncSingleUser = async (
  entityId: UUID,
  runtime: IAgentRuntime,
  messageServerId: UUID,
  channelId: string,
  type: ChannelType,
  source: string
) => {
  try {
    const entity = await runtime.getEntityById(entityId);
    runtime.logger.info(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        entityId,
        username: entity?.metadata?.username,
      },
      'Syncing user'
    );

    // Ensure we're not using WORLD type and that we have a valid channelId
    if (!channelId) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap', agentId: runtime.agentId, entityId: entity?.id },
        'Cannot sync user without a valid channelId'
      );
      return;
    }

    const roomId = createUniqueUuid(runtime, channelId);
    const worldId = createUniqueUuid(runtime, messageServerId);

    // Create world with ownership metadata for DM connections (onboarding)
    const worldMetadata =
      type === ChannelType.DM
        ? {
            ownership: {
              ownerId: entityId,
            },
            roles: {
              [entityId]: Role.OWNER,
            },
            settings: {}, // Initialize empty settings for onboarding
          }
        : undefined;

    runtime.logger.info(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        type,
        isDM: type === ChannelType.DM,
        worldMetadata,
      },
      'syncSingleUser'
    );

    await runtime.ensureConnection({
      entityId,
      roomId,
      name: (entity?.metadata?.name || entity?.metadata?.username || `User${entityId}`) as
        | undefined
        | string,
      source,
      channelId,
      messageServerId,
      type,
      worldId,
      metadata: worldMetadata,
    });

    // Verify the world was created with proper metadata
    try {
      const createdWorld = await runtime.getWorld(worldId);
      runtime.logger.info(
        {
          src: 'plugin:bootstrap',
          agentId: runtime.agentId,
          worldId,
          metadata: createdWorld?.metadata,
        },
        'Created world check'
      );
    } catch (error) {
      runtime.logger.error(
        {
          src: 'plugin:bootstrap',
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to verify created world'
      );
    }

    runtime.logger.success(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        agentName: runtime.character.name,
        entityId: entity?.id,
      },
      'Successfully synced user'
    );
  } catch (error) {
    runtime.logger.error(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error syncing user'
    );
  }
};

/**
 * Handles standardized server data for both WORLD_JOINED and WORLD_CONNECTED events
 */
const handleServerSync = async ({
  runtime,
  world,
  rooms,
  entities,
  source,
  onComplete,
}: WorldPayload) => {
  runtime.logger.debug(
    { src: 'plugin:bootstrap', agentId: runtime.agentId, serverName: world.name },
    'Handling server sync event'
  );
  try {
    await runtime.ensureConnections(entities, rooms, source, world);
    runtime.logger.debug(
      { src: 'plugin:bootstrap', agentId: runtime.agentId, worldName: world.name },
      'Successfully synced standardized world structure'
    );
    onComplete?.();
  } catch (error) {
    runtime.logger.error(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
```