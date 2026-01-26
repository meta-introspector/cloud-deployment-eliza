# a7046c18:examples_jobs-api-example.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-example.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  };
}

// Example 4: Using the helper function
async function helperExample() {
  const API_KEY = "your-api-key";

  // Create job
  const createResponse = await fetch(
    "http://localhost:3000/api/messaging/jobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        agentId: "agent-uuid",
        userId: "user-uuid",
        content: "What are the top 5 DeFi protocols by TVL?",
      }),
    },
  );

  const { jobId } = await createResponse.json();

  // Poll until complete
  const result = await pollJobUntilComplete(jobId, {
    apiKey: API_KEY,
    interval: 1000,
    maxAttempts: 30,
  });

  if (result.success && result.result) {
    console.log("Agent response:", result.result.message.content);
    console.log("Time taken:", result.processingTimeMs, "ms");
  } else {
    console.error("Job failed:", result.error);
  }
}

// Example 5: TypeScript SDK-style wrapper
class JobsAPIClient {
  private apiUrl: string;
  private apiKey?: string;
  private token?: string;

  constructor(options: { apiUrl: string; apiKey?: string; token?: string }) {
    this.apiUrl = options.apiUrl;
    this.apiKey = options.apiKey;
    this.token = options.token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) headers["x-api-key"] = this.apiKey;
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  async prompt(options: {
    agentId: string;
    userId: string;
    content: string;
    metadata?: Record<string, unknown>;
    timeoutMs?: number;
  }) {
    const response = await fetch(`${this.apiUrl}/jobs`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }

    return response.json();
  }

  async poll(options: {
    jobId: string;
    interval?: number;
    maxAttempts?: number;
    timeout?: number;
  }) {
    const interval = options.interval || 1000;
    const maxAttempts = options.maxAttempts || 30;
    const timeout = options.timeout || maxAttempts * interval;
    const startTime = Date.now();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new Error("Polling timeout exceeded");
      }

      const response = await fetch(`${this.apiUrl}/jobs/${options.jobId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.statusText}`);
      }

      const status = await response.json();

      if (status.status === "completed") {
        return status;
      }

      if (status.status === "failed" || status.status === "timeout") {
        throw new Error(status.error || "Job failed");
      }

      // Still processing, wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("Maximum poll attempts exceeded");
  }

  async getJob(jobId: string) {
    const response = await fetch(`${this.apiUrl}/jobs/${jobId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get job: ${response.statusText}`);
    }

    return response.json();
  }
}

// Example 6: Using the SDK-style client
async function sdkStyleExample() {
  const client = new JobsAPIClient({
    apiUrl: "http://localhost:3000/api/messaging",
    apiKey: "your-api-key",
  });

  try {
    // Create job
    const job = await client.prompt({
      agentId: "agent-uuid",
      userId: "user-uuid",
      content: "Explain the Uniswap V3 concentrated liquidity model",
```