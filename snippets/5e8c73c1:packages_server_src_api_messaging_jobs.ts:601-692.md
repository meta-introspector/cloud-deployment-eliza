# 5e8c73c1:packages_server_src_api_messaging_jobs.ts:601-692

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/jobs.ts:601-692
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  /**
   * List all jobs (for debugging/admin)
   * GET /api/messaging/jobs
   * NOTE: Must be defined before /:jobId route to avoid parameter matching
   */
  router.get('/jobs', apiKeyAuthMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const status = req.query.status as JobStatus | undefined;

      let jobList = Array.from(jobs.values());

      // Filter by status if provided
      if (status && Object.values(JobStatus).includes(status)) {
        jobList = jobList.filter((job) => job.status === status);
      }

      // Sort by creation date (newest first)
      jobList.sort((a, b) => b.createdAt - a.createdAt);

      // Limit results
      jobList = jobList.slice(0, limit);

      const response = {
        jobs: jobList.map(jobToResponse),
        total: jobs.size,
        filtered: jobList.length,
      };

      res.json(response);
    } catch (error) {
      logger.error(
        { src: 'http', error: error instanceof Error ? error.message : String(error) },
        'Error listing jobs'
      );
      sendErrorResponse(res, 500, 'Failed to list jobs');
    }
  });

  /**
   * Get job details and status
   * GET /api/messaging/jobs/:jobId
   */
  router.get(
    '/jobs/:jobId',
    apiKeyAuthMiddleware,
    async (req: express.Request, res: express.Response) => {
      try {
        const { jobId } = req.params;

        const job = jobs.get(jobId);
        if (!job) {
          return sendErrorResponse(res, 404, 'Job not found');
        }

        // Check if job has timed out
        if (job.expiresAt < Date.now() && job.status === JobStatus.PROCESSING) {
          job.status = JobStatus.TIMEOUT;
          job.error = 'Job timed out waiting for agent response';
          metrics.timeoutJobs++;
        }

        const response = jobToResponse(job);
        res.json(response);
      } catch (error) {
        logger.error(
          { src: 'http', error: error instanceof Error ? error.message : String(error) },
          'Error getting job'
        );
        sendErrorResponse(res, 500, 'Failed to get job details');
      }
    }
  );

  // Global error handler for unhandled errors in job processing
  router.use(
    (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      logger.error(
        { src: 'http', error: error.message, stack: error.stack },
        'Unhandled error in jobs API'
      );

      // Only respond if headers haven't been sent
      if (!res.headersSent) {
        sendErrorResponse(res, 500, 'Internal server error in jobs API');
      }
    }
  );

  return router;
}
```