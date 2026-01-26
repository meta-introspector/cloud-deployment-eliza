# 2d12b6ef:packages_server_src_index.ts:601-750

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:601-750
**Novelty Score:** 35.43
**Concepts:** testing

```
            dsn: sentryDsn,
            environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
            integrations: [Sentry.vercelAIIntegration({ force: sentryEnabled })],
            tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
          });
        } catch (sentryInitError) {
          logger.error({ src: 'http', error: sentryInitError }, 'Failed to initialize Sentry');
        }
      }

      // Security headers first - before any other middleware
      const isProd = process.env.NODE_ENV === 'production';
      this.app.use(
        helmet({
          // Content Security Policy - environment-aware configuration
          contentSecurityPolicy: isProd
            ? {
                // Production CSP - includes upgrade-insecure-requests
                directives: {
                  defaultSrc: ["'self'"],
                  styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                  // this should probably be unlocked too
                  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                  imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
                  fontSrc: ["'self'", 'https:', 'data:'],
                  connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
                  mediaSrc: ["'self'", 'blob:', 'data:'],
                  objectSrc: ["'none'"],
                  frameSrc: [this.isWebUIEnabled ? "'self'" : "'none'"],
                  baseUri: ["'self'"],
                  formAction: ["'self'"],
                  // upgrade-insecure-requests is added by helmet automatically
                },
                useDefaults: true,
              }
            : {
                // Development CSP - minimal policy without upgrade-insecure-requests
                directives: {
                  defaultSrc: ["'self'"],
                  styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
                  // unlocking this, so plugin can include the various frameworks from CDN if needed
                  // https://cdn.tailwindcss.com and https://cdn.jsdelivr.net should definitely be unlocked as a minimum
                  scriptSrc: ['*', "'unsafe-inline'", "'unsafe-eval'"],
                  imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
                  fontSrc: ["'self'", 'https:', 'http:', 'data:'],
                  connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
                  mediaSrc: ["'self'", 'blob:', 'data:'],
                  objectSrc: ["'none'"],
                  frameSrc: ["'self'", 'data:'],
                  baseUri: ["'self'"],
                  formAction: ["'self'"],
                  // Note: upgrade-insecure-requests is intentionally omitted for Safari compatibility
                },
                useDefaults: false,
              },
          // Cross-Origin Embedder Policy - disabled for compatibility
          crossOriginEmbedderPolicy: false,
          // Cross-Origin Resource Policy
          crossOriginResourcePolicy: { policy: 'cross-origin' },
          // Frame Options - allow same-origin iframes to align with frameSrc CSP
          frameguard: { action: 'sameorigin' },
          // Hide Powered-By header
          hidePoweredBy: true,
          // HTTP Strict Transport Security - only in production
          hsts: isProd
            ? {
                maxAge: 31536000, // 1 year
                includeSubDomains: true,
                preload: true,
              }
            : false,
          // No Sniff
          noSniff: true,
          // Referrer Policy
          referrerPolicy: { policy: 'no-referrer-when-downgrade' },
          // X-XSS-Protection
          xssFilter: true,
        })
      );

      // Apply custom middlewares if provided
      if (config?.middlewares) {
        for (const middleware of config.middlewares) {
          this.app.use(middleware);
        }
      }

      // Setup middleware for all requests
      this.app.use(
        cors({
          origin: process.env.CORS_ORIGIN || true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
        })
      ); // Enable CORS
      this.app.use(
        express.json({
          limit: process.env.EXPRESS_MAX_PAYLOAD || '2mb',
        })
      ); // Parse JSON bodies with 2MB limit to support large character files

      // File uploads are now handled by individual routes using multer
      // No global file upload middleware needed

      // Public health check endpoints (before authentication middleware)
      // These endpoints are intentionally unauthenticated for load balancer health checks

      // Simple rate limiting for public health endpoints (max 100 requests per minute per IP)
      const healthCheckRateLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many health check requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
          // Skip rate limiting for internal/private IPs (Docker, Kubernetes)
          const ip = req.ip || '';
          return (
            ip === '127.0.0.1' ||
            ip === '::1' ||
            ip.startsWith('10.') ||
            ip.startsWith('172.') ||
            ip.startsWith('192.168.')
          );
        },
      });

      // Lightweight health check - always returns 200 OK
      this.app.get(
        '/healthz',
        healthCheckRateLimiter,
        (_req: express.Request, res: express.Response) => {
          res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
          });
        }
      );

      // Comprehensive health check - returns 200 if healthy, 503 if no agents
      // Response format matches /api/server/health for consistency
      this.app.get(
        '/health',
        healthCheckRateLimiter,
        (_req: express.Request, res: express.Response) => {
          const agents = this.elizaOS?.getAgents() || [];
          const isHealthy = agents.length > 0;

          const healthcheck = {
```