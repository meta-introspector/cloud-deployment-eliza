# 5e8c73c1:packages_server_src___tests___unit_api_channels-mode.test.ts:451-458

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:451-458
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        { ...validPayload, mode: 'stream' }
      );

      // Stream mode should still set SSE headers even on error
      expect(res.headers['Content-Type']).toBe('text/event-stream');
    });
  });
});
```