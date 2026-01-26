# 5e8c73c1:packages_core_src_entities.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/entities.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { stringToUuid } from './index';
import { logger } from './logger';
import { composePrompt, parseKeyValueXml } from './utils';
import {
  type Entity,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type Relationship,
  type State,
  type UUID,
  type World,
} from './types';

/**
 * Entity match result from resolution
 */
interface EntityMatch {
  name?: string;
  reason?: string;
}

/**
 * Parsed resolution result containing matches
 */
interface ParsedResolution {
  resolvedId?: string;
  confidence?: string;
  matches?: {
    match?: EntityMatch | EntityMatch[];
  };
}

/**
 * Entity Resolution Template for resolving entity names based on context and recent messages.
 *
 * Contains placeholders for message sender, agent, entities in the room, and recent messages.
 * Provides instructions for analyzing the context and resolving entity references.
 */
const entityResolutionTemplate = `# Task: Resolve Entity Name
Message Sender: {{senderName}} (ID: {{senderId}})
Agent: {{agentName}} (ID: {{agentId}})

# Entities in Room:
{{#if entitiesInRoom}}
{{entitiesInRoom}}
{{/if}}

{{recentMessages}}

# Instructions:
1. Analyze the context to identify which entity is being referenced
2. Consider special references like "me" (the message sender) or "you" (agent the message is directed to)
3. Look for usernames/handles in standard formats (e.g. @username, user#1234)
4. Consider context from recent messages for pronouns and references
5. If multiple matches exist, use context to disambiguate
6. Consider recent interactions and relationship strength when resolving ambiguity

Do NOT include any thinking, reasoning, or <think> sections in your response. 
Go directly to the XML response format without any preamble or explanation.

Return an XML response with:
<response>
  <entityId>exact-id-if-known-otherwise-null</entityId>
  <type>EXACT_MATCH | USERNAME_MATCH | NAME_MATCH | RELATIONSHIP_MATCH | AMBIGUOUS | UNKNOWN</type>
  <matches>
    <match>
      <name>matched-name</name>
      <reason>why this entity matches</reason>
    </match>
  </matches>
</response>

IMPORTANT: Your response must ONLY contain the <response></response> XML block above. Do not include any text, thinking, or reasoning before or after this XML block. Start your response immediately with <response> and end with </response>.`;

/**
 * Get recent interactions between a source entity and candidate entities in a specific room.
 *
 * @param {IAgentRuntime} runtime - The runtime context for the agent.
 * @param {UUID} sourceEntityId - The ID of the source entity initiating interactions.
 * @param {Entity[]} candidateEntities - The list of candidate entities to evaluate interactions with.
 * @param {UUID} roomId - The ID of the room where interactions are taking place.
 * @param {Relationship[]} relationships - The relationships between the entities involved.
 * @returns {Promise<{ entity: Entity; interactions: Memory[]; count: number }[]>} - An array of objects containing the entity, recent interactions, and interaction count.
 */
async function getRecentInteractions(
  runtime: IAgentRuntime,
  sourceEntityId: UUID,
  candidateEntities: Entity[],
  roomId: UUID,
  relationships: Relationship[]
): Promise<{ entity: Entity; interactions: Memory[]; count: number }[]> {
  const results: Array<{ entity: Entity; interactions: Memory[]; count: number }> = [];

  // Get recent messages from the room - just for context
  const recentMessages = await runtime.getMemories({
    tableName: 'messages',
    roomId,
    count: 20, // Reduced from 100 since we only need context
  });

  for (const entity of candidateEntities) {
    const interactions: Memory[] = [];
    let interactionScore = 0;

    // First get direct replies using inReplyTo
    const directReplies = recentMessages.filter(
      (msg) =>
        (msg.entityId === sourceEntityId && msg.content.inReplyTo === entity.id) ||
        (msg.entityId === entity.id && msg.content.inReplyTo === sourceEntityId)
    );

    interactions.push(...directReplies);

    // Get relationship strength from metadata
    const relationship = relationships.find(
      (rel) =>
        (rel.sourceEntityId === sourceEntityId && rel.targetEntityId === entity.id) ||
        (rel.targetEntityId === sourceEntityId && rel.sourceEntityId === entity.id)
    );

    if (relationship?.metadata?.interactions) {
      interactionScore = relationship.metadata.interactions as number;
    }

    // Add bonus points for recent direct replies
    interactionScore += directReplies.length;

    // Keep last few messages for context
    const uniqueInteractions = [...new Set(interactions)];
    results.push({
      entity,
      interactions: uniqueInteractions.slice(-5), // Only keep last 5 messages for context
      count: Math.round(interactionScore),
    });
  }

  // Sort by interaction score descending
  return results.sort((a, b) => b.count - a.count);
}

/**
 * Finds an entity by name in the given runtime environment.
 *
 * @param {IAgentRuntime} runtime - The agent runtime environment.
 * @param {Memory} message - The memory message containing relevant information.
 * @param {State} state - The current state of the system.
 * @returns {Promise<Entity | null>} A promise that resolves to the found entity or null if not found.
 */
export async function findEntityByName(
```