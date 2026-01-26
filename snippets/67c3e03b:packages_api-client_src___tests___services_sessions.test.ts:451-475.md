# 67c3e03b:packages_api-client_src___tests___services_sessions.test.ts:451-475

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/api-client/src/__tests__/services/sessions.test.ts:451-475
**Novelty Score:** 14.99
**Concepts:** testing

```
                agentId: 'agent-123',
                userId: 'user-456',
                createdAt: '2024-01-01T00:00:00.000Z',
                lastActivity: '2024-01-01T00:01:00.000Z',
                metadata: {},
              },
            ],
            total: 1,
          },
        }),
      });

      const result = await service.listSessions();

      expect(result.sessions).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });
});
```