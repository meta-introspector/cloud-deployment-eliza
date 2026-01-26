# 67c3e03b:packages_server_src_api_messaging_channels.ts:1051-1200

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:1051-1200
**Novelty Score:** 14.99
**Concepts:** testing

```
        const newTitle = await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt,
          temperature: 0.3, // Use low temperature for consistent titles
          maxTokens: 50, // Keep titles short
        });

        if (!newTitle || newTitle.trim().length === 0) {
          logger.warn({ src: 'http', channelId }, 'Failed to generate channel title');
          return;
        }

        const cleanTitle = newTitle.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present

        const result = {
          title: cleanTitle,
          channelId,
        };

        logger.success({ src: 'http', channelId, title: cleanTitle }, 'Channel title generated');

        res.json({
          success: true,
          data: result,
        });
      } catch (error) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error summarizing channel'
        );
        res.status(500).json({
          success: false,
          error: 'Failed to summarize channel',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // ============================================================================
  // DEPRECATED ROUTES - For backward compatibility only
  // These routes maintain the old naming (central-channels, central-servers, server_id)
  // and redirect to the new endpoints. They will be removed in a future version.
  // ============================================================================

  /**
   * @deprecated Use POST /channels/:channelId/messages instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.post(
    '/central-channels/:channelId/messages',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] POST /central-channels/:channelId/messages is deprecated. Use POST /channels/:channelId/messages instead.'
      );

      // Parameter mapping handled by middleware, just forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use GET /channels/:channelId/messages instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get(
    '/central-channels/:channelId/messages',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] GET /central-channels/:channelId/messages is deprecated. Use GET /channels/:channelId/messages instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use GET /message-servers/:messageServerId/channels instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get(
    '/central-servers/:serverId/channels',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] GET /central-servers/:serverId/channels is deprecated. Use GET /message-servers/:messageServerId/channels instead.'
      );

      // Forward to new endpoint with parameter rename
      req.url = req.url.replace('/central-servers/', '/message-servers/');
      req.params.messageServerId = req.params.serverId;
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use POST /channels instead (for creating group channels)
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.post(
    '/central-channels',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn('[DEPRECATED] POST /central-channels is deprecated. Use POST /channels instead.');

      // Parameter mapping handled by middleware, just forward to new endpoint
      req.url = '/channels';
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use GET /channels/:channelId/details instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get(
    '/central-channels/:channelId/details',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] GET /central-channels/:channelId/details is deprecated. Use GET /channels/:channelId/details instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use GET /channels/:channelId/participants instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get(
    '/central-channels/:channelId/participants',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] GET /central-channels/:channelId/participants is deprecated. Use GET /channels/:channelId/participants instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use POST /channels/:channelId/agents instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.post(
```