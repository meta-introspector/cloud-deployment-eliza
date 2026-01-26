# a69475c0:packages_server_src_index.ts:1051-1200

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:1051-1200
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
                  const versions = fs.readdirSync(nvmPath);
                  for (const version of versions) {
                    const cliPath = path.join(
                      nvmPath,
                      version,
                      'lib/node_modules/@elizaos/server/dist/client'
                    );
                    if (existsSync(path.join(cliPath, 'index.html'))) {
                      return cliPath;
                    }
                  }
                }
              } catch {
                // Ignore errors
              }
              return null;
            })(),
          ].filter(Boolean),
        ].filter(Boolean);

        for (const possiblePath of possiblePaths) {
          if (possiblePath && existsSync(path.join(possiblePath, 'index.html'))) {
            clientPath = possiblePath;
            break;
          }
        }

        if (clientPath) {
          this.clientPath = clientPath;
          this.app.use(express.static(clientPath, staticOptions));
          logger.info({ src: 'http', clientPath }, 'Serving static files');
        } else {
          logger.warn(
            { src: 'http' },
            'Client dist not found - web UI unavailable. Build client and server to fix.'
          );
        }
      }

      // *** NEW: Mount the plugin route handler BEFORE static serving ***
      const pluginRouteHandler = createPluginRouteHandler(this.elizaOS!);
      this.app.use(pluginRouteHandler);

      // Mount the core API router under /api
      // This router handles all API endpoints including:
      // - /api/agents/* - Agent management and interactions
      // - /api/messaging/* - Message handling and channels
      // - /api/media/* - File uploads and media serving
      // - /api/memory/* - Memory management and retrieval
      // - /api/audio/* - Audio processing and transcription
      // - /api/server/* - Runtime and server management
      // - /api/tee/* - TEE (Trusted Execution Environment) operations
      // - /api/system/* - System configuration and health checks
      const apiRouter = createApiRouter(this.elizaOS!, this);
      this.app.use(
        '/api',
        apiRouter,
        (err: unknown, req: Request, res: Response, _next: express.NextFunction) => {
          // Capture error with Sentry if configured
          if (sentryDsn && err instanceof Error) {
            Sentry.captureException(err, (scope) => {
              scope.setTag('route', req.path);
              scope.setContext('request', {
                method: req.method,
                path: req.path,
                query: req.query,
              });
              return scope;
            });
          }
          const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
          const errorCode = ((): number => {
            if (err && typeof err === 'object' && 'code' in err) {
              const code = (err as Record<string, unknown>).code;
              return typeof code === 'number' ? code : 500;
            }
            return 500;
          })();
          logger.error(
            { src: 'http', error: errorMessage, method: req.method, path: req.path },
            'API error'
          );
          res.status(500).json({
            success: false,
            error: {
              message: errorMessage,
              code: errorCode,
            },
          });
        }
      );

      // Global process-level handlers to capture unhandled errors (if Sentry enabled)
      if (sentryDsn) {
        process.on('uncaughtException', (error) => {
          try {
            Sentry.captureException(error, (scope) => {
              scope.setTag('type', 'uncaughtException');
              return scope;
            });
          } catch {}
        });
        process.on('unhandledRejection', (reason: unknown) => {
          try {
            Sentry.captureException(
              reason instanceof Error ? reason : new Error(String(reason)),
              (scope) => {
                scope.setTag('type', 'unhandledRejection');
                return scope;
              }
            );
          } catch {}
        });
      }

      // Add a catch-all route for API 404s
      this.app.use((_req, res, next) => {
        // Check if this is an API route that wasn't handled
        if (_req.path.startsWith('/api/')) {
          // worms are going to hitting it all the time, use a reverse proxy if you need this type of logging
          //logger.warn(`API 404: ${_req.method} ${_req.path}`);
          res.status(404).json({
            success: false,
            error: {
              message: 'API endpoint not found',
              code: 404,
            },
          });
        } else {
          // Not an API route, continue to next middleware
          next();
        }
      });

      // Main fallback for the SPA - must be registered after all other routes
      // Use a final middleware that handles all unmatched routes
      if (this.isWebUIEnabled) {
        this.app.use((req: express.Request, res: express.Response) => {
          // For JavaScript requests that weren't handled by static middleware,
          // return a JavaScript response instead of HTML
          if (
            req.path.endsWith('.js') ||
            req.path.includes('.js?') ||
            req.path.match(/\/[a-zA-Z0-9_-]+-[A-Za-z0-9]{8}\.js/)
          ) {
            res.setHeader('Content-Type', 'application/javascript');
            return res.status(404).send(`// JavaScript module not found: ${req.path}`);
          }

          // For all other routes, serve the SPA's index.html
```