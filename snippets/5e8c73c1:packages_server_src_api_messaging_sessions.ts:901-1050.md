# 5e8c73c1:packages_server_src_api_messaging_sessions.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/sessions.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      }

      if (query.after) {
        const afterTimestamp = parseInt(query.after, 10);
        if (isNaN(afterTimestamp) || !isFinite(afterTimestamp)) {
          throw new InvalidPaginationError('after', query.after, 'Must be a valid timestamp');
        }
        afterDate = new Date(afterTimestamp);
        if (isNaN(afterDate.getTime())) {
          throw new InvalidPaginationError('after', query.after, 'Invalid date from timestamp');
        }
      }

      // Retrieve messages based on pagination parameters
      let messages: CentralRootMessage[];

      if (afterDate && beforeDate) {
        // Range query: messages between two timestamps
        // The database layer currently only supports 'before', so we fetch and filter
        const fetchLimit = Math.min(500, messageLimit * 10);

        const allMessages = await serverInstance.getMessagesForChannel(
          session.channelId,
          fetchLimit,
          beforeDate
        );

        messages = allMessages
          .filter((msg) => msg.createdAt > afterDate && msg.createdAt < beforeDate)
          .slice(0, messageLimit);

        if (allMessages.length === fetchLimit) {
          logger.debug({ src: 'http', fetchLimit }, 'Range query hit message limit');
        }
      } else if (afterDate) {
        // Forward pagination: messages newer than a timestamp
        // TODO: When database layer supports 'after', replace this with direct query
        const fetchLimit = Math.min(1000, messageLimit * 20);
        const recentMessages = await serverInstance.getMessagesForChannel(
          session.channelId,
          fetchLimit
        );

        const newerMessages = recentMessages.filter((msg) => msg.createdAt > afterDate);

        if (newerMessages.length > messageLimit) {
          // Get the oldest N messages from the newer set for continuous pagination
          messages = newerMessages
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .slice(0, messageLimit)
            .reverse(); // Return in newest-first order
        } else {
          messages = newerMessages;
        }
      } else {
        // Standard backward pagination
        messages = await serverInstance.getMessagesForChannel(
          session.channelId,
          messageLimit,
          beforeDate
        );
      }

      // Transform to simplified format
      const simplifiedMessages: SimplifiedMessage[] = messages.map((msg) => {
        let rawMessage: ParsedRawMessage = {};
        try {
          const parsedData =
            typeof msg.rawMessage === 'string' ? JSON.parse(msg.rawMessage) : msg.rawMessage;

          // Validate parsed data is an object
          if (parsedData && typeof parsedData === 'object') {
            rawMessage = parsedData as ParsedRawMessage;
          }
        } catch (error) {
          logger.warn(
            {
              src: 'http',
              messageId: msg.id,
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to parse rawMessage'
          );
        }

        // Transform the entire message to handle attachments in both content and metadata
        const transformedMessage = transformMessageAttachments({
          content: msg.content,
          metadata: {
            ...msg.metadata,
            thought: rawMessage.thought,
            actions: rawMessage.actions,
          },
        });

        const metadata: SimplifiedMessage['metadata'] = {
          thought: rawMessage.thought,
          actions: rawMessage.actions,
        };

        // Add any attachments from transformedMessage.metadata
        if (transformedMessage.metadata && typeof transformedMessage.metadata === 'object') {
          Object.assign(metadata, transformedMessage.metadata);
        }

        return {
          id: msg.id,
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
          authorId: msg.authorId,
          isAgent: msg.sourceType === 'agent_response',
          createdAt: msg.createdAt,
          metadata,
        };
      });

      // Calculate pagination cursors for the response
      const oldestMessage = simplifiedMessages[simplifiedMessages.length - 1];
      const newestMessage = simplifiedMessages[0];

      const response: GetMessagesResponse & {
        cursors?: {
          before?: number; // Timestamp to use for getting older messages
          after?: number; // Timestamp to use for getting newer messages
        };
      } = {
        messages: simplifiedMessages,
        hasMore: messages.length === messageLimit,
      };

      // Add cursor information if we have messages
      if (simplifiedMessages.length > 0) {
        response.cursors = {
          before: oldestMessage?.createdAt.getTime(),
          after: newestMessage?.createdAt.getTime(),
        };
      }

      res.json(response);
    })
  );

  /**
   * Renew a session manually
   * POST /api/messaging/sessions/:sessionId/renew
   */
  router.post(
    '/sessions/:sessionId/renew',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);
```