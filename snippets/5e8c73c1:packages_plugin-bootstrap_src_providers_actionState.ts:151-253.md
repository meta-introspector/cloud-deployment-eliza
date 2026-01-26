# 5e8c73c1:packages_plugin-bootstrap_src_providers_actionState.ts:151-253

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/actionState.ts:151-253
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      memoryText = addHeader('# Working Memory', memoryEntries);
    }

    // Get recent action result memories from the database
    let recentActionMemories: Memory[] = [];
    try {
      // Get messages with type 'action_result' from the room
      const recentMessages = await runtime.getMemories({
        tableName: 'messages',
        roomId: message.roomId,
        count: 20,
        unique: false,
      });

      recentActionMemories = recentMessages.filter(
        (msg) => msg.content?.type === 'action_result' && msg.metadata?.type === 'action_result'
      );
    } catch (error) {
      logger?.error(
        {
          src: 'plugin:bootstrap:provider:action_state',
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to retrieve action memories'
      );
    }

    // Format recent action memories
    let actionMemoriesText = '';
    if (recentActionMemories.length > 0) {
      // Group by runId using Map
      const groupedByRun = new Map<string, Memory[]>();

      for (const mem of recentActionMemories) {
        const runId: string = String(mem.content?.runId || 'unknown');
        if (!groupedByRun.has(runId)) {
          groupedByRun.set(runId, []);
        }
        const memories = groupedByRun.get(runId);
        if (memories) {
          memories.push(mem);
        }
      }

      const formattedMemories = Array.from(groupedByRun.entries())
        .map(([runId, memories]) => {
          const sortedMemories = memories.sort(
            (a: Memory, b: Memory) => (a.createdAt || 0) - (b.createdAt || 0)
          );

          const runText = sortedMemories
            .map((mem: Memory) => {
              const actionName = mem.content?.actionName || 'Unknown';
              const status = mem.content?.actionStatus || 'unknown';
              const planStep = mem.content?.planStep || '';
              const text = mem.content?.text || '';

              let memText = `  - ${actionName} (${status})`;
              if (planStep) {
                memText += ` [${planStep}]`;
              }
              if (text && text !== `Executed action: ${actionName}`) {
                memText += `: ${text}`;
              }

              return memText;
            })
            .join('\n');

          const thought = sortedMemories[0]?.content?.planThought || '';
          return `**Run ${runId.slice(0, 8)}**${thought ? ` - ${thought}` : ''}\n${runText}`;
        })
        .join('\n\n');

      actionMemoriesText = addHeader('# Recent Action History', formattedMemories);
    }

    // Combine all text sections
    const allText = [planText, resultsText, memoryText, actionMemoriesText]
      .filter(Boolean)
      .join('\n\n');

    return {
      data: {
        actionResults,
        actionPlan,
        workingMemory,
        recentActionMemories,
      },
      values: {
        hasActionResults: actionResults.length > 0,
        hasActionPlan: !!actionPlan,
        currentActionStep: actionPlan?.currentStep || 0,
        totalActionSteps: actionPlan?.totalSteps || 0,
        actionResults: resultsText,
        completedActions: actionResults.filter((r) => r.success).length,
        failedActions: actionResults.filter((r) => !r.success).length,
      },
      text: allText || 'No action state available',
    };
  },
};
```