# a7046c18:packages_core_typescript_src___tests___action-chaining-simple.test.ts:151-250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/action-chaining-simple.test.ts:151-250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Verify we kept the newest entries
      const cleanedKeys = Object.keys(cleaned);
      expect(cleanedKeys).toContain("action_59");
      expect(cleanedKeys).toContain("action_50");
      expect(cleanedKeys).not.toContain("action_9"); // Old entry should be removed
    });
  });

  describe("Bounds Checking", () => {
    it("should handle updateActionStep with invalid indices", () => {
      // Mock logger
      const warnCalls: string[] = [];
      const mockLogger = {
        warn: (msg: string) => {
          warnCalls.push(msg);
        },
      };

      // Helper function that mimics the runtime's updateActionStep
      const updateActionStep = <T, S>(
        plan: T & { steps: S[] },
        index: number,
        stepUpdates: Partial<S>,
        logger: typeof mockLogger,
      ): T & { steps: S[] } => {
        if (!plan.steps || index < 0 || index >= plan.steps.length) {
          logger.warn(
            `Invalid step index: ${index} for plan with ${plan.steps?.length || 0} steps`,
          );
          return plan;
        }
        return {
          ...plan,
          steps: plan.steps.map((step: S, i: number) =>
            i === index ? { ...step, ...stepUpdates } : step,
          ),
        };
      };

      // Test data
      const plan = {
        name: "test-plan",
        steps: [
          { status: "pending", action: "step1" },
          { status: "pending", action: "step2" },
          { status: "pending", action: "step3" },
        ],
      };

      // Test valid index
      const updated1 = updateActionStep(
        plan,
        1,
        { status: "completed" },
        mockLogger,
      );
      expect(updated1.steps[1].status).toBe("completed");
      expect(warnCalls.length).toBe(0);

      // Test negative index
      const updated2 = updateActionStep(
        plan,
        -1,
        { status: "failed" },
        mockLogger,
      );
      expect(updated2).toBe(plan); // Should return original plan
      expect(warnCalls[0]).toBe("Invalid step index: -1 for plan with 3 steps");

      // Test index out of bounds
      warnCalls.length = 0; // Clear warnings
      const updated3 = updateActionStep(
        plan,
        5,
        { status: "failed" },
        mockLogger,
      );
      expect(updated3).toBe(plan); // Should return original plan
      expect(warnCalls[0]).toBe("Invalid step index: 5 for plan with 3 steps");

      // Test with null steps
      warnCalls.length = 0; // Clear warnings
      const planWithNullSteps: ActionPlan & { name: string } = {
        name: "test",
        thought: "test thought",
        totalSteps: 0,
        currentStep: 0,
        steps: null as unknown as ActionPlan["steps"],
      };
      const updated4 = updateActionStep(
        planWithNullSteps,
        0,
        { status: "completed" },
        mockLogger,
      );
      expect(updated4).toBe(planWithNullSteps);
      expect(warnCalls[0]).toBe("Invalid step index: 0 for plan with 0 steps");
    });
  });
});
```