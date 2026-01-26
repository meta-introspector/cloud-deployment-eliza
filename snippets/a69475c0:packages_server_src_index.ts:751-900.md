# a69475c0:packages_server_src_index.ts:751-900

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:751-900
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
              agents: isHealthy ? 'healthy' : 'no_agents',
            },
            agentCount: agents.length,
          };

          res.status(isHealthy ? 200 : 503).json(healthcheck);
        }
      );

      // Optional Authentication Middleware
      const serverAuthToken = process.env.ELIZA_SERVER_AUTH_TOKEN;
      logger.info(
        { src: 'http' },
        'Public health check endpoints enabled: /healthz and /health (rate limited: 100 req/min)'
      );

      // Optional Authentication Middleware
      logger.info({ src: 'http' }, 'Configuring authentication middleware...');

      // Active if ELIZA_SERVER_AUTH_TOKEN is configured
      this.app.use('/api', apiKeyAuthMiddleware);

      if (serverAuthToken) {
        logger.info({ src: 'http' }, 'Authentication middleware configured - API Key: ENABLED');
      } else {
        logger.warn(
          { src: 'http' },
          'Authentication middleware configured - API Key: DISABLED (set ELIZA_SERVER_AUTH_TOKEN to enable)'
        );
      }

      // Determine if web UI should be enabled
      this.isWebUIEnabled = isWebUIEnabled();
      if (!this.isWebUIEnabled) {
        logger.info({ src: 'http' }, 'Web UI disabled');
      }

      const uploadsBasePath = getUploadsAgentsDir();
      const generatedBasePath = getGeneratedDir();
      fs.mkdirSync(uploadsBasePath, { recursive: true });
      fs.mkdirSync(generatedBasePath, { recursive: true });

      // Agent-specific media serving - only serve files from agent-specific directories
      this.app.get(
        '/media/uploads/agents/:agentId/:filename',
        (req: express.Request, res: express.Response): void => {
          const agentId = req.params.agentId as string;
          const filename = req.params.filename as string;
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(agentId)) {
            res.status(400).json({ error: 'Invalid agent ID format' });
            return;
          }
          const sanitizedFilename = basename(filename);
          const agentUploadsPath = join(uploadsBasePath, agentId);
          const filePath = join(agentUploadsPath, sanitizedFilename);
          if (!filePath.startsWith(agentUploadsPath)) {
            res.status(403).json({ error: 'Access denied' });
            return;
          }

          if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: 'File does not exist!!!!!!!' });
            return;
          }

          res.sendFile(sanitizedFilename, { root: agentUploadsPath }, (err) => {
            if (err) {
              if (err.message !== 'Request aborted' && !res.headersSent) {
                logger.warn({ src: 'http', agentId, file: sanitizedFilename }, 'File not found');
                res.status(404).json({ error: 'File not found' });
              }
            }
          });
        }
      );

      this.app.get(
        '/media/generated/:agentId/:filename',
        (
          req: express.Request<{ agentId: string; filename: string }>,
          res: express.Response
        ): void => {
          const agentId = req.params.agentId;
          const filename = req.params.filename;
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(agentId)) {
            res.status(400).json({ error: 'Invalid agent ID format' });
            return;
          }
          const sanitizedFilename = basename(filename);
          const agentGeneratedPath = join(generatedBasePath, agentId);
          const filePath = join(agentGeneratedPath, sanitizedFilename);

          if (!filePath.startsWith(agentGeneratedPath)) {
            res.status(403).json({ error: 'Access denied' });
            return;
          }

          // Check if file exists before sending
          if (!existsSync(filePath)) {
            res.status(404).json({ error: 'File not found' });
            return;
          }

          // Make sure path is absolute for sendFile
          const absolutePath = path.resolve(filePath);

          // Use sendFile with proper options (no root needed for absolute paths)
          const options = {
            dotfiles: 'deny' as const,
          };

          res.sendFile(absolutePath, options, (err) => {
            if (err) {
              // Fallback to streaming if sendFile fails (non-blocking)
              const ext = extname(filename).toLowerCase();
              const mimeType =
                ext === '.png'
                  ? 'image/png'
                  : ext === '.jpg' || ext === '.jpeg'
                    ? 'image/jpeg'
                    : 'application/octet-stream';
              res.setHeader('Content-Type', mimeType);
              const stream = fs.createReadStream(absolutePath);
              stream.on('error', () => res.status(404).json({ error: 'File not found' }));
              stream.pipe(res);
            }
          });
        }
      );

      // Channel-specific media serving
      this.app.get(
        '/media/uploads/channels/:channelId/:filename',
        (req: express.Request<{ channelId: string; filename: string }>, res: express.Response) => {
          const channelId = req.params.channelId as string;
          const filename = req.params.filename as string;
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

          if (!uuidRegex.test(channelId)) {
            res.status(400).json({ error: 'Invalid channel ID format' });
            return;
          }

          const sanitizedFilename = basename(filename);
          const channelUploadsPath = join(uploadsBasePath, 'channels', channelId);
          const filePath = join(channelUploadsPath, sanitizedFilename);

          if (!filePath.startsWith(channelUploadsPath)) {
```