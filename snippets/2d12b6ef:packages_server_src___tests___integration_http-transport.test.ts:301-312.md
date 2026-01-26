# 2d12b6ef:packages_server_src___tests___integration_http-transport.test.ts:301-312

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/http-transport.test.ts:301-312
**Novelty Score:** 35.43
**Concepts:** testing

```
        }),
      });

      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.sessionStatus).toBeDefined();
      expect(data.sessionStatus).toHaveProperty('expiresAt');
    });
  });
});
```