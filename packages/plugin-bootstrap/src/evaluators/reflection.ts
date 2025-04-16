import { z } from 'zod'; //import { z } from 'zod';
import { resolveEntity } from './abstract';
import { getEntityDetails } from '../entities';

import { composePrompt } from '../prompts';
import { type Entity, type Evaluator, type ModelLimits, ModelType, type State } from '../types';
import { AgentRuntime, Relationship } from '@elizaos/core';

import type { IAgentRuntime, Memory, UUID } from '@elizaos/core';
import { logger } from '@elizaos/core';

// Function to lookup an existing memory matching content and context
async function lookupMemory(
  runtime: IAgentRuntime,
  roomId: UUID,
  agentId: UUID,
  content: { text: string; source?: string; channelType?: string },
  limit: number = 50
): Promise<Memory | null> {
  const memories = await runtime.getMemories({
    tableName: 'messages',
    roomId,
    count: limit,
    unique: false, // Allow all matches to check exact content
  });

  const targetText = content.text.trim();
  const matchingMemory = memories.find((mem) => {
    try {
      const memText = mem.content.text.trim();
      // Handle JSON-wrapped content (e.g., from your snippet)
      const memData = memText.startsWith('```json\n')
        ? JSON.parse(memText.slice(7, -3))
        : { text: memText };
      const targetData = targetText.startsWith('```json\n')
        ? JSON.parse(targetText.slice(7, -3))
        : { text: targetText };

      // Compare JSON content (thought, actions, providers) or raw text
      if (typeof memData === 'object' && typeof targetData === 'object') {
        return (
          memData.thought === targetData.thought &&
          JSON.stringify(memData.actions) === JSON.stringify(targetData.actions) &&
          JSON.stringify(memData.providers) === JSON.stringify(targetData.providers)
        );
      }
      return memText === targetText; // Fallback for plain text
    } catch (e) {
      logger.debug('[LOOKUP_MEMORY] Skipping malformed memory', { id: mem.id, error: e.message });
      return false;
    }
  });

  if (matchingMemory) {
    logger.debug('[LOOKUP_MEMORY] Found matching memory', { id: matchingMemory.id });
  }
  return matchingMemory || null;
}

/**
 * Template string for generating Agent Reflection, Extracting Facts, and Relationships.
 *
 * @type {string}
 */
const reflectionTemplate = `# Task: Generate Agent Reflection, Extract Facts and Relationships

{{providers}}

# Examples:
{{evaluationExamples}}

# Entities in Room
{{entitiesInRoom}}

# Existing Relationships
{{existingRelationships}}

# Current Context:
Agent Name: {{agentName}}
Room Type: {{roomType}}
Message Sender: {{senderName}} (ID: {{senderId}})

{{recentMessages}}

# Known Facts:
{{knownFacts}}

# Instructions:
1. Generate a self-reflective thought on the conversation. How are you doing? You're not being annoying, are you?
2. Extract new facts from the conversation.
3. Identify and describe relationships between entities.
  - The sourceEntityId is the UUID of the entity initiating the interaction.
  - The targetEntityId is the UUID of the entity being interacted with.
  - Relationships are one-direction, so a friendship would be two entity relationships where each entity is both the source and the target of the other.

Generate a response in the following format:
\`\`\`json
{
  "thought": "a self-reflective thought on the conversation",
  "facts": [
      {
          "claim": "factual statement",
          "type": "fact|opinion|status",
          "in_bio": false,
          "already_known": false
      }
  ],
  "relationships": [
      {
          "sourceEntityId": "entity_initiating_interaction",
          "targetEntityId": "entity_being_interacted_with",
          "tags": ["group_interaction|voice_interaction|dm_interaction", "additional_tag1", "additional_tag2"]
      }
  ]
}
\`\`\``;

// Schema definitions for the reflection output
const relationshipSchema = z.object({
  sourceEntityId: z.string(),
  targetEntityId: z.string(),
  tags: z.array(z.string()),
  metadata: z
    .object({
      interactions: z.number(),
    })
    .optional(),
});

const reflectionSchema = z.object({
  // reflection: z.string(),
  facts: z.array(
    z.object({
      claim: z.string(),
      type: z.string(),
      in_bio: z.boolean(),
      already_known: z.boolean(),
    })
  ),
  relationships: z.array(relationshipSchema),
});

const schema_format = reflectionSchema.safeParse({
  thought: 'self-reflection',
  facts: [
    {
      claim: 'fact',
      type: 'fact|opinion|status',
      in_bio: false,
      already_known: false,
    },
  ],
  relationships: [
    {
      sourceEntityId: 'uuid',
      targetEntityId: 'uuid',
      tags: ['interaction_type'],
    },
  ],
});

