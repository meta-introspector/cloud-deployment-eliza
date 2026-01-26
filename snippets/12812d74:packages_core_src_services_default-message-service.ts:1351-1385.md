# 12812d74:packages_core_src_services_default-message-service.ts:1351-1385

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:1351-1385
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
      // Delete each message memory
      let deletedCount = 0;
      for (const memory of memories) {
        if (memory.id) {
          try {
            await runtime.deleteMemory(memory.id);
            deletedCount++;
          } catch (error) {
            runtime.logger.warn(
              { src: 'service:message', error, memoryId: memory.id },
              'Failed to delete message memory'
            );
          }
        }
      }

      runtime.logger.info(
        {
          src: 'service:message',
          agentId: runtime.agentId,
          channelId,
          deletedCount,
          totalCount: memories.length,
        },
        'Cleared message memories from channel'
      );
    } catch (error: unknown) {
      runtime.logger.error(
        { src: 'service:message', agentId: runtime.agentId, error },
        'Error in clearChannel'
      );
      throw error;
    }
  }
}
```