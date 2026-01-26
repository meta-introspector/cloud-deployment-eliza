# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    prompt: postPrompt,
  });

  // Parse the XML response
  const parsedXmlResponse = parseKeyValueXml<PostCreationXml>(xmlResponseText);

  if (!parsedXmlResponse) {
    runtime.logger.error(
      { src: 'plugin:bootstrap', agentId: runtime.agentId, xmlResponseText },
      'Failed to parse XML response for post creation'
    );
    // Handle the error appropriately, maybe retry or return an error state
    return;
  }

  /**
   * Cleans up a tweet text by removing quotes and fixing newlines
   */
  function cleanupPostText(text: string): string {
    // Remove quotes
    let cleanedText = text.replace(/^['"](.*)['"]$/, '$1');
    // Fix newlines
    cleanedText = cleanedText.replaceAll(/\\n/g, '\n\n');
    cleanedText = cleanedText.replace(/([^\n])\n([^\n])/g, '$1\n\n$2');

    return cleanedText;
  }

  // Cleanup the tweet text
  const cleanedText = cleanupPostText(parsedXmlResponse.post ?? '');

  // Prepare media if included
  // const mediaData: MediaData[] = [];
  // if (jsonResponse.imagePrompt) {
  // 	const images = await runtime.useModel(ModelType.IMAGE, {
  // 		prompt: jsonResponse.imagePrompt,
  // 		output: "no-schema",
  // 	});
  // 	try {
  // 		// Convert image prompt to Media format for fetchMediaData
  // 		const imagePromptMedia: any[] = images

  // 		// Fetch media using the utility function
  // 		const fetchedMedia = await fetchMediaData(imagePromptMedia);
  // 		mediaData.push(...fetchedMedia);
  // 	} catch (error) {
  // 		runtime.logger.error("Error fetching media for tweet:", error);
  // 	}
  // }

  // have we posted it before?
  const RM = state.data?.providers?.RECENT_MESSAGES as
    | { data?: { recentMessages?: Array<{ content: { text?: string } }> } }
    | undefined;
  if (RM?.data?.recentMessages) {
    for (const m of RM.data.recentMessages) {
      if (cleanedText === m.content.text) {
        runtime.logger.info(
          { src: 'plugin:bootstrap', agentId: runtime.agentId, cleanedText },
          'Already recently posted that, retrying'
        );
        postGeneratedHandler({
          runtime,
          callback,
          worldId,
          userId,
          roomId,
          source,
        });
        return; // don't call callbacks
      }
    }
  }

  // GPT 3.5/4: /(i\s+do\s+not|i'?m\s+not)\s+(feel\s+)?comfortable\s+generating\s+that\s+type\s+of\s+content|(inappropriate|explicit|offensive|communicate\s+respectfully|aim\s+to\s+(be\s+)?helpful)/i
  const oaiRefusalRegex =
    /((i\s+do\s+not|i'm\s+not)\s+(feel\s+)?comfortable\s+generating\s+that\s+type\s+of\s+content)|(inappropriate|explicit|respectful|offensive|guidelines|aim\s+to\s+(be\s+)?helpful|communicate\s+respectfully)/i;
  const anthropicRefusalRegex =
    /(i'?m\s+unable\s+to\s+help\s+with\s+that\s+request|due\s+to\s+safety\s+concerns|that\s+may\s+violate\s+(our\s+)?guidelines|provide\s+helpful\s+and\s+safe\s+responses|let'?s\s+try\s+a\s+different\s+direction|goes\s+against\s+(our\s+)?use\s+case\s+policies|ensure\s+safe\s+and\s+responsible\s+use)/i;
  const googleRefusalRegex =
    /(i\s+can'?t\s+help\s+with\s+that|that\s+goes\s+against\s+(our\s+)?(policy|policies)|i'?m\s+still\s+learning|response\s+must\s+follow\s+(usage|safety)\s+policies|i'?ve\s+been\s+designed\s+to\s+avoid\s+that)/i;
  //const cohereRefusalRegex = /(request\s+cannot\s+be\s+processed|violates\s+(our\s+)?content\s+policy|not\s+permitted\s+by\s+usage\s+restrictions)/i
  const generalRefusalRegex =
    /(response\s+was\s+withheld|content\s+was\s+filtered|this\s+request\s+cannot\s+be\s+completed|violates\s+our\s+safety\s+policy|content\s+is\s+not\s+available)/i;

  if (
    oaiRefusalRegex.test(cleanedText) ||
    anthropicRefusalRegex.test(cleanedText) ||
    googleRefusalRegex.test(cleanedText) ||
    generalRefusalRegex.test(cleanedText)
  ) {
    runtime.logger.info(
      { src: 'plugin:bootstrap', agentId: runtime.agentId, cleanedText },
      'Got prompt moderation refusal, retrying'
    );
    postGeneratedHandler({
      runtime,
      callback,
      worldId,
      userId,
      roomId,
      source,
    });
    return; // don't call callbacks
  }

  // Create the response memory
  const responseMessages = [
    {
      id: v4() as UUID,
      entityId: runtime.agentId,
      agentId: runtime.agentId,
      content: {
        text: cleanedText,
        source,
        channelType: ChannelType.FEED,
        thought: parsedXmlResponse.thought ?? '',
        type: 'post',
      },
      roomId: message.roomId,
      createdAt: Date.now(),
    },
  ];

  for (const message of responseMessages) {
    await callback?.(message.content);
  }

  // Process the actions and execute the callback
  // await runtime.processActions(message, responseMessages, state, callback);

  // // Run any configured evaluators
  // await runtime.evaluate(
  // 	message,
  // 	state,
  // 	true, // Post generation is always a "responding" scenario
  // 	callback,
  // 	responseMessages,
  // );
};

/**
 * Syncs a single user into an entity
 */
/**
 * Asynchronously sync a single user with the specified parameters.
 *
 * @param {UUID} entityId - The unique identifier for the entity.
 * @param {IAgentRuntime} runtime - The runtime environment for the agent.
 * @param {any} user - The user object to sync.
```