const reflectionTemplate_shortest = `
# Task: Agent Reflection
{{providers}}
# Context:
Agent: {{agentName}}
Room: {{roomType}}
Sender: {{senderName}} ({{senderId}})
{{recentMessages}}
# Known Facts:
{{knownFacts}}
# Instructions:
1. Reflect on the conversation
2. Extract new facts
3. Identify relationships (sourceEntityId → targetEntityId)
\`\`\`json {{schema_format}}\`\`\`
`;

const reflectionTemplates = [reflectionTemplate_shortest, reflectionTemplate];
function trim_entities(entities: Entity[], mainEntityId: string, cutoff: number): Entity[] {
  return entities.map((entity) => ({
    ...entity,
    //relationships: trim_rels(entity.relationships, 1),
  }));
}
// Helper function to format facts for context
export function formatFacts(facts: Memory[]) {
  return facts
    .reverse()
    .map((fact: Memory) => fact.content.text)
    .join('\n');
}
function filter_entities(entities: Entity[], tag: string, entities_cutoff: number): Entity[] {
  return entities
    .filter((entity) => {
      const tags = entity.metadata || [];
      return tags.includes(tag);
    })
    .slice(0, entities_cutoff);
}
function filter_rels(
  existingRelationships: Relationship[],
  tag: string,
  rels_cutoff: number
): Relationship[] {
  return existingRelationships
    .filter((relationship) => {
      const tags = relationship.tags || [];
      return tags.includes(tag);
    })
    .slice(0, rels_cutoff)
    .map((relationship) => ({
      ...relationship,
      sourceEntityId: resolveEntity(relationship.sourceEntityId, []),
      targetEntityId: resolveEntity(relationship.targetEntityId, []),
    }));
}
function* generateStates(
  limits: ModelLimits,
  entityId: string,
  knownFacts: Memory[],
  entities: Entity[],
  existingRelationships: Relationship[]
) {
  const facts_cutoff = Math.floor(knownFacts.length / 2);
  const entities_cutoff = Math.floor(entities.length / 2);
  const rels_cutoff = Math.floor(existingRelationships.length / 2);

  const taglist = collectTags(limits, entityId, knownFacts, entities, existingRelationships);
  for (const tag of taglist) {
    const state = {
      //values: {
      //...values,
      knownFacts: formatFacts(filter_facts(knownFacts, tag, facts_cutoff)),
      roomType: 'group',
      entitiesInRoom: JSON.stringify(filter_entities(entities, tag, entities_cutoff)),
      existingRelationships: JSON.stringify(filter_rels(existingRelationships, tag, rels_cutoff)),
      //},
      //tags: tags,
    };
    yield state;
  }

  //for (const entity of entities) {

  // const res: { [key: string]: string } = {
  //   //values: "",
  //   entityId: entity.id, state: 'processed',
  //   knownFacts: formatFacts(trim_facts(knownFacts, entityId, facts_cutoff)),
  //   //entitiesInRoom: entities,
  //   entitiesInRoom: JSON.stringify(trim_entities(entities, entityId, entities_cutoff)),
  //   existingRelationships: JSON.stringify(trim_rels(existingRelationships, entityId, rels_cutoff)),
  // };
  //yield res;
  //}
}
function calculateRelationshipValue(rel: Relationship): number {
  // Example logic to calculate a value for the relationship
  return rel.tags.length; // You can replace this with your own logic
}
function trim_facts(knownFacts: any, mainEntityId: string, facts_cutoff: number): Memory[] {
  return knownFacts.slice(0, facts_cutoff);
}
function trim_rels(
  existingRelationships: Relationship[],
  mainEntityId: string,
  amount: number
): Relationship[] {
  return existingRelationships
    .map((rel) => ({
      ...rel,
      value: calculateRelationshipValue(rel), // Assume this function calculates a value for the relationship
    }))
    .filter((rel) => rel.value >= amount)
    .map(({ value, ...rest }) => rest); // Remove the value property before returning
}
function checkLimits(limits: ModelLimits, prompt: string): boolean {
  const promptLength = prompt.length;
  return (
    (limits.tpm === undefined || promptLength <= limits.tpm) &&
    (limits.rpm === undefined || promptLength <= limits.rpm)
  );
}

