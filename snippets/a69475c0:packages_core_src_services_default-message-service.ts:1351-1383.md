# a69475c0:packages_core_src_services_default-message-service.ts:1351-1383

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:1351-1383
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
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