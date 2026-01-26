# a7046c18:examples_jobs-api-client-example.ts:301-340

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/jobs-api-client-example.ts:301-340
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

  switch (pollResult.job.status) {
    case JobStatus.COMPLETED:
      console.log("Completed successfully");
      break;
    case JobStatus.FAILED:
      console.error("Job failed:", pollResult.job.error);
      break;
    case JobStatus.TIMEOUT:
      console.error("Job timed out");
      break;
    default:
      console.log("Job still processing after max attempts");
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log("Jobs API Client Examples");
  console.log("========================\n");

  // Run examples (comment out the ones you don't want to run)
  await example1_simpleAsk();
  await example2_createAndPoll();
  await example3_exponentialBackoff();
  await example4_manualControl();
  await example5_batchQuestions();
  await example6_listAndManage();
  await example7_healthMonitoring();
  await example8_errorHandling();

  console.log("\n=== All examples completed ===");
}

// Run if executed directly
if (import.meta.main) {
  main().catch(console.error);
}
```