# 67c3e03b:packages_server_src_api_messaging_channels.ts:901-1050

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:901-1050
**Novelty Score:** 14.99
**Concepts:** testing

```
      }
      res.status(204).send();
    } catch (error) {
      logger.error(
        { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
        'Error deleting channel'
      );
      res.status(500).json({ success: false, error: 'Failed to delete channel' });
    }
  });

  // Upload media to channel
  router.post(
    '/channels/:channelId/upload-media',
    createUploadRateLimit(),
    createFileSystemRateLimit(),
    channelUploadMiddleware.single('file'),
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      if (!channelId) {
        res.status(400).json({ success: false, error: 'Invalid channelId format' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, error: 'No media file provided' });
        return;
      }

      try {
        // Additional filename security validation
        if (
          !req.file.originalname ||
          req.file.originalname.includes('..') ||
          req.file.originalname.includes('/')
        ) {
          res.status(400).json({ success: false, error: 'Invalid filename detected' });
          return;
        }

        // Save the uploaded file
        const result = await saveChannelUploadedFile(req.file, channelId);

        logger.info({ src: 'http', channelId, filename: result.filename }, 'File uploaded');

        res.json({
          success: true,
          data: {
            url: result.url, // Relative URL, client prepends server origin
            type: req.file.mimetype,
            filename: result.filename,
            originalName: req.file.originalname,
            size: req.file.size,
          },
        });
      } catch (error: unknown) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error processing media upload'
        );
        res.status(500).json({ success: false, error: 'Failed to process media upload' });
      }
    }
  );

  router.post(
    '/channels/:channelId/generate-title',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      const { agentId } = req.body;

      if (!channelId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid channel ID format',
        });
      }

      if (!agentId || !validateUuid(agentId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid agent ID is required',
        });
      }

      try {
        const runtime = elizaOS.getAgent(agentId);

        if (!runtime) {
          return res.status(404).json({
            success: false,
            error: 'Agent not found or not active',
          });
        }

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 50;
        const before = req.query.before
          ? Number.parseInt(req.query.before as string, 10)
          : undefined;
        const beforeDate = before ? new Date(before) : undefined;

        const messages = await serverInstance.getMessagesForChannel(channelId, limit, beforeDate);

        if (!messages || messages.length < 4) {
          return res.status(200).json({
            success: true,
            data: {
              title: null,
              channelId,
              reason: 'Not enough messages to generate a title',
            },
          });
        }

        const recentMessages = messages
          .reverse() // Show in chronological order
          .map((msg) => {
            const isUser = msg.authorId !== runtime.agentId;
            const role = isUser ? 'User' : 'Agent';
            return `${role}: ${msg.content}`;
          })
          .join('\n');

        const prompt = composePromptFromState({
          state: {
            recentMessages,
            values: {},
            data: {},
            text: recentMessages,
          },
          template: `
Based on the conversation below, generate a short, descriptive title for this chat. The title should capture the main topic or theme of the discussion.
Rules:
- Keep it concise (3-6 words)
- Make it descriptive and specific
- Avoid generic terms like "Chat" or "Conversation"
- Focus on the main topic, activity, or subject matter
- Use natural language, not hashtags or symbols
Examples:
- "React Component Help"
- "Weekend Trip Planning"
- "Database Design Discussion"
- "Recipe Exchange"
- "Career Advice Session"
Recent conversation:
{{recentMessages}}
Respond with just the title, nothing else.
            `,
        });

```