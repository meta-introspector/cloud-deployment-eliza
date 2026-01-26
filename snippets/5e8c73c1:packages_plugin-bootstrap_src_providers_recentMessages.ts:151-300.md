# 5e8c73c1:packages_plugin-bootstrap_src_providers_recentMessages.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/recentMessages.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
                if (error) {
                  memText += `: Error - ${error}`;
                } else if (text && text !== `Executed action: ${actionName}`) {
                  memText += `: ${text}`;
                }

                return memText;
              })
              .join('\n');

            return `**Action Run ${runId.slice(0, 8)}**${thought ? ` - "${thought}"` : ''}\n${runText}`;
          })
          .join('\n\n');

        actionResultsText = formattedActionResults
          ? addHeader('# Recent Action Executions', formattedActionResults)
          : '';
      }

      // Create formatted text with headers
      const recentPosts =
        formattedRecentPosts && formattedRecentPosts.length > 0
          ? addHeader('# Posts in Thread', formattedRecentPosts)
          : '';

      const recentMessages =
        formattedRecentMessages && formattedRecentMessages.length > 0
          ? addHeader('# Conversation Messages', formattedRecentMessages)
          : '';

      // If there are no messages at all, and no current message to process, return a specific message.
      // The check for dialogueMessages.length === 0 ensures we only show this if there's truly nothing.
      if (
        !recentPosts &&
        !recentMessages &&
        dialogueMessages.length === 0 &&
        !message.content.text
      ) {
        return {
          data: {
            recentMessages: dialogueMessages,
            recentInteractions: [],
            actionResults: actionResultMessages,
          },
          values: {
            recentPosts: '',
            recentMessages: '',
            recentMessageInteractions: '',
            recentPostInteractions: '',
            recentInteractions: '',
            recentActionResults: actionResultsText,
          },
          text: 'No recent messages available',
        };
      }

      let recentMessage = 'No recent message available.';

      if (dialogueMessages.length > 0) {
        // Get the most recent dialogue message (create a copy to avoid mutating original array)
        const mostRecentMessage = [...dialogueMessages].sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        )[0];

        // Format just this single message to get the internal thought
        const formattedSingleMessage = formatMessages({
          messages: [mostRecentMessage],
          entities: entitiesData,
        });

        if (formattedSingleMessage) {
          recentMessage = formattedSingleMessage;
        }
      }

      const metaData = message.metadata as CustomMetadata;
      const senderName =
        entitiesData.find((entity: Entity) => entity.id === message.entityId)?.names[0] ||
        metaData?.entityName ||
        'Unknown User';
      const receivedMessageContent = message.content.text;

      const hasReceivedMessage = !!receivedMessageContent?.trim();

      const receivedMessageHeader = hasReceivedMessage
        ? addHeader('# Received Message', `${senderName}: ${receivedMessageContent}`)
        : '';

      const focusHeader = hasReceivedMessage
        ? addHeader(
            '# Focus your response',
            `You are replying to the above message from **${senderName}**. Keep your answer relevant to that message. Do not repeat earlier replies unless the sender asks again.`
          )
        : '';

      // Preload all necessary entities for both types of interactions
      const interactionEntityMap = new Map<UUID, Entity>();

      // Only proceed if there are interactions to process
      if (recentInteractionsData.length > 0) {
        // Get unique entity IDs that aren't the runtime agent
        const uniqueEntityIds = [
          ...new Set(
            recentInteractionsData
              .map((message) => message.entityId)
              .filter((id) => id !== runtime.agentId)
          ),
        ];

        // Create a Set for faster lookup
        const uniqueEntityIdSet = new Set(uniqueEntityIds);

        // Add entities already fetched in entitiesData to the map
        const entitiesDataIdSet = new Set<UUID>();
        entitiesData.forEach((entity) => {
          if (uniqueEntityIdSet.has(entity.id)) {
            interactionEntityMap.set(entity.id, entity);
            entitiesDataIdSet.add(entity.id);
          }
        });

        // Get the remaining entities that weren't already loaded
        // Use Set difference for efficient filtering
        const remainingEntityIds = uniqueEntityIds.filter((id) => !entitiesDataIdSet.has(id));

        // Only fetch the entities we don't already have
        if (remainingEntityIds.length > 0) {
          const entities = await Promise.all(
            remainingEntityIds.map((entityId) => runtime.getEntityById(entityId))
          );

          entities.forEach((entity, index) => {
            if (entity) {
              interactionEntityMap.set(remainingEntityIds[index], entity);
            }
          });
        }
      }

      // Format recent message interactions
      const getRecentMessageInteractions = async (
        recentInteractionsData: Memory[]
      ): Promise<string> => {
        // Format messages using the pre-fetched entities
        const formattedInteractions = recentInteractionsData.map((message) => {
          const isSelf = message.entityId === runtime.agentId;
          let sender: string;

          if (isSelf) {
            sender = runtime.character.name;
```