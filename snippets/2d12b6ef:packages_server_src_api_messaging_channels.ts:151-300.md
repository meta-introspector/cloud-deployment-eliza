# 2d12b6ef:packages_server_src_api_messaging_channels.ts:151-300

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:151-300
**Novelty Score:** 35.43
**Concepts:** testing

```
          serverInstance.getServers(),
        ]);
        const channelExists = !!existingChannel;

        if (!channelExists) {
          // Auto-create the channel if it doesn't exist
          logger.info(
            { src: 'http', channelId: channelIdParam, messageServerId: message_server_id },
            'Auto-creating channel'
          );
          try {
            // First verify the server exists
            const serverExists = servers.some((s) => s.id === message_server_id);
            logger.debug(
              {
                src: 'http',
                messageServerId: message_server_id,
                serverExists,
                availableServers: servers.map((s) => s.id),
              },
              'Server existence check'
            );

            if (!serverExists) {
              logger.error(
                { src: 'http', messageServerId: message_server_id },
                'Server does not exist, cannot create channel'
              );
              return res
                .status(500)
                .json({ success: false, error: `Server ${message_server_id} does not exist` });
            }

            // Determine if this is likely a DM based on the context
            const isDmChannel =
              metadata?.isDm ||
              metadata?.channelType === ChannelType.DM ||
              metadata?.channel_type === ChannelType.DM;

            const channelData = {
              id: channelIdParam as UUID, // Use the specific channel ID from the URL
              messageServerId: message_server_id as UUID,
              name: isDmChannel
                ? `DM ${channelIdParam.substring(0, 8)}`
                : `Chat ${channelIdParam.substring(0, 8)}`,
              type: isDmChannel ? ChannelType.DM : ChannelType.GROUP,
              sourceType: 'auto_created',
              metadata: {
                created_by: 'gui_auto_creation',
                created_for_user: author_id,
                created_at: new Date().toISOString(),
                channel_type: isDmChannel ? ChannelType.DM : ChannelType.GROUP,
                ...metadata,
              },
            };

            // For DM channels, we need to determine the participants
            const participants = [author_id as UUID];
            if (isDmChannel) {
              // Try to extract the other participant from metadata
              const otherParticipant = metadata?.targetUserId || metadata?.recipientId;
              if (otherParticipant && validateUuid(otherParticipant)) {
                participants.push(otherParticipant as UUID);
              } else {
                logger.warn(
                  { src: 'http', channelId: channelIdParam, authorId: author_id },
                  'DM channel missing second participant'
                );
              }
            }

            await serverInstance.createChannel(channelData, participants);
            logger.info(
              {
                src: 'http',
                channelId: channelIdParam,
                type: isDmChannel ? ChannelType.DM : ChannelType.GROUP,
                participantCount: participants.length,
              },
              'Auto-created channel'
            );
          } catch (createError: unknown) {
            const errorMessage =
              createError instanceof Error ? createError.message : String(createError);
            logger.error(
              { src: 'http', channelId: channelIdParam, error: errorMessage },
              'Failed to auto-create channel'
            );
            return res
              .status(500)
              .json({ success: false, error: `Failed to create channel: ${errorMessage}` });
          }
        }

        const newRootMessageData = {
          channelId: channelIdParam,
          authorId: author_id as UUID,
          content: content as string,
          inReplyToRootMessageId: in_reply_to_message_id
            ? validateUuid(in_reply_to_message_id) || undefined
            : undefined,
          rawMessage: raw_message,
          metadata,
          sourceType: source_type || 'eliza_gui',
        };

        const createdRootMessage = await serverInstance.createMessage(newRootMessageData);

        if (!createdRootMessage.id) {
          throw new Error('Created message does not have an ID');
        }

        const messageForBus: MessageService = {
          id: createdRootMessage.id,
          channel_id: createdRootMessage.channelId,
          message_server_id: message_server_id as UUID,
          author_id: createdRootMessage.authorId,
          content: createdRootMessage.content,
          created_at: new Date(createdRootMessage.createdAt).getTime(),
          source_type: createdRootMessage.sourceType,
          raw_message: createdRootMessage.rawMessage,
          metadata: createdRootMessage.metadata,
          author_display_name: metadata?.user_display_name, // Get from GUI payload
          in_reply_to_message_id: createdRootMessage.inReplyToRootMessageId,
          source_id: createdRootMessage.sourceId, // Will be undefined here, which is fine
        };

        // Build Memory object for elizaOS.handleMessage
        const messageMemory = {
          entityId: author_id as UUID,
          roomId: channelIdParam,
          content: { text: content },
          metadata: {
            ...metadata,
            messageServerId: message_server_id,
            channelId: channelIdParam,
          },
        };

        // Get target agent from channel participants or metadata
        const participants = await serverInstance.getChannelParticipants(channelIdParam);
        const agentId = participants.find((p) => p !== author_id) || metadata?.targetAgentId;

        if (!agentId) {
          return res.status(400).json({
            success: false,
            error: 'No agent found in channel participants',
          });
        }

```