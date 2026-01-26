# 5e8c73c1:packages_core_src_entities.ts:301-426

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/entities.ts:301-426
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // If this is a relationship match, sort by interaction strength
      if (resolution.type === 'RELATIONSHIP_MATCH') {
        const interactionInfo = interactionData.find((d) => d.entity.id === matchingEntity.id);
        if (interactionInfo && interactionInfo.count > 0) {
          return matchingEntity;
        }
      } else {
        return matchingEntity;
      }
    }
  }

  return null;
}

/**
 * Function to create a unique UUID based on the runtime and base user ID.
 *
 * @param {RuntimeContext} runtime - The runtime context object.
 * @param {UUID|string} baseUserId - The base user ID to use in generating the UUID.
 * @returns {UUID} - The unique UUID generated based on the runtime and base user ID.
 */
export const createUniqueUuid = (runtime: IAgentRuntime, baseUserId: UUID | string): UUID => {
  // If the base user ID is the agent ID, return it directly
  if (baseUserId === runtime.agentId) {
    return runtime.agentId;
  }

  // Use a deterministic approach to generate a new UUID based on both IDs
  // This creates a unique ID for each user+agent combination while still being deterministic
  const combinedString = `${baseUserId}:${runtime.agentId}`;

  // Create a namespace UUID (version 5) from the combined string
  return stringToUuid(combinedString);
};

/**
 * Retrieves entity details for a specific room from the database.
 *
 * @param {Object} params - The input parameters
 * @param {IAgentRuntime} params.runtime - The Agent Runtime instance
 * @param {UUID} params.roomId - The ID of the room to retrieve entity details for
 * @returns {Promise<Array>} - A promise that resolves to an array of unique entity details
 */
export async function getEntityDetails({
  runtime,
  roomId,
}: {
  runtime: IAgentRuntime;
  roomId: UUID;
}) {
  // Parallelize the two async operations
  const [room, roomEntities] = await Promise.all([
    runtime.getRoom(roomId),
    runtime.getEntitiesForRoom(roomId, true),
  ]);

  // Use a Map for uniqueness checking while processing entities
  const uniqueEntities = new Map();

  // Process entities in a single pass
  for (const entity of roomEntities) {
    if (uniqueEntities.has(entity.id)) continue;

    // Merge component data more efficiently
    const allData = {};
    for (const component of entity.components || []) {
      Object.assign(allData, component.data);
    }

    // Process merged data
    const mergedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(allData)) {
      if (!mergedData[key]) {
        mergedData[key] = value;
        continue;
      }

      if (Array.isArray(mergedData[key]) && Array.isArray(value)) {
        // Use Set for deduplication in arrays
        mergedData[key] = [...new Set([...mergedData[key], ...value])];
      } else if (typeof mergedData[key] === 'object' && typeof value === 'object') {
        mergedData[key] = { ...mergedData[key], ...value };
      }
    }

    // Create the entity details
    // Helper to safely extract name from metadata
    const getEntityNameFromMetadata = (source: string): string | undefined => {
      const sourceMetadata = entity.metadata[source];
      if (sourceMetadata && typeof sourceMetadata === 'object' && sourceMetadata !== null) {
        const metadataObj = sourceMetadata as Record<string, unknown>;
        if ('name' in metadataObj && typeof metadataObj.name === 'string') {
          return metadataObj.name;
        }
      }
      return undefined;
    };

    uniqueEntities.set(entity.id, {
      id: entity.id,
      name: room?.source
        ? getEntityNameFromMetadata(room.source) || entity.names[0]
        : entity.names[0],
      names: entity.names,
      data: JSON.stringify({ ...mergedData, ...entity.metadata }),
    });
  }

  return Array.from(uniqueEntities.values());
}

/**
 * Format the given entities into a string representation.
 *
 * @param {Object} options - The options object.
 * @param {Entity[]} options.entities - The list of entities to format.
 * @returns {string} A formatted string representing the entities.
 */
export function formatEntities({ entities }: { entities: Entity[] }) {
  const entityStrings = entities.map((entity: Entity) => {
    const header = `"${entity.names.join('" aka "')}"\nID: ${entity.id}${entity.metadata && Object.keys(entity.metadata).length > 0 ? `\nData: ${JSON.stringify(entity.metadata)}\n` : '\n'}`;
    return header;
  });
  return entityStrings.join('\n');
}
```