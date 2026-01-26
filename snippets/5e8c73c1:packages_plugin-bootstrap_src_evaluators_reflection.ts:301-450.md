# 5e8c73c1:packages_plugin-bootstrap_src_evaluators_reflection.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/evaluators/reflection.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        await runtime.queueEmbeddingGeneration(createdMemory, 'low');
        return createdMemory;
      })
    );

    // Handle relationships - similar structure normalization
    let relationshipsArray: RelationshipXml[] = [];
    if (reflection.relationships.relationship) {
      relationshipsArray = Array.isArray(reflection.relationships.relationship)
        ? reflection.relationships.relationship
        : [reflection.relationships.relationship];
    }

    // Update or create relationships
    for (const relationship of relationshipsArray) {
      if (!relationship.sourceEntityId || !relationship.targetEntityId) {
        console.warn('Skipping relationship with missing entity IDs:', relationship);
        continue;
      }

      let sourceId: UUID;
      let targetId: UUID;

      try {
        sourceId = resolveEntity(relationship.sourceEntityId, entities);
        targetId = resolveEntity(relationship.targetEntityId, entities);
      } catch (error) {
        console.warn('Failed to resolve relationship entities:', error);
        console.warn('relationship:\n', relationship);
        continue; // Skip this relationship if we can't resolve the IDs
      }

      const existingRelationship = existingRelationships.find((r) => {
        return r.sourceEntityId === sourceId && r.targetEntityId === targetId;
      });

      // Parse tags from comma-separated string
      const tags = relationship.tags
        ? relationship.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : [];

      if (existingRelationship) {
        const updatedMetadata = {
          ...existingRelationship.metadata,
          interactions:
            ((existingRelationship.metadata?.interactions as number | undefined) || 0) + 1,
        };

        const updatedTags = Array.from(new Set([...(existingRelationship.tags || []), ...tags]));

        await runtime.updateRelationship({
          ...existingRelationship,
          tags: updatedTags,
          metadata: updatedMetadata,
        });
      } else {
        await runtime.createRelationship({
          sourceEntityId: sourceId,
          targetEntityId: targetId,
          tags,
          metadata: {
            interactions: 1,
            ...(relationship.metadata || {}),
          },
        });
      }
    }

    await runtime.setCache<string>(
      `${message.roomId}-reflection-last-processed`,
      message?.id || ''
    );
  } catch (error) {
    runtime.logger.error(
      {
        src: 'plugin:bootstrap:evaluator:reflection',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error in reflection handler'
    );
    return;
  }
}

export const reflectionEvaluator: Evaluator = {
  name: 'REFLECTION',
  similes: ['REFLECT', 'SELF_REFLECT', 'EVALUATE_INTERACTION', 'ASSESS_SITUATION'],
  validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    const lastMessageId = await runtime.getCache<string>(
      `${message.roomId}-reflection-last-processed`
    );
    const messages = await runtime.getMemories({
      tableName: 'messages',
      roomId: message.roomId,
      count: runtime.getConversationLength(),
    });

    if (lastMessageId) {
      const lastMessageIndex = messages.findIndex((msg) => msg.id === lastMessageId);
      if (lastMessageIndex !== -1) {
        messages.splice(0, lastMessageIndex + 1);
      }
    }

    const reflectionInterval = Math.ceil(runtime.getConversationLength() / 4);

    return messages.length > reflectionInterval;
  },
  description:
    'Generate a self-reflective thought on the conversation, then extract facts and relationships between entities in the conversation.',
  handler,
  examples: [
    {
      prompt: `Agent Name: Sarah
Agent Role: Community Manager
Room Type: group
Current Room: general-chat
Message Sender: John (user-123)`,
      messages: [
        {
          name: 'John',
          content: { text: "Hey everyone, I'm new here!" },
        },
        {
          name: 'Sarah',
          content: { text: 'Welcome John! How did you find our community?' },
        },
        {
          name: 'John',
          content: { text: "Through a friend who's really into AI" },
        },
      ],
      outcome: `<response>
    <thought>I'm engaging appropriately with a new community member, maintaining a welcoming and professional tone. My questions are helping to learn more about John and make him feel welcome.</thought>
    <facts>
        <fact>
            <claim>John is new to the community</claim>
            <type>fact</type>
            <in_bio>false</in_bio>
            <already_known>false</already_known>
        </fact>
        <fact>
            <claim>John found the community through a friend interested in AI</claim>
            <type>fact</type>
            <in_bio>false</in_bio>
            <already_known>false</already_known>
```