# a7046c18:examples_jobs-api-example.ts:301-326

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-example.ts:301-326
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    console.log("Job created:", job.jobId);

    // Poll for result
    const result = await client.poll({
      jobId: job.jobId,
      interval: 1000,
      maxAttempts: 30,
    });

    console.log("Agent response:", result.result.message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Export examples
export {
  simpleJobExample,
  jobWithJWTExample,
  pollJobUntilComplete,
  helperExample,
  JobsAPIClient,
  sdkStyleExample,
};
```