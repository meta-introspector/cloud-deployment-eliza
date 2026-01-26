# 5e8c73c1:packages_cli_src_commands_scenario_src_runtime-factory.ts:301-401

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/runtime-factory.ts:301-401
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            metadata: { scenario: true },
          }),
        }
      );
      if (!channelResponse.ok) {
        throw new Error(`Channel creation failed: ${channelResponse.status}`);
      }

      const channelResult = await channelResponse.json();
      channel = channelResult.data;
    }

    // Add agent to channel (safe to call even if already added)
    try {
      await client.messaging.addAgentToChannel(channel.id, agentId as UUID);
    } catch {
      // Agent might already be in channel when reusing - this is expected
    }

    // Only sync MessageBusService cache when creating new channels
    if (!existingChannelId) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await client.messaging.addAgentToChannel(channel.id, agentId as UUID);
      } catch {
        // May already be cached
      }
    }

    // Post a message using the server's expected payload (requires author_id and server_id)
    const postResp = await fetch(
      `http://localhost:${port}/api/messaging/central-channels/${channel.id}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: testUserId,
          content: input,
          message_server_id: defaultMessageServer.id,
          metadata: { scenario: true, user_display_name: 'Scenario User' },
          source_type: 'scenario_message',
        }),
      }
    );
    if (!postResp.ok) {
      const errText = await postResp.text();
      throw new Error(`Post message failed: ${postResp.status} - ${errText}`);
    }

    await postResp.json();

    const startTime = Date.now();
    const pollInterval = 1000;

    const checkForResponse = async (): Promise<{ response: string; roomId: UUID } | null> => {
      const messages = await client.messaging.getChannelMessages(channel.id, { limit: 20 });

      const agentMessages = messages.messages.filter(
        (msg: Message) => msg.authorId === agentId && new Date(msg.createdAt).getTime() > startTime
      );

      if (agentMessages.length > 0) {
        const latestMessage = agentMessages.sort(
          (a: Message, b: Message) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        return { response: latestMessage.content, roomId: channel.id as UUID };
      }

      return null;
    };

    return await new Promise<{ response: string; roomId: UUID }>((resolve, reject) => {
      const poll = async () => {
        try {
          if (Date.now() - startTime >= timeoutMs) {
            reject(new Error('Timeout waiting for agent response'));
            return;
          }

          const result = await checkForResponse();
          if (result) {
            resolve(result);
            return;
          }

          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  } catch (error) {
    throw new Error(
      `Failed to get agent response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
```