async function* generatePrompts(
  limits: ModelLimits,
  agentId: UUID,
  roomId: string,
  state: State,
  message: Memory,
  knownFacts: Memory[],
  entities: Entity[],
  existingRelationships: Relationship[],
  runtime: AgentRuntime,
  reflectionTemplates: string[]
) {
  {
    const facts_cutoff = Math.floor(knownFacts.length / 2);
    const rels_cutoff = Math.floor(existingRelationships.length / 2);
    const entities_cutoff = Math.floor(entities.length / 2);
    for (const reflectionTemplate of reflectionTemplates) {
      for (const newstate of generateStates(
        limits,
        message.entityId,
        knownFacts,
        entities,
        existingRelationships
      )) {
        const prompt = composePrompt({
          state: {
            //...newstate.values,
            knownFacts: formatFacts(trim_facts(knownFacts, message.entityId, facts_cutoff)),
            roomType: message.content.channelType as string,
            entitiesInRoom: newstate.entitiesInRoom,
            existingRelationships: JSON.stringify(
              trim_rels(existingRelationships, message.entityId, rels_cutoff)
            ),
            senderId: message.entityId,
          },
          template: reflectionTemplate,
        });
        logger.debug('Prompt', prompt);
        if (checkLimits(limits, prompt)) {
          try {
            const reflection = await runtime.useModel(ModelType.OBJECT_SMALL, {
              prompt,
              // Remove schema validation to avoid zod issues
            });

            if (!reflection.facts || !Array.isArray(reflection.facts)) {
              logger.warn('Getting reflection failed - invalid facts structure', reflection);
              continue;
            }
            if (!reflection.relationships || !Array.isArray(reflection.relationships)) {
              logger.warn(
                'Getting reflection failed - invalid relationships structure',
                reflection
              );
              continue;
            }
            yield reflection;
          } catch (error) {
            logger.error('Error in reflection handler:', error);
            //return;
          }
        }
      }
    }
  }
}

async function process_reflection(
  reflection: any,
  agentId: UUID,
  roomId: UUID,
  runtime: AgentRuntime,
  entities: Entity[],
  existingRelationships: Relationship[]
) {
  // Store new facts
  const newFacts =
    reflection.facts.filter(
      (fact) =>
        fact &&
        typeof fact === 'object' &&
        !fact.already_known &&
        !fact.in_bio &&
        fact.claim &&
        typeof fact.claim === 'string' &&
        fact.claim.trim() !== ''
    ) || [];

  await Promise.all(
    newFacts.map(async (fact) => {
      const factMemory = await runtime.addEmbeddingToMemory({
        entityId: agentId,
        agentId,
        content: { text: fact.claim },
        roomId,
        createdAt: Date.now(),
      });
      return runtime.createMemory(factMemory, 'facts', true);
    })
  );

  // Update or create relationships
  for (const relationship of reflection.relationships) {
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

    if (existingRelationship) {
      const updatedMetadata = {
        ...existingRelationship.metadata,
        interactions: (existingRelationship.metadata?.interactions || 0) + 1,
      };

      const updatedTags = Array.from(
        new Set([...(existingRelationship.tags || []), ...relationship.tags])
      );

      await runtime.updateRelationship({
        ...existingRelationship,
        tags: updatedTags,
        metadata: updatedMetadata,
      });
    } else {
      await runtime.createRelationship({
        sourceEntityId: sourceId,
        targetEntityId: targetId,
        tags: relationship.tags,
        metadata: {
          interactions: 1,
          ...relationship.metadata,
        },
      });
    }
  }
}

async function handler(runtime: AgentRuntime, message: Memory, state?: State) {
  const ret = await reflection_handler(runtime, message, state);
  console.log(ret);
  return ret;
}

async function reflection_handler(runtime: AgentRuntime, message: Memory, state?: State) {
  console.log('Evaluate Mesage ID', message.id);
  if (message.id == undefined) {
    throw Error('message id cannot be null');
  }

  const { agentId, roomId } = message;

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

  const reflections = [];

  const limits = runtime.getModelLimits(ModelType.OBJECT_SMALL);
  console.debug('limits', limits);

  for await (const reflection of generatePrompts(
    limits,
    agentId,
    roomId,
    state,
    message,
    knownFacts,
    entities,
    existingRelationships,
    runtime,
    reflectionTemplates
  )) {
    reflections.push(reflection);
    await process_reflection(reflection, agentId, roomId, runtime, entities, existingRelationships);
  }
  console.log('Message', message);
  await runtime.setCache<string>(`${message.roomId}-reflection-last-processed`, message.id);

  return reflections;
}

async function validateFunction(runtime: AgentRuntime, message: Memory): Promise<boolean> {
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

  logger.debug('Reflection', reflectionInterval, messages, lastMessageId);

  return messages.length > reflectionInterval;
}

