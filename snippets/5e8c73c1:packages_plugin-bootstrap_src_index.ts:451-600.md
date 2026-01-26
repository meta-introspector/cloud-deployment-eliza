# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  try {
    await runtime.createMemory(message, 'messages');
  } catch (error: unknown) {
    // PostgreSQL duplicate key violation error code
    const isDuplicateKeyError =
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === '23505';
    if (isDuplicateKeyError) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap', agentId: runtime.agentId },
        'Duplicate reaction memory, skipping'
      );
      return;
    }
    runtime.logger.error(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error in reaction handler'
    );
  }
};

/**
 * Handles the generation of a post (like a Tweet) and creates a memory for it.
 *
 * @param {Object} params - The parameters for the function.
 * @param {IAgentRuntime} params.runtime - The agent runtime object.
 * @param {Memory} params.message - The post message to be processed.
 * @param {HandlerCallback} params.callback - The callback function to execute after processing.
 * @returns {Promise<void>}
 */
const postGeneratedHandler = async ({
  runtime,
  callback,
  worldId,
  userId,
  roomId,
  source,
}: InvokePayload) => {
  runtime.logger.info({ src: 'plugin:bootstrap', agentId: runtime.agentId }, 'Generating new post');
  // Ensure world exists first
  await runtime.ensureWorldExists({
    id: worldId,
    name: `${runtime.character.name}'s Feed`,
    agentId: runtime.agentId,
    messageServerId: userId as UUID,
  });

  // Ensure timeline room exists
  await runtime.ensureRoomExists({
    id: roomId,
    name: `${runtime.character.name}'s Feed`,
    source,
    type: ChannelType.FEED,
    channelId: `${userId}-home`,
    messageServerId: userId as UUID,
    worldId,
  });

  const message = {
    id: createUniqueUuid(runtime, `tweet-${Date.now()}`) as UUID,
    entityId: runtime.agentId,
    agentId: runtime.agentId,
    roomId,
    content: {},
    metadata: {
      entityName: runtime.character.name,
      type: 'message',
    },
  };

  // generate thought of which providers to use using messageHandlerTemplate

  // Compose state with relevant context for tweet generation
  let state = await runtime.composeState(message, [
    'PROVIDERS',
    'CHARACTER',
    'RECENT_MESSAGES',
    'ENTITIES',
  ]);

  // get twitterUserName
  const entity = await runtime.getEntityById(runtime.agentId);
  interface TwitterMetadata {
    twitter?: {
      userName?: string;
    };
    userName?: string;
  }
  const metadata = entity?.metadata as TwitterMetadata | undefined;
  if (metadata?.twitter?.userName || metadata?.userName) {
    state.values.twitterUserName = metadata.twitter?.userName || metadata.userName;
  }

  const prompt = composePromptFromState({
    state,
    template: runtime.character.templates?.messageHandlerTemplate || messageHandlerTemplate,
  });

  let responseContent: Content | null = null;

  // Retry if missing required fields
  let retries = 0;
  const maxRetries = 3;
  while (retries < maxRetries && (!responseContent?.thought || !responseContent?.actions)) {
    const response = await runtime.useModel(ModelType.TEXT_SMALL, {
      prompt,
    });

    // Parse XML
    const parsedXml = parseKeyValueXml<MessageHandlerXml>(response);
    if (parsedXml) {
      // Normalize actions/providers to arrays (XML parser may return string or array)
      const actionsRaw = parsedXml.actions;
      const providersRaw = parsedXml.providers;
      responseContent = {
        thought: parsedXml.thought ?? '',
        actions: Array.isArray(actionsRaw) ? actionsRaw : actionsRaw ? [actionsRaw] : ['IGNORE'],
        providers: Array.isArray(providersRaw) ? providersRaw : providersRaw ? [providersRaw] : [],
        text: parsedXml.text ?? '',
        simple: parsedXml.simple ?? false,
      };
    } else {
      responseContent = null;
    }

    retries++;
    if (!responseContent?.thought || !responseContent?.actions) {
      runtime.logger.warn(
        { src: 'plugin:bootstrap', agentId: runtime.agentId, response, parsedXml, responseContent },
        'Missing required fields, retrying'
      );
    }
  }

  // update stats with correct providers
  state = await runtime.composeState(message, responseContent?.providers);

  // Generate prompt for tweet content
  const postPrompt = composePromptFromState({
    state,
    template: runtime.character.templates?.postCreationTemplate || postCreationTemplate,
  });

  // Use TEXT_LARGE model as we expect structured XML text, not a JSON object
  const xmlResponseText = await runtime.useModel(ModelType.TEXT_LARGE, {
```