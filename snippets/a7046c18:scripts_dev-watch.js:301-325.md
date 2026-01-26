# a7046c18:scripts_dev-watch.js:301-325

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/dev-watch.js:301-325
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  cleanup("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  log("DEV", `Unhandled rejection: ${reason}`);
  cleanup("unhandledRejection");
});

async function main() {
  try {
    log("DEV", "Starting development environment...");
    log("DEV", "🔧 Step 1: Building and starting backend server...");

    // Start CLI server first and wait for it to be ready
    startCliServer();

    // Frontend will be started automatically after server is ready
    log("DEV", "Press Ctrl+C to stop all services.");
  } catch (error) {
    log("DEV", `Failed to start development environment: ${error.message}`);
    cleanup("startup-error");
  }
}

main();
```