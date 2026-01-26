# 5e8c73c1:packages_server_src_api_messaging_jobs.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/jobs.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              message.id !== userMessage.id
            ) {
              const currentJob = jobs.get(jobId);
              if (!currentJob || currentJob.status !== JobStatus.PROCESSING) {
                return;
              }

              // Check if this is an "Executing action" intermediate message
              const isActionMessage = message.content.startsWith('Executing action:');

              if (isActionMessage) {
                // This is an intermediate action message, keep waiting for the actual result
                actionMessageReceived = true;
                firstAgentMessageReceived = true;
                return; // Don't mark as completed yet
              }

              // Complete the job only if:
              // 1. This is the first non-action message and we haven't received an action message yet (direct response), OR
              // 2. We previously received an action message and this is a non-action message (result after action)
              const shouldComplete = !firstAgentMessageReceived || actionMessageReceived;

              if (shouldComplete) {
                const processingTime = Date.now() - currentJob.createdAt;

                currentJob.status = JobStatus.COMPLETED;
                currentJob.agentResponseId = message.id;
                currentJob.result = {
                  message: {
                    id: message.id,
                    content: message.content,
                    authorId: message.author_id,
                    createdAt: message.created_at,
                    metadata: message.metadata,
                  },
                  processingTimeMs: processingTime,
                };

                // Update metrics
                metrics.completedJobs++;
                metrics.totalProcessingTimeMs += processingTime;

                logger.info(
                  {
                    src: 'http',
                    jobId,
                    responseType: actionMessageReceived ? 'action_result' : 'direct',
                    processingTimeMs: processingTime,
                  },
                  'Job completed'
                );

                // Remove listener after receiving final response
                internalMessageBus.off('new_message', responseHandler);

                // Clear the cleanup timeout since we're done
                const cleanupTimeout = listenerCleanupTimeouts.get(jobId);
                if (cleanupTimeout) {
                  clearTimeout(cleanupTimeout);
                  listenerCleanupTimeouts.delete(jobId);
                }
              } else {
                // This is an intermediate non-action message, keep waiting
                firstAgentMessageReceived = true;
              }
            }
          };

          // Listen for agent response
          internalMessageBus.on('new_message', responseHandler);

          // Set timeout to cleanup listener with better buffer
          // Use constant max timeout to prevent CodeQL resource exhaustion alert
          const cleanupTimeout = setTimeout(() => {
            internalMessageBus.off('new_message', responseHandler);
            listenerCleanupTimeouts.delete(jobId);
          }, ABSOLUTE_MAX_LISTENER_TIMEOUT_MS);

          listenerCleanupTimeouts.set(jobId, cleanupTimeout);
        } catch (error) {
          job.status = JobStatus.FAILED;
          job.error = 'Failed to create user message';
          metrics.failedJobs++;
          logger.error(
            { src: 'http', jobId, error: error instanceof Error ? error.message : String(error) },
            'Failed to create message for job'
          );
        }

        const response: CreateJobResponse = {
          jobId,
          status: job.status,
          createdAt: job.createdAt,
          expiresAt: job.expiresAt,
        };

        res.status(201).json(response);
      } catch (error) {
        logger.error(
          { src: 'http', error: error instanceof Error ? error.message : String(error) },
          'Error creating job'
        );
        sendErrorResponse(res, 500, 'Failed to create job');
      }
    }
  );

  /**
   * Health check endpoint with enhanced metrics
   * GET /api/messaging/jobs/health
   * NOTE: Must be defined before /:jobId route to avoid parameter matching
   */
  router.get('/jobs/health', (_req: express.Request, res: express.Response) => {
    const now = Date.now();
    const statusCounts = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      timeout: 0,
    };

    for (const job of jobs.values()) {
      statusCounts[job.status]++;
    }

    // Calculate metrics
    const totalCompleted = metrics.completedJobs + metrics.failedJobs + metrics.timeoutJobs;
    const averageProcessingTimeMs =
      metrics.completedJobs > 0 ? metrics.totalProcessingTimeMs / metrics.completedJobs : 0;
    const successRate = totalCompleted > 0 ? metrics.completedJobs / totalCompleted : 0;
    const failureRate = totalCompleted > 0 ? metrics.failedJobs / totalCompleted : 0;
    const timeoutRate = totalCompleted > 0 ? metrics.timeoutJobs / totalCompleted : 0;

    const response: JobHealthResponse = {
      healthy: true,
      timestamp: now,
      totalJobs: jobs.size,
      statusCounts,
      metrics: {
        averageProcessingTimeMs: Math.round(averageProcessingTimeMs),
        successRate: Math.round(successRate * 100) / 100,
        failureRate: Math.round(failureRate * 100) / 100,
        timeoutRate: Math.round(timeoutRate * 100) / 100,
      },
      maxJobs: MAX_JOBS_IN_MEMORY,
    };

    res.json(response);
  });
```