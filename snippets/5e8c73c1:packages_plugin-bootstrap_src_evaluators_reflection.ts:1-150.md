# 5e8c73c1:packages_plugin-bootstrap_src_evaluators_reflection.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/evaluators/reflection.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { z } from 'zod';
import { asUUID, getEntityDetails, parseKeyValueXml } from '@elizaos/core';
import { composePrompt } from '@elizaos/core';
import {
  type Entity,
  type Evaluator,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type State,
  type UUID,
} from '@elizaos/core';
import { v4 } from 'uuid';

/** Shape of a single fact in the XML response */
interface FactXml {
  claim?: string;
  type?: string;
  in_bio?: string;
  already_known?: string;
}

/** Shape of a single relationship in the XML response */
interface RelationshipXml {
  sourceEntityId?: string;
  targetEntityId?: string;
  tags?: string;
  metadata?: Record<string, unknown>;
}

/** Shape of the reflection XML response */
interface ReflectionXmlResult {
  facts?: {
    fact?: FactXml | FactXml[];
  };
  relationships?: {
    relationship?: RelationshipXml | RelationshipXml[];
  };
}

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

/**
 * Defines a schema for reflecting on a topic, including facts and relationships.
 * @type {import("zod").object}
 * @property {import("zod").array<import("zod").object<{claim: import("zod").string(), type: import("zod").string(), in_bio: import("zod").boolean(), already_known: import("zod").boolean()}>} facts Array of facts about the topic
 * @property {import("zod").array<import("zod").object>} relationships Array of relationships related to the topic
 */
/**
 * JSDoc comment for reflectionSchema object:
 *
 * Represents a schema for an object containing 'facts' and 'relationships'.
 * 'facts' is an array of objects with properties 'claim', 'type', 'in_bio', and 'already_known'.
 * 'relationships' is an array of objects following the relationshipSchema.
 */

z.object({
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
1. Generate a self-reflective thought on the conversation about your performance and interaction quality.
2. Extract new facts from the conversation.
3. Identify and describe relationships between entities.
  - The sourceEntityId is the UUID of the entity initiating the interaction.
  - The targetEntityId is the UUID of the entity being interacted with.
  - Relationships are one-direction, so a friendship would be two entity relationships where each entity is both the source and the target of the other.

Do NOT include any thinking, reasoning, or <think> sections in your response. 
Go directly to the XML response format without any preamble or explanation.

Generate a response in the following format:
<response>
  <thought>a self-reflective thought on the conversation</thought>
  <facts>
    <fact>
      <claim>factual statement</claim>
      <type>fact|opinion|status</type>
      <in_bio>false</in_bio>
      <already_known>false</already_known>
    </fact>
    <!-- Add more facts as needed -->
  </facts>
  <relationships>
    <relationship>
      <sourceEntityId>entity_initiating_interaction</sourceEntityId>
      <targetEntityId>entity_being_interacted_with</targetEntityId>
      <tags>group_interaction,voice_interaction,dm_interaction,additional_tag1,additional_tag2</tags>
    </relationship>
    <!-- Add more relationships as needed -->
  </relationships>
</response>

IMPORTANT: Your response must ONLY contain the <response></response> XML block above. Do not include any text, thinking, or reasoning before or after this XML block. Start your response immediately with <response> and end with </response>.`;

/**
 * Resolve an entity name to their UUID
 * @param name - Name to resolve
 * @param entities - List of entities to search through
 * @returns UUID if found, throws error if not found or if input is not a valid UUID
 */
/**
 * Resolves an entity ID by searching through a list of entities.
```