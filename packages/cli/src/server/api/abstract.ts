import type { Agent, Character, Content, IAgentRuntime, Memory, UUID } from '@elizaos/core';
import {
  ChannelType,
  ModelType,
  composePrompt,
  logger,
  messageHandlerTemplate,
} from '@elizaos/core';

// Declare a Map to store agents
const agents: Map<UUID, IAgentRuntime> = new Map();
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

export async function conversation2(
  runtime: IAgentRuntime,
  roomId,
  entityId,
  userName,
  text,
  worldid,
  messageId,
  createdAt,
  content: Content,
  userMessage
) {
  // ... existing code up to input memory ...

  let memory: Memory = await runtime.getMemoryById(messageId);
  if (memory == null) {
    memory = {
      id: messageId,
      agentId: runtime.agentId,
      entityId,
      roomId,
      content,
      createdAt: JSON.parse(createdAt) as number,
    };
    logger.debug('[SPEECH CONVERSATION] Creating memory');
    await runtime.createMemory(memory, 'messages');
  }

  const state = await runtime.composeState(userMessage);
  const prompt = composePrompt({ state, template: messageHandlerTemplate });
  const response = await runtime.useModel(ModelType.TEXT_LARGE, {
    prompt,
    system: messageHandlerTemplate,
  });

  if (!response) {
    console.error('no response from model', {
      success: false,
      error: { code: 'MODEL_ERROR', message: 'No response from model' },
    });
    return;
  }

  // Prepare response content
  const responseContent = {
    text: response,
    source: 'training',
    channelType: ChannelType.API,
  };

  // Check for existing matching memory
  const existingResponse = await lookupMemory(runtime, roomId, runtime.agentId, responseContent);

  let responseMessage;
  if (existingResponse) {
    responseMessage = existingResponse;
    logger.debug('[SPEECH CONVERSATION] Reusing existing response memory', responseMessage);
  } else {
    responseMessage = {
      ...userMessage,
      content: responseContent,
      roomId: roomId as UUID,
      agentId: runtime.agentId,
    };
    await runtime.createMemory(responseMessage, 'messages');
    logger.debug('[SPEECH CONVERSATION] Created new response memory', responseMessage);
  }

  await runtime.evaluate(memory, state);
  await runtime.processActions(memory, [responseMessage as Memory], state, async () => [memory]);

  logger.success(
    `[SPEECH CONVERSATION] Successfully processed conversation for: ${runtime.character.name}`
  );
}

export async function conversation(
  runtime: IAgentRuntime,
  roomId,
  entityId,
  userName,
  text,
  worldid,
  messageId,
  createdAt
) {
  logger.debug('[SPEECH CONVERSATION] Ensuring connection');
  await runtime.ensureConnection({
    entityId,
    roomId,
    worldId: worldid,
    userName: userName,
    name: userName,
    source: 'training',
    type: ChannelType.API,
  });

  //const messageId = createUniqueUuid(runtime, Date.now().toString());
  const content: Content = {
    text,
    attachments: [],
    source: 'training',
    inReplyTo: undefined,
    channelType: ChannelType.API,
  };

  const userMessage = {
    content,
    entityId,
    roomId,
    agentId: runtime.agentId,
  };

  // lookup memory
  let memory = await runtime.getMemoryById(messageId);
  if (memory == null) {
    memory = {
      id: messageId,
      agentId: runtime.agentId,
      entityId,
      roomId,
      content,
      createdAt: JSON.parse(createdAt) as number,
      //createdAt: new Date(JSON.parse(createdAt)),
    };
    logger.debug('[SPEECH CONVERSATION] Creating memory');
    //await runtime.createMemory(memory, 'messages');
  }

  logger.debug('[SPEECH CONVERSATION] Composing state');
  const state = await runtime.composeState(userMessage);

  logger.debug('[SPEECH CONVERSATION] Creating context');
  const prompt = composePrompt({
    state,
    template: messageHandlerTemplate,
  });

  logger.debug(
    '[SPEECH CONVERSATION] Using LLM for response messageHandlerTemplate',
    messageHandlerTemplate
  );
  logger.debug('prompt', prompt);
  logger.debug('[SPEECH CONVERSATION] Using LLM for response prompt', prompt);
  const response = await runtime.useModel(ModelType.TEXT_LARGE, {
    prompt: prompt,
    system: messageHandlerTemplate,
  });

  if (!response) {
    console.error('no response from model', {
      success: false,
      error: {
        code: 'MODEL_ERROR',
        message: 'No response from model',
      },
    });

    return;
  }

  logger.debug('[SPEECH CONVERSATION] Creating response memory', response);

  let res = await conversation2(
    runtime,
    roomId,
    entityId,
    userName,
    text,
    worldid,
    messageId,
    createdAt,
    content,
    userMessage
  );
  console.log('RES:', res);

  await runtime.evaluate(memory, state);
  //await runtime.processActions(memory, [responseMessage as Memory], state, async () => [memory]);

  logger.success(
    `[SPEECH CONVERSATION] Successfully processed conversation for: ${runtime.character.name}`
  );

  //await runtime.evaluate(memory, state);

  //await runtime.processActions(memory, [responseMessage as Memory], state, async () => [memory]);

  logger.success(
    `[SPEECH CONVERSATION] Successfully processed conversation for: ${runtime.character.name}`
  );
}
