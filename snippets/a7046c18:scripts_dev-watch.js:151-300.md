# a7046c18:scripts_dev-watch.js:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/dev-watch.js:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          }
        }
      } else {
        log("CLI", `Build failed with code ${code} signal ${signal}`);
        cleanup("cli-build-error");
      }
    }
  });

  child.on("error", (error) => {
    if (!isShuttingDown) {
      log("CLI", `CLI build error: ${error.message}`);
      cleanup("cli-build-error");
    }
  });

  processes.push({ name: "CLI-BUILD", child, type: "build" });
  return child;
}

function startActualCliServer() {
  return new Promise((resolve) => {
    log("CLI", "Starting CLI server process...");

    const child = spawn("bun", ["dist/index.js", "start"], {
      cwd: cliDir,
      stdio: "inherit",
      shell: false,
      detached: false,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
    });

    child.on("close", (code, signal) => {
      if (!isShuttingDown) {
        log("CLI", `CLI server exited with code ${code} signal ${signal}`);
        if (code !== 0 && code !== null) {
          log("CLI", "CLI server failed, shutting down...");
          cleanup("cli-error");
        }
      }
    });

    child.on("error", (error) => {
      if (!isShuttingDown) {
        log("CLI", `CLI server error: ${error.message}`);
        cleanup("cli-error");
        resolve(null);
      }
    });

    // Replace the build process with the server process
    const buildIndex = processes.findIndex((p) => p.name === "CLI-BUILD");
    if (buildIndex !== -1) {
      processes[buildIndex] = { name: "CLI-SERVER", child, type: "server" };
    } else {
      processes.push({ name: "CLI-SERVER", child, type: "server" });
    }

    resolve(child);
  });
}

function cleanup(signal = "SIGTERM") {
  if (isShuttingDown) return; // Prevent multiple cleanup calls
  isShuttingDown = true;

  log("DEV", `Received ${signal}, shutting down...`);

  if (processes.length === 0) {
    log("DEV", "No processes to clean up, exiting...");
    process.exit(0);
    return;
  }

  // Kill all processes immediately and more aggressively
  const killPromises = processes.map(({ name, child, type }) => {
    return new Promise((resolve) => {
      if (child && !child.killed) {
        log("DEV", `Terminating ${name}...`);

        // Different timeout based on process type
        const timeout = type === "server" ? 1000 : 500;

        // Set up a timeout for force kill
        const forceKillTimeout = setTimeout(() => {
          if (child && !child.killed) {
            log("DEV", `Force killing ${name}...`);
            try {
              child.kill("SIGKILL");
            } catch (_error) {
              // Ignore errors during force kill
            }
          }
          resolve();
        }, timeout);

        // Listen for the process to exit
        child.on("exit", () => {
          clearTimeout(forceKillTimeout);
          log("DEV", `${name} stopped`);
          resolve();
        });

        // For CLI server, try SIGINT first (more graceful for Node.js apps)
        try {
          if (type === "server") {
            child.kill("SIGINT");
          } else {
            child.kill("SIGTERM");
          }
        } catch (_error) {
          // If graceful shutdown fails, try SIGKILL immediately
          try {
            child.kill("SIGKILL");
          } catch (_killError) {
            // Process might already be dead
          }
          clearTimeout(forceKillTimeout);
          resolve();
        }
      } else {
        resolve();
      }
    });
  });

  // Wait for all processes to be killed (max 2 seconds total)
  Promise.allSettled(killPromises).then(() => {
    log("DEV", "All processes terminated. Goodbye! 👋");
    process.exit(0);
  });

  // Force exit after 2 seconds if processes still running
  setTimeout(() => {
    log("DEV", "Force exit - some processes may still be running");
    process.exit(1);
  }, 2000);
}

// Handle different termination signals more cleanly
process.on("SIGINT", () => cleanup("SIGINT (Ctrl+C)"));
process.on("SIGTERM", () => cleanup("SIGTERM"));
process.on("SIGHUP", () => cleanup("SIGHUP"));

// Handle unexpected exits
process.on("uncaughtException", (error) => {
  log("DEV", `Uncaught exception: ${error.message}`);
```