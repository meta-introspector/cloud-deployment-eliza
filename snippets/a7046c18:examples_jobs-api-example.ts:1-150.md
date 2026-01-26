# a7046c18:examples_jobs-api-example.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-example.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Example: Using the Jobs API for one-off agent messaging
 */

// Example 1: Simple job creation and polling
async function simpleJobExample() {
  const API_URL = "http://localhost:3000/api/messaging";
  const API_KEY = "your-api-key";

  // 1. Create a job (send a one-off message to an agent)
  const createResponse = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      agentId: "your-agent-uuid",
      userId: "your-user-uuid",
      content: "What is the current market status for Bitcoin?",
      metadata: {
        source: "api-example",
      },
      timeoutMs: 30000, // 30 seconds timeout
    }),
  });

  const jobData = await createResponse.json();
  console.log("Job created:", jobData);
  // { jobId: "...", status: "processing", createdAt: ..., expiresAt: ... }

  // 2. Poll for the result
  const jobId = jobData.jobId;
  let completed = false;
  const pollInterval = 1000; // Poll every 1 second
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts && !completed; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const statusResponse = await fetch(`${API_URL}/jobs/${jobId}`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const status = await statusResponse.json();
    console.log(`Poll attempt ${attempt + 1}:`, status.status);

    if (status.status === "completed") {
      console.log("Agent response:", status.result.message.content);
      console.log("Processing time:", status.result.processingTimeMs, "ms");
      completed = true;
    } else if (status.status === "failed" || status.status === "timeout") {
      console.error("Job failed:", status.error);
      completed = true;
    }
  }

  if (!completed) {
    console.error("Job timed out after", maxAttempts, "attempts");
  }
}

// Example 2: Using with JWT authentication
async function jobWithJWTExample() {
  const API_URL = "http://localhost:3000/api";

  // 1. Login to get JWT token
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "user@example.com",
      username: "user",
      cdpUserId: "your-user-uuid",
    }),
  });

  const { token } = await loginResponse.json();

  // 2. Create job with JWT
  const createResponse = await fetch(`${API_URL}/messaging/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      agentId: "agent-uuid",
      userId: "your-user-uuid",
      content: "Analyze the DeFi market trends",
    }),
  });

  const job = await createResponse.json();
  return job;
}

// Example 3: Helper function for polling with async/await
async function pollJobUntilComplete(
  jobId: string,
  options: {
    apiUrl?: string;
    apiKey?: string;
    token?: string;
    interval?: number;
    maxAttempts?: number;
  } = {},
) {
  const {
    apiUrl = "http://localhost:3000/api/messaging",
    apiKey,
    token,
    interval = 1000,
    maxAttempts = 30,
  } = options;

  const headers: Record<string, string> = {};
  if (apiKey) headers["x-api-key"] = apiKey;
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${apiUrl}/jobs/${jobId}`, { headers });
    const status = await response.json();

    if (status.status === "completed") {
      return {
        success: true,
        result: status.result,
        processingTimeMs: status.result.processingTimeMs,
      };
    }

    if (status.status === "failed" || status.status === "timeout") {
      return {
        success: false,
        error: status.error,
      };
    }

    // Still processing, wait before next poll
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return {
    success: false,
    error: "Polling timeout exceeded",
```