# 5e8c73c1:packages_server_src_api_messaging_channels.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/channels.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  router.post(
    '/channels/:channelId/agents',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      const { agentId } = req.body;

      if (!channelId || !validateUuid(agentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid channelId or agentId format',
        });
      }

      try {
        // Verify the channel exists
        const channel = await serverInstance.getChannelDetails(channelId);
        if (!channel) {
          return res.status(404).json({
            success: false,
            error: 'Channel not found',
          });
        }

        // Verify the agent exists (optional - depends on your agent registry)
        // You might want to add a method to check if agent exists in your system

        // Add agent to channel participants
        await serverInstance.addParticipantsToChannel(channelId, [agentId as UUID]);

        res.status(201).json({
          success: true,
          data: {
            channelId,
            agentId,
            message: 'Agent added to channel successfully',
          },
        });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            agentId,
            channelId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error adding agent to channel'
        );
        res.status(500).json({
          success: false,
          error: 'Failed to add agent to channel',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // DELETE /channels/:channelId/agents/:agentId - Remove agent from channel
  router.delete(
    '/channels/:channelId/agents/:agentId',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      const agentId = validateUuid(req.params.agentId);

      if (!channelId || !agentId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid channelId or agentId format',
        });
      }

      try {
        // Verify the channel exists
        const channel = await serverInstance.getChannelDetails(channelId);
        if (!channel) {
          return res.status(404).json({
            success: false,
            error: 'Channel not found',
          });
        }

        // Get current participants to verify agent is in channel
        const currentParticipants = await serverInstance.getChannelParticipants(channelId);
        if (!currentParticipants.includes(agentId)) {
          return res.status(404).json({
            success: false,
            error: 'Agent is not a participant in this channel',
          });
        }

        // Remove agent from channel participants
        // Note: We need to update the channel with the new participant list
        const updatedParticipants = currentParticipants.filter((id) => id !== agentId);
        await serverInstance.updateChannel(channelId, {
          participantCentralUserIds: updatedParticipants,
        });

        res.status(200).json({
          success: true,
          data: {
            channelId,
            agentId,
            message: 'Agent removed from channel successfully',
          },
        });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            agentId,
            channelId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error removing agent from channel'
        );
        res.status(500).json({
          success: false,
          error: 'Failed to remove agent from channel',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // GET /channels/:channelId/agents - List agents in channel
  router.get('/channels/:channelId/agents', async (req: express.Request, res: express.Response) => {
    const channelId = validateUuid(req.params.channelId);

    if (!channelId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid channelId format',
      });
    }

    try {
      // Get all participants
      const allParticipants = await serverInstance.getChannelParticipants(channelId);

      // Filter for agents (this is a simplified approach - you might want to
      // implement a more sophisticated way to distinguish agents from users)
      // For now, we'll return all participants and let the client filter
      // In a production system, you'd want to cross-reference with an agent registry

      res.json({
        success: true,
        data: {
          channelId,
          participants: allParticipants, // All participants (agents and users)
          // TODO: Add agent-specific filtering when agent registry is available
        },
```