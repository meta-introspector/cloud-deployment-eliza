# 5e8c73c1:packages_core_src_entities.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/entities.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  runtime: IAgentRuntime,
  message: Memory,
  state: State
): Promise<Entity | null> {
  const room = state.data.room ?? (await runtime.getRoom(message.roomId));
  if (!room) {
    logger.warn(
      { src: 'core:entities', roomId: message.roomId },
      'Room not found for entity search'
    );
    return null;
  }

  const world: World | null = room.worldId ? await runtime.getWorld(room.worldId) : null;

  // Get all entities in the room with their components
  const entitiesInRoom = await runtime.getEntitiesForRoom(room.id, true);

  // Filter components for each entity based on permissions
  const filteredEntities = await Promise.all(
    entitiesInRoom.map(async (entity) => {
      if (!entity.components) return entity;

      // Get world roles if we have a world
      const worldRoles = world?.metadata?.roles || {};

      // Filter components based on permissions
      entity.components = entity.components.filter((component) => {
        // 1. Pass if sourceEntityId matches the requesting entity
        if (component.sourceEntityId === message.entityId) return true;

        // 2. Pass if sourceEntityId is an owner/admin of the current world
        if (world && component.sourceEntityId) {
          const sourceRole = worldRoles[component.sourceEntityId];
          if (sourceRole === 'OWNER' || sourceRole === 'ADMIN') return true;
        }

        // 3. Pass if sourceEntityId is the agentId
        if (component.sourceEntityId === runtime.agentId) return true;

        // Filter out components that don't meet any criteria
        return false;
      });

      return entity;
    })
  );

  // Get relationships for the message sender
  const relationships = await runtime.getRelationships({
    entityId: message.entityId,
  });

  // Get entities from relationships
  const relationshipEntities = await Promise.all(
    relationships.map(async (rel) => {
      const entityId =
        rel.sourceEntityId === message.entityId ? rel.targetEntityId : rel.sourceEntityId;
      return runtime.getEntityById(entityId);
    })
  );

  // Filter out nulls and combine with room entities
  const allEntities = [
    ...filteredEntities,
    ...relationshipEntities.filter((e): e is Entity => e !== null),
  ];

  // Get interaction strength data for relationship entities
  const interactionData = await getRecentInteractions(
    runtime,
    message.entityId,
    allEntities,
    room.id as UUID,
    relationships
  );

  // Compose context for LLM
  const prompt = composePrompt({
    state: {
      roomName: (room.name || room.id) as string,
      worldName: (world?.name || 'Unknown') as string,
      entitiesInRoom: JSON.stringify(filteredEntities, null, 2),
      entityId: message.entityId,
      senderId: message.entityId,
    },
    template: entityResolutionTemplate,
  });

  // Use LLM to analyze and resolve the entity
  const result = await runtime.useModel(ModelType.TEXT_SMALL, {
    prompt,
    stopSequences: [],
  });

  // Parse LLM response
  const resolution = parseKeyValueXml(result);
  if (!resolution) {
    logger.warn({ src: 'core:entities' }, 'Failed to parse entity resolution result');
    return null;
  }

  // If we got an exact entity ID match
  if (resolution.type === 'EXACT_MATCH' && resolution.entityId) {
    const entity = await runtime.getEntityById(resolution.entityId as UUID);
    if (entity) {
      // Filter components again for the returned entity
      if (entity.components) {
        const worldRoles = world?.metadata?.roles || {};
        entity.components = entity.components.filter((component) => {
          if (component.sourceEntityId === message.entityId) return true;
          if (world && component.sourceEntityId) {
            const sourceRole = worldRoles[component.sourceEntityId];
            if (sourceRole === 'OWNER' || sourceRole === 'ADMIN') return true;
          }
          if (component.sourceEntityId === runtime.agentId) return true;
          return false;
        });
      }
      return entity;
    }
  }

  // For username/name/relationship matches, search through all entities
  // Handle matches - parseKeyValueXml returns nested structures differently
  let matchesArray: EntityMatch[] = [];
  const parsedResolution = resolution as ParsedResolution;
  if (parsedResolution.matches?.match) {
    // Normalize to array
    const matchValue = parsedResolution.matches.match;
    matchesArray = Array.isArray(matchValue) ? matchValue : [matchValue];
  }

  if (matchesArray.length > 0 && matchesArray[0]?.name) {
    const matchName = matchesArray[0].name.toLowerCase();

    // Find matching entity by username/handle in components or by name
    const matchingEntity = allEntities.find((entity) => {
      // Check names
      if (entity.names.some((n) => n.toLowerCase() === matchName)) return true;

      // Check components for username/handle match
      return entity.components?.some(
        (c) =>
          (c.data.username as string)?.toLowerCase() === matchName ||
          (c.data.handle as string)?.toLowerCase() === matchName
      );
    });

    if (matchingEntity) {
```