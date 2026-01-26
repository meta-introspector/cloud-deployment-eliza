# 5e8c73c1:packages_server_src_socketio_index.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/socketio/index.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              originalId: senderId as string,
              username: senderName || (senderId as string),
              displayName: senderName,
              type: ChannelType.DM,
              isDm: true,
              ...metadata,
            },
            source: 'socketio_message',
          });
        }
      }

      // Ensure the channel exists before creating the message
      // Fetch channel details and servers in parallel for better performance
      const [existingChannel, servers] = await Promise.all([
        this.serverInstance.getChannelDetails(validChannelId).catch(() => null),
        this.serverInstance.getServers(),
      ]);
      const channelExists = !!existingChannel;

      if (!channelExists) {
        // Auto-create the channel if it doesn't exist
        logger.info(
          { src: 'ws', socketId: socket.id, channelId, messageServerId },
          'Auto-creating channel'
        );
        try {
          const serverExists = servers.some((s) => s.id === messageServerId);
          logger.debug(
            {
              src: 'ws',
              socketId: socket.id,
              messageServerId,
              serverExists,
              availableServers: servers.map((s) => s.id),
            },
            'Server existence check'
          );

          if (!serverExists) {
            logger.error(
              { src: 'ws', socketId: socket.id, messageServerId },
              'Server does not exist, cannot create channel'
            );
            this.sendErrorResponse(socket, `Server ${messageServerId} does not exist`);
            return;
          }

          const isDmChannel = metadata?.isDm || metadata?.channelType === ChannelType.DM;

          const channelData = {
            id: validChannelId,
            messageServerId: messageServerId as UUID,
            name: isDmChannel
              ? `DM ${validChannelId.substring(0, 8)}`
              : `Chat ${validChannelId.substring(0, 8)}`,
            type: isDmChannel ? ChannelType.DM : ChannelType.GROUP,
            sourceType: 'auto_created',
            metadata: {
              created_by: 'socketio_auto_creation',
              created_for_user: senderId,
              created_at: new Date().toISOString(),
              channel_type: isDmChannel ? ChannelType.DM : ChannelType.GROUP,
              ...metadata,
            },
          };

          const participants = [senderId as UUID];
          if (isDmChannel) {
            const otherParticipant =
              metadata?.targetUserId || metadata?.recipientId || payload.targetUserId;
            if (otherParticipant && validateUuid(otherParticipant)) {
              participants.push(otherParticipant as UUID);
            }
          }

          await this.serverInstance.createChannel(channelData, participants);
          logger.debug(
            { src: 'ws', socketId: socket.id, channelId, type: isDmChannel ? 'DM' : 'GROUP' },
            'Auto-created channel'
          );
        } catch (createError: unknown) {
          const errorMessage =
            createError instanceof Error ? createError.message : String(createError);
          logger.error(
            { src: 'ws', socketId: socket.id, channelId, error: errorMessage },
            'Failed to auto-create channel'
          );
          this.sendErrorResponse(socket, `Failed to create channel: ${errorMessage}`);
          return;
        }
      }

      const newRootMessageData = {
        channelId: validChannelId,
        authorId: senderId as UUID,
        content: message as string,
        rawMessage: { ...payload },
        metadata: {
          ...(metadata || {}),
          user_display_name: senderName,
          socket_id: socket.id,
          messageServerId: messageServerId as UUID,
          attachments,
        },
        sourceType: source || 'socketio_client',
        sourceId:
          payload.messageId || `socketio-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        inReplyToRootMessageId: undefined,
      };

      const createdRootMessage = await this.serverInstance.createMessage(newRootMessageData);

      // Transform attachments for web client (only if present)
      const transformedAttachments = attachments ? attachmentsToApiUrls(attachments) : undefined;

      // Immediately broadcast the message to all clients in the channel
      const messageBroadcast = {
        id: createdRootMessage.id,
        senderId,
        senderName: senderName || 'User',
        text: message,
        channelId: validChannelId,
        roomId: validChannelId, // Keep for backward compatibility
        messageServerId, // Use messageS erverId at message server layer
        createdAt: new Date(createdRootMessage.createdAt).getTime(),
        source: source || 'socketio_client',
        attachments: transformedAttachments,
      };

      // Broadcast to everyone in the channel except the sender
      socket.to(validChannelId).emit('messageBroadcast', messageBroadcast);

      // Also send back to the sender with the server-assigned ID (if still connected)
      if (socket.connected) {
        socket.emit('messageBroadcast', {
          ...messageBroadcast,
          clientMessageId: payload.messageId,
        });

        socket.emit('messageAck', {
          clientMessageId: payload.messageId,
          messageId: createdRootMessage.id,
          status: 'received_by_server_and_processing',
          channelId,
          roomId: channelId, // Keep for backward compatibility
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
```