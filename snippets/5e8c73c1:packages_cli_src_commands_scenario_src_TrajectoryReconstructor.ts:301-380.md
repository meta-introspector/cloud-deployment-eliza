# 5e8c73c1:packages_cli_src_commands_scenario_src_TrajectoryReconstructor.ts:301-380

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/TrajectoryReconstructor.ts:301-380
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      steps.push(observationStep);
      console.log(
        `   👁️ Created observation step from message:`,
        JSON.stringify(observationStep, null, 2)
      );
    }

    // Sort all steps by timestamp (ISO string comparison)
    steps.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return {
      steps,
      runId: runIds.size === 1 ? Array.from(runIds)[0] : undefined,
      startTime,
      endTime,
      totalSteps: steps.length,
    };
  }

  /**
   * Get latest trajectory for a room (convenience method) with retry logic
   */
  async getLatestTrajectory(roomId: UUID): Promise<TrajectoryStep[]> {
    console.log(`🔍 [TrajectoryReconstructor] Starting reconstruction for room: ${roomId}`);

    // Implement retry logic for timing synchronization
    const maxRetries = 3;
    const retryDelayMs = 2000; // 2 seconds between retries

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`\n🔄 [TrajectoryReconstructor] ===== ATTEMPT ${attempt}/${maxRetries} =====`);

      const trajectory = await this.reconstructTrajectory(roomId, 30000);

      console.log(
        `📊 [TrajectoryReconstructor] Found ${trajectory.steps.length} trajectory steps on attempt ${attempt}`
      );
      console.log(
        `📊 [TrajectoryReconstructor] Time window: ${trajectory.startTime} - ${trajectory.endTime}`
      );

      if (trajectory.steps.length > 0) {
        console.log(
          `✅ [TrajectoryReconstructor] SUCCESS on attempt ${attempt}: Found ${trajectory.steps.length} trajectory steps`
        );
        console.log(
          `📊 [TrajectoryReconstructor] Actions found:`,
          trajectory.steps
            .filter((s) => s.type === 'action')
            .map((s) => {
              const content = s.content as Record<string, unknown>;
              return (content.name as string) || 'unknown';
            })
        );
        console.log(
          `📊 [TrajectoryReconstructor] First step sample:`,
          JSON.stringify(trajectory.steps[0], null, 2)
        );
        console.log(`📊 [TrajectoryReconstructor] ===== SUCCESS END =====\n`);
        return trajectory.steps;
      }

      console.log(
        `⚠️ [TrajectoryReconstructor] Attempt ${attempt} found 0 steps. ${attempt < maxRetries ? 'Retrying...' : 'Final attempt failed.'}`
      );

      // Wait before next retry (except on final attempt)
      if (attempt < maxRetries) {
        console.log(`⏳ [TrajectoryReconstructor] Waiting ${retryDelayMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    console.log(
      `❌ [TrajectoryReconstructor] All ${maxRetries} attempts failed - returning empty trajectory`
    );
    console.log(`📊 [TrajectoryReconstructor] ===== FINAL FAILURE =====\n`);
    return [];
  }
}
```