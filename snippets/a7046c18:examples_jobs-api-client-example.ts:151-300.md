# a7046c18:examples_jobs-api-client-example.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-client-example.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  const questions = ["What is Bitcoin?", "What is Ethereum?", "What is DeFi?"];

  try {
    // Create all jobs
    const jobPromises = questions.map((question) =>
      client.jobs.create({
        userId,
        content: question,
      }),
    );

    const jobs = await Promise.all(jobPromises);
    console.log(`Created ${jobs.length} jobs`);

    // Poll all jobs in parallel
    const resultPromises = jobs.map((job) =>
      client.jobs.poll(job.jobId, { interval: 1000 }),
    );

    const results = await Promise.all(resultPromises);

    // Display results
    results.forEach((result, index) => {
      console.log(`\nQ: ${questions[index]}`);
      if (result.success && result.job.result) {
        console.log(`A: ${result.job.result.message.content}`);
      } else {
        console.log(`Error: ${result.job.error}`);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 6: List and manage jobs
 */
async function example6_listAndManage() {
  console.log("\n=== Example 6: List and Manage Jobs ===");

  try {
    // Get completed jobs
    const completedJobs = await client.jobs.list({
      status: JobStatus.COMPLETED,
      limit: 5,
    });

    console.log(
      `Found ${completedJobs.jobs.length} completed jobs (of ${completedJobs.total} total)`,
    );

    completedJobs.jobs.forEach((job) => {
      console.log("\nJob:", job.jobId);
      console.log("Prompt:", job.prompt);
      if (job.result) {
        console.log("Processing time:", job.result.processingTimeMs, "ms");
      }
    });

    // Get all recent jobs
    const allJobs = await client.jobs.list({ limit: 10 });
    console.log(`\nTotal jobs in system: ${allJobs.total}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 7: Health monitoring
 */
async function example7_healthMonitoring() {
  console.log("\n=== Example 7: Health Monitoring ===");

  try {
    const health = await client.jobs.health();

    console.log("System Health:", health.healthy ? "HEALTHY" : "UNHEALTHY");
    console.log("Total Jobs:", health.totalJobs);
    console.log("\nStatus Breakdown:");
    console.log("  Pending:", health.statusCounts.pending);
    console.log("  Processing:", health.statusCounts.processing);
    console.log("  Completed:", health.statusCounts.completed);
    console.log("  Failed:", health.statusCounts.failed);
    console.log("  Timeout:", health.statusCounts.timeout);
    console.log("\nMetrics:");
    console.log(
      "  Average processing time:",
      health.metrics.averageProcessingTimeMs,
      "ms",
    );
    console.log(
      "  Success rate:",
      (health.metrics.successRate * 100).toFixed(2),
      "%",
    );
    console.log(
      "  Failure rate:",
      (health.metrics.failureRate * 100).toFixed(2),
      "%",
    );
    console.log(
      "  Timeout rate:",
      (health.metrics.timeoutRate * 100).toFixed(2),
      "%",
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 8: Error handling patterns
 */
async function example8_errorHandling() {
  console.log("\n=== Example 8: Error Handling ===");

  // Pattern 1: Try-catch with ask
  try {
    const response = await client.jobs.ask(userId, "Test question");
    console.log("Response:", response);
  } catch (error) {
    console.error("Failed to get response:", error.message);
  }

  // Pattern 2: Check result success
  const result = await client.jobs.createAndPoll({
    userId,
    content: "Another test",
  });

  if (result.success && result.job.result) {
    console.log("Success:", result.job.result.message.content);
  } else {
    console.error("Job failed with status:", result.job.status);
    if (result.job.error) {
      console.error("Error message:", result.job.error);
    }
  }

  // Pattern 3: Manual status checking
  const createResult = await client.jobs.create({
    userId,
    content: "Manual check",
  });

  const pollResult = await client.jobs.poll(createResult.jobId, {
    interval: 1000,
    maxAttempts: 5,
  });
```