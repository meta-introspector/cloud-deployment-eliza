# 5e8c73c1:packages_server_src_api_messaging_jobs.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/jobs.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            agentId = agents[0].agentId;
            logger.debug(
              { src: 'http', agentId },
              'No agentId provided, using first available agent'
            );
          } else {
            return sendErrorResponse(res, 404, 'No agents available on server');
          }
        }

        // Check if agent exists
        const runtime = elizaOS.getAgent(agentId);
        if (!runtime) {
          return sendErrorResponse(res, 404, `Agent ${agentId} not found`);
        }

        // Calculate timeout
        const requestedTimeoutMs =
          typeof body.timeoutMs === 'number' ? body.timeoutMs : JobValidation.DEFAULT_TIMEOUT_MS;
        const timeoutMs = Math.min(
          JobValidation.MAX_TIMEOUT_MS,
          Math.max(JobValidation.MIN_TIMEOUT_MS, requestedTimeoutMs)
        );

        // Create job ID and channel ID
        const jobId = uuidv4();
        const channelId = uuidv4() as UUID;
        const now = Date.now();

        // Create the job
        const job: Job = {
          id: jobId,
          agentId,
          userId,
          channelId,
          content: body.content,
          status: JobStatus.PENDING,
          createdAt: now,
          expiresAt: now + timeoutMs,
          metadata: body.metadata || {},
        };

        // Store job
        jobs.set(jobId, job);

        logger.info({ src: 'http', jobId, agentId, timeoutMs }, 'Job created');

        // Create a temporary channel for this job
        try {
          await serverInstance.createChannel({
            id: channelId,
            name: `job-${jobId}`,
            type: ChannelType.DM,
            messageServerId: DEFAULT_SERVER_ID,
            metadata: {
              jobId,
              agentId,
              userId,
              isJobChannel: true,
              ...body.metadata,
            },
          });

          // Add agent as participant
          await serverInstance.addParticipantsToChannel(channelId, [agentId]);
        } catch (error) {
          jobs.delete(jobId);
          logger.error(
            { src: 'http', jobId, error: error instanceof Error ? error.message : String(error) },
            'Failed to create job channel'
          );
          return sendErrorResponse(res, 500, 'Failed to create job channel');
        }

        // Update job status to processing
        job.status = JobStatus.PROCESSING;

        // Create and send the user message
        try {
          const userMessage = await serverInstance.createMessage({
            channelId,
            authorId: userId,
            content: body.content,
            rawMessage: {
              content: body.content,
            },
            sourceType: 'job_request',
            metadata: {
              jobId,
              isJobMessage: true,
              ...body.metadata,
            },
          });

          job.userMessageId = userMessage.id;

          // Emit to internal message bus for agent processing
          internalMessageBus.emit('new_message', {
            id: userMessage.id,
            channel_id: channelId,
            message_server_id: DEFAULT_SERVER_ID,
            author_id: userId,
            content: body.content,
            created_at: new Date(userMessage.createdAt).getTime(),
            source_type: 'job_request',
            raw_message: { content: body.content },
            metadata: {
              jobId,
              isJobMessage: true,
              ...body.metadata,
            },
          });

          // Setup listener for agent response
          // Track if we've seen an action execution message and any agent message
          let actionMessageReceived = false;
          let firstAgentMessageReceived = false;

          interface JobMessage {
            id?: UUID;
            channel_id?: UUID;
            author_id?: UUID;
            content?: string;
            created_at?: number;
            metadata?: Record<string, unknown>;
          }

          const responseHandler = async (data: unknown) => {
            // Type guard for message structure
            if (!data || typeof data !== 'object') {
              return;
            }

            const message = data as JobMessage;

            // Validate required fields
            if (
              !message.id ||
              !message.channel_id ||
              !message.author_id ||
              !message.content ||
              !message.created_at
            ) {
              return;
            }

            // Check if this message is the agent's response to our job
            if (
              message.channel_id === channelId &&
              message.author_id === agentId &&
```