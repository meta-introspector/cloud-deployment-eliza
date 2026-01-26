# 5e8c73c1:packages_server_src___tests___unit_middleware_middleware.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/middleware/middleware.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    });
  });

  describe('validateChannelIdMiddleware', () => {
    it('should validate and pass through valid channel ID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      req.params = { channelId: validUuid };

      const middleware = validateChannelIdMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(req.params!.channelId).toBe(validUuid);
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 when channelId is missing', () => {
      req.params = {};

      const middleware = validateChannelIdMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'MISSING_CHANNEL_ID', message: 'Channel ID is required' },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid channel ID and log security event', () => {
      req.params = { channelId: 'invalid-channel-id' };

      const middleware = validateChannelIdMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        { src: 'http', ip: '192.168.1.100', channelId: 'invalid-channel-id' },
        'Failed channel ID validation'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('securityMiddleware', () => {
    it('should set security headers', () => {
      const middleware = securityMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'SAMEORIGIN');
      expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'no-referrer');
      expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
      expect(res.removeHeader).toHaveBeenCalledWith('Server');
      expect(next).toHaveBeenCalled();
    });

    it('should detect suspicious User-Agent patterns', () => {
      (req.get as any).mockImplementation((header: string) => {
        if (header === 'User-Agent') {
          return 'Mozilla/5.0 <script>alert(1)</script>';
        }
        return null;
      });

      const middleware = securityMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        { src: 'http', ip: '192.168.1.100', userAgent: 'Mozilla/5.0 <script>alert(1)</script>' },
        'Suspicious User-Agent detected'
      );
      expect(next).toHaveBeenCalled();
    });

    it('should detect path traversal attempts', () => {
      req.originalUrl = '/api/test/../../../etc/passwd';

      const middleware = securityMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        {
          src: 'http',
          ip: '192.168.1.100',
          url: '/api/test/../../../etc/passwd',
          pattern: 'Path traversal',
        },
        'Suspicious pattern detected'
      );
      expect(next).toHaveBeenCalled();
    });

    it('should detect XSS attempts', () => {
      req.query = { input: '<script>alert(1)</script>' };

      const middleware = securityMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        { src: 'http', ip: '192.168.1.100', url: '/api/test', pattern: 'XSS attempt' },
        'Suspicious pattern detected'
      );
      expect(next).toHaveBeenCalled();
    });

    it('should detect SQL injection patterns', () => {
      req.originalUrl = '/api/test?id=1 UNION SELECT * FROM users';

      const middleware = securityMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        { src: 'http', ip: '192.168.1.100', url: '/api/test?id=1 UNION SELECT * FROM users' },
        'SQL injection pattern detected'
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateContentTypeMiddleware', () => {
    it('should allow valid content types for POST requests', () => {
      req.method = 'POST';
      (req.get as any).mockImplementation((header: string) => {
        if (header === 'Content-Type') {
          return 'application/json';
        }
        if (header === 'Content-Length') {
          return '100';
        }
        return null;
      });

      const middleware = validateContentTypeMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should skip validation for GET requests', () => {
      req.method = 'GET';

      const middleware = validateContentTypeMiddleware();
      middleware(req as express.Request, res as express.Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should skip validation when Content-Length is 0', () => {
```