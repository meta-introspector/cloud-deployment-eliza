# 5e8c73c1:packages_cli_src_commands_scenario_src_TrajectoryReconstructor.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/TrajectoryReconstructor.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Non-Invasive Trajectory Reconstruction (Ticket #5785)
 *
 * This service reconstructs agent trajectory from existing database logs
 * and memories WITHOUT modifying the core runtime.
 */

import { IAgentRuntime, UUID, Memory } from '@elizaos/core';

/**
 * Agent trajectory step (matching GitHub ticket #5785 specification)
 */
export interface TrajectoryStep {
  /** Step type: 'thought', 'action', or 'observation' */
  type: 'thought' | 'action' | 'observation';

  /** ISO timestamp string */
  timestamp: string;

  /** Step content based on type */
  content:
    | string
    | {
        name: string;
        parameters: Record<string, unknown>;
      }
    | Record<string, unknown>;
}

export interface ReconstructedTrajectory {
  steps: TrajectoryStep[];
  runId?: UUID;
  startTime: number;
  endTime: number;
  totalSteps: number;
}

export class TrajectoryReconstructor {
  private runtime: IAgentRuntime;

  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
  }

  /**
   * Reconstruct trajectory from memories (using same approach as TrajectoryContainsActionEvaluator)
   */
  async reconstructTrajectory(
    roomId: UUID,
    timeWindowMs: number = 30000 // 30 second window
  ): Promise<ReconstructedTrajectory> {
    const endTime = Date.now();
    const startTime = endTime - timeWindowMs;

    // Get memories using EXACT same query as working TrajectoryContainsActionEvaluator
    // Note: evaluator gets ALL memories first, then filters by roomId - not in query
    const allMemories = await this.runtime.getMemories({
      tableName: 'messages',
      agentId: this.runtime.agentId,
      count: 100,
      unique: false,
    });

    console.log(`\n🔍 [TrajectoryReconstructor] ===== MEMORY ANALYSIS START =====`);
    console.log(
      `🔍 [TrajectoryReconstructor] Found ${allMemories.length} total memories for agent`
    );

    // DEBUG: Show all roomIds from memories to identify mismatch
    console.log(`🔍 [TrajectoryReconstructor] All roomIds found in memories:`);
    const uniqueRoomIds = [...new Set(allMemories.map((m) => m.roomId).filter(Boolean))];
    uniqueRoomIds.forEach((rId, i) => {
      const count = allMemories.filter((m) => m.roomId === rId).length;
      console.log(`   ${i + 1}. ${rId} (${count} memories)`);
    });
    console.log(`🔍 [TrajectoryReconstructor] Original roomId: ${roomId}`);

    // FIX: Use the roomId that actually has memories, not the one passed in
    // This fixes the fundamental mismatch between API roomId and stored memory roomId
    const actualRoomId = uniqueRoomIds.length > 0 ? uniqueRoomIds[0] : roomId;
    if (actualRoomId !== roomId) {
      console.log(
        `🔧 [TrajectoryReconstructor] ROOMID MISMATCH DETECTED - Using actual roomId: ${actualRoomId}`
      );
    }

    // Filter by ACTUAL roomId where memories are stored
    const memories = allMemories.filter((mem) => mem && mem.roomId === actualRoomId);
    console.log(
      `🔍 [TrajectoryReconstructor] Found ${memories.length} memories using actual roomId`
    );

    // Log ALL memories to understand what we have available
    memories.forEach((mem, index) => {
      console.log(`\n--- Memory ${index + 1}/${memories.length} ---`);
      console.log(`ID: ${mem.id}`);
      console.log(`CreatedAt: ${mem.createdAt} (${new Date(mem.createdAt || 0).toISOString()})`);
      const memWithType = mem as Memory & { type?: string };
      console.log(`Type: ${memWithType.type || 'undefined'}`);
      console.log(`Content Type: ${typeof mem.content}`);

      if (mem.content && typeof mem.content === 'object' && mem.content !== null) {
        const contentObj = mem.content as Record<string, unknown>;
        console.log(`Content.type: ${contentObj.type || 'undefined'}`);
        console.log(`Content keys:`, Object.keys(contentObj));

        // Log full content for action results (this is what works in evaluator)
        if (contentObj.type === 'action_result') {
          console.log(
            `🎯 FOUND ACTION_RESULT - FULL CONTENT:`,
            JSON.stringify(mem.content, null, 2)
          );
        } else if (contentObj.type === 'user' || contentObj.type === 'agent') {
          console.log(
            `💬 MESSAGE CONTENT:`,
            JSON.stringify(
              {
                type: contentObj.type,
                text: contentObj.text,
                content: contentObj.content,
              },
              null,
              2
            )
          );
        } else {
          console.log(`📋 OTHER CONTENT:`, JSON.stringify(mem.content, null, 2));
        }
      } else {
        console.log(`Raw Content:`, mem.content);
      }
    });

    console.log(`🔍 [TrajectoryReconstructor] ===== MEMORY ANALYSIS END =====\n`);

    // Use same filtering as the working evaluator for action_result memories
    const actionMemories = memories.filter((mem) => {
      if (!mem || typeof mem.content !== 'object' || mem.content === null) {
        return false;
      }
      const contentObj = mem.content as Record<string, unknown>;
      return contentObj.type === 'action_result';
    });

    // NEW: Also handle message memories for conversation scenarios
    const messageMemories = memories.filter((mem) => {
      if (!mem || typeof mem.content !== 'object' || mem.content === null) {
        return false;
      }
      const contentObj = mem.content as Record<string, unknown>;
```