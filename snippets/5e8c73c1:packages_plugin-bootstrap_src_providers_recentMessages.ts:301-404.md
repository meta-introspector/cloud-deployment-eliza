# 5e8c73c1:packages_plugin-bootstrap_src_providers_recentMessages.ts:301-404

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/recentMessages.ts:301-404
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          } else {
            sender =
              (interactionEntityMap.get(message.entityId)?.metadata?.userName as string) ||
              'unknown';
          }

          return `${sender}: ${message.content.text}`;
        });

        return formattedInteractions.join('\n');
      };

      // Format recent post interactions
      const getRecentPostInteractions = async (
        recentInteractionsData: Memory[],
        entities: Entity[]
      ): Promise<string> => {
        // Combine pre-loaded entities with any other entities
        const combinedEntities = [...entities];

        // Add entities from interactionEntityMap that aren't already in entities
        const actorIds = new Set(entities.map((entity) => entity.id));
        for (const [id, entity] of interactionEntityMap.entries()) {
          if (!actorIds.has(id)) {
            combinedEntities.push(entity);
          }
        }

        const formattedInteractions = formatPosts({
          messages: recentInteractionsData,
          entities: combinedEntities,
          conversationHeader: true,
        });

        return formattedInteractions;
      };

      // Process both types of interactions in parallel
      const [recentMessageInteractions, recentPostInteractions] = await Promise.all([
        getRecentMessageInteractions(recentInteractionsData),
        getRecentPostInteractions(recentInteractionsData, entitiesData),
      ]);

      const data = {
        recentMessages: dialogueMessages,
        recentInteractions: recentInteractionsData,
        actionResults: actionResultMessages,
      };

      const values = {
        recentPosts,
        recentMessages,
        recentMessageInteractions,
        recentPostInteractions,
        recentInteractions: isPostFormat ? recentPostInteractions : recentMessageInteractions,
        recentActionResults: actionResultsText,
        recentMessage,
      };

      // Combine all text sections
      const text = [
        isPostFormat ? recentPosts : recentMessages,
        actionResultsText, // Include action results in the text output
        // Only add received message and focus headers if there are messages or a current message to process
        recentMessages || recentPosts || message.content.text ? receivedMessageHeader : '',
        recentMessages || recentPosts || message.content.text ? focusHeader : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      return {
        data,
        values,
        text,
      };
    } catch (error) {
      logger.error(
        {
          src: 'plugin:bootstrap:provider:recent_messages',
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error in recentMessagesProvider'
      );
      // Return a default state in case of error, similar to the empty message list
      return {
        data: {
          recentMessages: [],
          recentInteractions: [],
          actionResults: [],
        },
        values: {
          recentPosts: '',
          recentMessages: '',
          recentMessageInteractions: '',
          recentPostInteractions: '',
          recentInteractions: '',
          recentActionResults: '',
        },
        text: 'Error retrieving recent messages.', // Or 'No recent messages available' as the test expects
      };
    }
  },
};
```