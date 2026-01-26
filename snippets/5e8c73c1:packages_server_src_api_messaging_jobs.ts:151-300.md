# 5e8c73c1:packages_server_src_api_messaging_jobs.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/jobs.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        valid: false,
        error: `timeoutMs cannot exceed ${JobValidation.MAX_TIMEOUT_MS}ms`,
      };
    }
  }

  return { valid: true };
}

/**
 * Extended Router interface with cleanup method
 */
export interface JobsRouter extends express.Router {
  cleanup: () => void;
}

/**
 * Creates the jobs router for one-off messaging
 */
export function createJobsRouter(elizaOS: ElizaOS, serverInstance: AgentServer): JobsRouter {
  const router = express.Router() as JobsRouter;

  // Per-router instance state
  const jobs = new Map<string, Job>();
  let cleanupInterval: NodeJS.Timeout | null = null;
  const listenerCleanupTimeouts = new Map<string, NodeJS.Timeout>();
  const metrics = {
    totalProcessingTimeMs: 0,
    completedJobs: 0,
    failedJobs: 0,
    timeoutJobs: 0,
  };

  // Helpers that close over the instance state
  const cleanupExpiredJobs = (): void => {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [jobId, job] of jobs.entries()) {
      if (
        job.expiresAt < now &&
        (job.status === JobStatus.COMPLETED ||
          job.status === JobStatus.FAILED ||
          job.status === JobStatus.TIMEOUT)
      ) {
        jobs.delete(jobId);
        cleanedCount++;

        const timeout = listenerCleanupTimeouts.get(jobId);
        if (timeout) {
          clearTimeout(timeout);
          listenerCleanupTimeouts.delete(jobId);
        }
      } else if (job.expiresAt < now && job.status === JobStatus.PROCESSING) {
        job.status = JobStatus.TIMEOUT;
        job.error = 'Job timed out waiting for agent response';
        metrics.timeoutJobs++;
        logger.warn({ src: 'http', jobId }, 'Job timed out');
      }
    }

    if (cleanedCount > 0) {
      logger.info({ src: 'http', cleanedCount, currentJobs: jobs.size }, 'Cleaned up expired jobs');
    }

    if (jobs.size > MAX_JOBS_IN_MEMORY) {
      const sortedJobs = Array.from(jobs.entries()).sort(
        ([, a], [, b]) => a.createdAt - b.createdAt
      );
      const toRemove = sortedJobs.slice(0, Math.floor(MAX_JOBS_IN_MEMORY * 0.1));
      toRemove.forEach(([jobId]) => {
        jobs.delete(jobId);
        const timeout = listenerCleanupTimeouts.get(jobId);
        if (timeout) {
          clearTimeout(timeout);
          listenerCleanupTimeouts.delete(jobId);
        }
      });
      logger.warn(
        { src: 'http', removedCount: toRemove.length, currentJobs: jobs.size },
        'Emergency cleanup of oldest jobs'
      );
    }
  };

  const startCleanupInterval = (): void => {
    if (!cleanupInterval) {
      cleanupInterval = setInterval(cleanupExpiredJobs, JOB_CLEANUP_INTERVAL_MS);
    }
  };

  const stopCleanupInterval = (): void => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  };

  // Start cleanup interval when router is created
  startCleanupInterval();

  // Cleanup function for the router
  router.cleanup = () => {
    stopCleanupInterval();

    // Clear all listener cleanup timeouts
    for (const timeout of listenerCleanupTimeouts.values()) {
      clearTimeout(timeout);
    }
    listenerCleanupTimeouts.clear();

    jobs.clear();
  };

  /**
   * Create a new job (one-off message to agent)
   * POST /api/messaging/jobs
   */
  router.post(
    '/jobs',
    apiKeyAuthMiddleware,
    async (req: express.Request, res: express.Response) => {
      try {
        const body = req.body;

        // Validate request with size limits
        const validation = validateCreateJobRequest(body);
        if (!validation.valid) {
          return sendErrorResponse(res, 400, validation.error || 'Invalid request');
        }

        // Validate userId
        const userId = validateUuid(body.userId);
        if (!userId) {
          return sendErrorResponse(res, 400, 'Invalid userId format (must be valid UUID)');
        }

        // Determine agent ID - use provided or first available agent
        let agentId: UUID | null = null;

        if (body.agentId) {
          // Validate provided agentId
          agentId = validateUuid(body.agentId);
          if (!agentId) {
            return sendErrorResponse(res, 400, 'Invalid agentId format (must be valid UUID)');
          }
        } else {
          // Get first available agent
          const agents = elizaOS.getAgents();
          if (agents && agents.length > 0) {
```