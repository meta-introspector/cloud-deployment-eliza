# 5e8c73c1:packages_plugin-bootstrap_src_evaluators_reflection.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/evaluators/reflection.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 *
 * @param {UUID} entityId - The ID of the entity to resolve.
 * @param {Entity[]} entities - The list of entities to search through.
 * @returns {UUID} - The resolved UUID of the entity.
 * @throws {Error} - If the entity ID cannot be resolved to a valid UUID.
 */
function resolveEntity(entityId: string, entities: Entity[]): UUID {
  // First try exact UUID match
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entityId)) {
    return entityId as UUID;
  }

  let entity: Entity | undefined;

  // Try to match the entityId exactly
  entity = entities.find((a) => a.id === entityId);
  if (entity?.id) {
    return entity.id;
  }

  // Try partial UUID match with entityId
  entity = entities.find((a) => a.id?.includes(entityId));
  if (entity?.id) {
    return entity.id;
  }

  // Try name match as last resort
  entity = entities.find((a) =>
    a.names.some((n) => n.toLowerCase().includes(entityId.toLowerCase()))
  );
  if (entity?.id) {
    return entity.id;
  }

  throw new Error(`Could not resolve entityId "${entityId}" to a valid UUID`);
}
async function handler(runtime: IAgentRuntime, message: Memory, state?: State) {
  const { agentId, roomId } = message;

  if (!agentId || !roomId) {
    runtime.logger.warn(
      { src: 'plugin:bootstrap:evaluator:reflection', agentId: runtime.agentId, message },
      'Missing agentId or roomId in message'
    );
    return;
  }

  // Run all queries in parallel
  const [existingRelationships, entities, knownFacts] = await Promise.all([
    runtime.getRelationships({
      entityId: message.entityId,
    }),
    getEntityDetails({ runtime, roomId }),
    runtime.getMemories({
      tableName: 'facts',
      roomId,
      count: 30,
      unique: true,
    }),
  ]);

  const prompt = composePrompt({
    state: {
      ...(state?.values || {}),
      knownFacts: formatFacts(knownFacts),
      roomType: message.content.channelType as string,
      entitiesInRoom: JSON.stringify(entities),
      existingRelationships: JSON.stringify(existingRelationships),
      senderId: message.entityId,
    },
    template: runtime.character.templates?.reflectionTemplate || reflectionTemplate,
  });

  // Use the model without schema validation
  try {
    const response = await runtime.useModel(ModelType.TEXT_SMALL, {
      prompt,
    });

    if (!response) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap:evaluator:reflection', agentId: runtime.agentId },
        'Getting reflection failed - empty response'
      );
      return;
    }

    // Parse XML response
    const reflection = parseKeyValueXml<ReflectionXmlResult>(response);

    if (!reflection) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap:evaluator:reflection', agentId: runtime.agentId },
        'Getting reflection failed - failed to parse XML'
      );
      return;
    }

    // Perform basic structure validation
    if (!reflection.facts) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap:evaluator:reflection', agentId: runtime.agentId },
        'Getting reflection failed - invalid facts structure'
      );
      return;
    }

    if (!reflection.relationships) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap:evaluator:reflection', agentId: runtime.agentId },
        'Getting reflection failed - invalid relationships structure'
      );
      return;
    }

    // Handle facts - parseKeyValueXml returns nested structures differently
    // Facts might be a single object or an array depending on the count
    let factsArray: FactXml[] = [];
    if (reflection.facts.fact) {
      // Normalize to array
      factsArray = Array.isArray(reflection.facts.fact)
        ? reflection.facts.fact
        : [reflection.facts.fact];
    }

    // Store new facts - filter for valid new facts with claim text
    const newFacts = factsArray.filter(
      (fact): fact is FactXml & { claim: string } =>
        fact != null &&
        fact.already_known === 'false' &&
        fact.in_bio === 'false' &&
        typeof fact.claim === 'string' &&
        fact.claim.trim() !== ''
    );

    await Promise.all(
      newFacts.map(async (fact) => {
        const factMemory = {
          id: asUUID(v4()),
          entityId: agentId,
          agentId,
          content: { text: fact.claim },
          roomId,
          createdAt: Date.now(),
        };
        // Create memory first and capture the returned ID
        const createdMemoryId = await runtime.createMemory(factMemory, 'facts', true);
        // Update the memory object with the actual ID from the database
        const createdMemory = { ...factMemory, id: createdMemoryId };
        // Queue embedding generation asynchronously for the memory with correct ID
```