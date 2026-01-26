# 5e8c73c1:packages_server_src___tests___unit_middleware_middleware.test.ts:301-355

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/middleware/middleware.test.ts:301-355
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      req.method = 'POST';
      (req.get as any).mockImplementation((header: string) => {
        if (header === 'Content-Length') {
          return '0';
        }
        return null;
      });

      const middleware = validateContentTypeMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid content type for POST requests', () => {
      req.method = 'POST';
      (req.get as any).mockImplementation((header: string) => {
        if (header === 'Content-Type') {
          return 'text/plain';
        }
        if (header === 'Content-Length') {
          return '100';
        }
        return null;
      });

      const middleware = validateContentTypeMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_CONTENT_TYPE',
          message: 'Invalid or missing Content-Type header',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should create API rate limit middleware', () => {
      const rateLimit = createApiRateLimit();
      expect(rateLimit).toBeDefined();
      expect(typeof rateLimit).toBe('function');
    });

    it('should create channel validation rate limit middleware', () => {
      const rateLimit = createChannelValidationRateLimit();
      expect(rateLimit).toBeDefined();
      expect(typeof rateLimit).toBe('function');
    });
  });
});
```