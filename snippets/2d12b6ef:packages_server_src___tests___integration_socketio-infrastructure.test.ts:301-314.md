# 2d12b6ef:packages_server_src___tests___integration_socketio-infrastructure.test.ts:301-314

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/socketio-infrastructure.test.ts:301-314
**Novelty Score:** 35.43
**Concepts:** testing

```
      // If we get here, subscription was successful
    });

    it('should unsubscribe from log stream', async () => {
      await clientFixture1.connect();

      // Subscribe first
      await clientFixture1.subscribeToLogs();

      // Then unsubscribe
      await clientFixture1.unsubscribeFromLogs();
    });
  });
});
```