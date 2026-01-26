# 5e8c73c1:packages_plugin-sql_src_base.ts:3901-3934

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3901-3934
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          )
        )
        .limit(1);

      if (existingChannels.length > 0) {
        return {
          id: existingChannels[0].id as UUID,
          messageServerId: existingChannels[0].messageServerId as UUID,
          name: existingChannels[0].name,
          type: existingChannels[0].type,
          sourceType: existingChannels[0].sourceType || undefined,
          sourceId: existingChannels[0].sourceId || undefined,
          topic: existingChannels[0].topic || undefined,
          metadata: existingChannels[0].metadata || undefined,
          createdAt: existingChannels[0].createdAt,
          updatedAt: existingChannels[0].updatedAt,
        };
      }

      // Create new DM channel
      return this.createChannel(
        {
          messageServerId,
          name: dmChannelName,
          type: ChannelType.DM,
          metadata: { user1: ids[0], user2: ids[1] },
        },
        ids
      );
    });
  }
}

// Import tables at the end to avoid circular dependencies
```