export const reflectionEvaluator: Evaluator = {
  name: 'REFLECTION',
  similes: ['REFLECT', 'SELF_REFLECT', 'EVALUATE_INTERACTION', 'ASSESS_SITUATION'],
  validate: validateFunction,
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
      outcome: `{
    "thought": "I'm engaging appropriately with a new community member, maintaining a welcoming and professional tone. My questions are helping to learn more about John and make him feel welcome.",
    "facts": [
        {
            "claim": "John is new to the community",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        },
        {
            "claim": "John found the community through a friend interested in AI",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        }
    ],
    "relationships": [
        {
            "sourceEntityId": "sarah-agent",
            "targetEntityId": "user-123",
            "tags": ["group_interaction"]
        },
        {
            "sourceEntityId": "user-123",
            "targetEntityId": "sarah-agent",
            "tags": ["group_interaction"]
        }
    ]
}`,
    },
    {
      prompt: `Agent Name: Alex
Agent Role: Tech Support
Room Type: group
Current Room: tech-help
Message Sender: Emma (user-456)`,
      messages: [
        {
          name: 'Emma',
          content: { text: 'My app keeps crashing when I try to upload files' },
        },
        {
          name: 'Alex',
          content: { text: 'Have you tried clearing your cache?' },
        },
        {
          name: 'Emma',
          content: { text: 'No response...' },
        },
        {
          name: 'Alex',
          content: {
            text: 'Emma, are you still there? We can try some other troubleshooting steps.',
          },
        },
      ],
      outcome: `{
    "thought": "I'm not sure if I'm being helpful or if Emma is frustrated with my suggestions. The lack of response is concerning - maybe I should have asked for more details about the issue first before jumping to solutions.",
    "facts": [
        {
            "claim": "Emma is having technical issues with file uploads",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        },
        {
            "claim": "Emma stopped responding after the first troubleshooting suggestion",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        }
    ],
    "relationships": [
        {
            "sourceEntityId": "alex-agent",
            "targetEntityId": "user-456",
            "tags": ["group_interaction", "support_interaction", "incomplete_interaction"]
        }
    ]
}`,
    },
    {
      prompt: `Agent Name: Max
Agent Role: Discussion Facilitator 
Room Type: group
Current Room: book-club
Message Sender: Lisa (user-789)`,
      messages: [
        {
          name: 'Lisa',
          content: { text: 'What did everyone think about chapter 5?' },
        },
        {
          name: 'Max',
          content: {
            text: 'The symbolism was fascinating! The red door clearly represents danger.',
          },
        },
        {
          name: 'Max',
          content: {
            text: "And did anyone notice how the author used weather to reflect the protagonist's mood?",
          },
        },
        {
          name: 'Max',
          content: {
            text: 'Plus the foreshadowing in the first paragraph was brilliant!',
          },
        },
        {
          name: 'Max',
          content: {
            text: 'I also have thoughts about the character development...',
          },
        },
      ],
      outcome: `{
    "thought": "I'm dominating the conversation and not giving others a chance to share their perspectives. I've sent multiple messages in a row without waiting for responses. I need to step back and create space for other members to participate.",
    "facts": [
        {
            "claim": "The discussion is about chapter 5 of a book",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        },
        {
            "claim": "Max has sent 4 consecutive messages without user responses",
            "type": "fact",
            "in_bio": false,
            "already_known": false
        }
    ],
    "relationships": [
        {
            "sourceEntityId": "max-agent",
            "targetEntityId": "user-789",
            "tags": ["group_interaction", "excessive_interaction"]
        }
    ]
}`,
    },
  ],
};

function collectTags(
  limits: ModelLimits,
  entityId: string,
  knownFacts: Memory[],
  entities: Entity[],
  existingRelationships: Relationship[]
): string[] {
  // throw new Error('Function not implemented.');
  let tagList = [];
  knownFacts.forEach((fact) => {
    const tags = fact.metadata?.tags || [];
    tags.forEach((tag) => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
    });
  });
  existingRelationships.forEach((relationship) => {
    const tags = relationship.tags || [];
    tags.forEach((tag) => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
    });
  });

  entities.forEach((entity) => {
    const tags = entity.metadata || [];
    tags.forEach((tag) => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
    });
  });
  return tagList;
}

function filter_facts(knownFacts: Memory[], tag: string, facts_cutoff: number): Memory[] {
  return knownFacts
    .filter((fact) => {
      const tags = fact.metadata?.tags || [];
      return tags.includes(tag);
    })
    .slice(0, facts_cutoff);
}
