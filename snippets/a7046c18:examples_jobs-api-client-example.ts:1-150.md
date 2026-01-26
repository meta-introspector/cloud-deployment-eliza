# a7046c18:examples_jobs-api-client-example.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-client-example.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Jobs API Client Usage Examples
 *
 * This example demonstrates various ways to use the Jobs API through the elizaOS API client.
 * The Jobs API provides a simplified request/response pattern for one-off agent interactions.
 */

import { ElizaClient, JobStatus } from "@elizaos/api-client";

// Initialize the client
const client = ElizaClient.create({
  baseUrl: "http://localhost:3000",
  apiKey: process.env.ELIZA_SERVER_AUTH_TOKEN, // Optional
});

// Example user and agent IDs (replace with your actual IDs)
const userId = "00000000-0000-0000-0000-000000000001";
const agentId = "00000000-0000-0000-0000-000000000002";

/**
 * Example 1: Simple ask pattern
 * The easiest way to get a response from an agent
 */
async function example1_simpleAsk() {
  console.log("\n=== Example 1: Simple Ask Pattern ===");

  try {
    const response = await client.jobs.ask(
      userId,
      "What is the price of Bitcoin?",
    );
    console.log("Agent response:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 2: Create and poll with full control
 * Get access to job metadata, processing time, etc.
 */
async function example2_createAndPoll() {
  console.log("\n=== Example 2: Create and Poll with Full Control ===");

  try {
    const result = await client.jobs.createAndPoll(
      {
        userId,
        content: "Analyze the current DeFi market trends",
        agentId, // Optional - target specific agent
        timeoutMs: 60000, // Optional - 60 second timeout
        metadata: { source: "example-script" },
      },
      {
        interval: 1000, // Poll every second
        onProgress: (job, attempt) => {
          console.log(`Attempt ${attempt}: Status = ${job.status}`);
        },
      },
    );

    if (result.success && result.job.result) {
      console.log("Response:", result.job.result.message.content);
      console.log(
        "Processing time:",
        result.job.result.processingTimeMs,
        "ms",
      );
      console.log("Total attempts:", result.attempts);
    } else {
      console.error("Job failed:", result.job.error);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 3: Exponential backoff for long-running queries
 * More efficient for queries that might take longer
 */
async function example3_exponentialBackoff() {
  console.log("\n=== Example 3: Exponential Backoff ===");

  try {
    const result = await client.jobs.createAndPollWithBackoff(
      {
        userId,
        content:
          "Perform a comprehensive market analysis across multiple chains",
        timeoutMs: 120000, // 2 minutes
      },
      {
        initialInterval: 500, // Start with 500ms
        maxInterval: 5000, // Max 5 seconds between polls
        multiplier: 1.5, // Increase interval by 1.5x each time
        maxAttempts: 60,
        onProgress: (job, attempt) => {
          console.log(`[${attempt}] Status: ${job.status}`);
        },
      },
    );

    if (result.success && result.job.result) {
      console.log("Success! Response:", result.job.result.message.content);
      console.log("Time taken:", result.timeMs, "ms");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 4: Manual job creation and polling
 * For cases where you need fine-grained control
 */
async function example4_manualControl() {
  console.log("\n=== Example 4: Manual Control ===");

  try {
    // Create the job
    const job = await client.jobs.create({
      userId,
      content: "What are the top DeFi protocols?",
    });

    console.log("Job created:", job.jobId);
    console.log("Initial status:", job.status);

    // Poll manually
    const result = await client.jobs.poll(job.jobId, {
      interval: 1000,
      maxAttempts: 30,
    });

    console.log("Final status:", result.job.status);
    if (result.success && result.job.result) {
      console.log("Response:", result.job.result.message.content);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

/**
 * Example 5: Batch processing multiple questions
 */
async function example5_batchQuestions() {
  console.log("\n=== Example 5: Batch Questions ===");

```