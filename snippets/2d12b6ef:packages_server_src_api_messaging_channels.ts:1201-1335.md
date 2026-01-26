# 2d12b6ef:packages_server_src_api_messaging_channels.ts:1201-1335

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:1201-1335
**Novelty Score:** 35.43
**Concepts:** testing

```
   */
  router.post(
    '/central-channels/:channelId/agents',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] POST /central-channels/:channelId/agents is deprecated. Use POST /channels/:channelId/agents instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use DELETE /channels/:channelId/agents/:agentId instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.delete(
    '/central-channels/:channelId/agents/:agentId',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] DELETE /central-channels/:channelId/agents/:agentId is deprecated. Use DELETE /channels/:channelId/agents/:agentId instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use GET /channels/:channelId/agents instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get(
    '/central-channels/:channelId/agents',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] GET /central-channels/:channelId/agents is deprecated. Use GET /channels/:channelId/agents instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use DELETE /channels/:channelId/messages/:messageId instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.delete(
    '/central-channels/:channelId/messages/:messageId',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] DELETE /central-channels/:channelId/messages/:messageId is deprecated. Use DELETE /channels/:channelId/messages/:messageId instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use DELETE /channels/:channelId/messages instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.delete(
    '/central-channels/:channelId/messages',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] DELETE /central-channels/:channelId/messages is deprecated. Use DELETE /channels/:channelId/messages instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use PATCH /channels/:channelId instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.patch(
    '/central-channels/:channelId',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] PATCH /central-channels/:channelId is deprecated. Use PATCH /channels/:channelId instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use DELETE /channels/:channelId instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.delete(
    '/central-channels/:channelId',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] DELETE /central-channels/:channelId is deprecated. Use DELETE /channels/:channelId instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  /**
   * @deprecated Use POST /channels/:channelId/generate-title instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.post(
    '/central-channels/:channelId/generate-title',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.warn(
        '[DEPRECATED] POST /central-channels/:channelId/generate-title is deprecated. Use POST /channels/:channelId/generate-title instead.'
      );

      // Forward to new endpoint
      req.url = req.url.replace('/central-channels/', '/channels/');
      return (router as express.Router & { handle: express.RequestHandler }).handle(req, res, next);
    }
  );

  return router;
}
```