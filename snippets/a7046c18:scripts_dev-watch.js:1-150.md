# a7046c18:scripts_dev-watch.js:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/dev-watch.js:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env bun

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const clientDir = path.resolve(__dirname, "../packages/client");
const cliDir = path.resolve(__dirname, "../packages/cli");

const processes = [];
let isShuttingDown = false;
let _serverReady = false;

function log(prefix, message) {
  console.log(`[${prefix}] ${new Date().toLocaleTimeString()} - ${message}`);
}

// Simple color helpers (avoid external deps)
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

// Health check function to verify server is responding
async function waitForServer(
  url = "http://localhost:3000/api/server/ping",
  maxAttempts = 30,
) {
  log("HEALTH", `Waiting for server to be ready at ${url}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });
      if (response.ok) {
        log("HEALTH", `✅ Server is ready! (attempt ${attempt})`);
        return true;
      }
    } catch (_error) {
      // Server not ready yet, continue waiting
      if (attempt % 5 === 0) {
        log(
          "HEALTH",
          `Still waiting for server... (attempt ${attempt}/${maxAttempts})`,
        );
      }
    }

    // Wait 1 second between attempts
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isShuttingDown) {
      return false;
    }
  }

  log("HEALTH", `❌ Server failed to respond after ${maxAttempts} attempts`);
  return false;
}

function startViteDevServer() {
  log("CLIENT", "Starting Vite dev server with HMR...");

  const child = spawn("bun", ["run", "dev:client"], {
    cwd: clientDir,
    stdio: "inherit",
    shell: true,
    detached: false,
  });

  child.on("close", (code, signal) => {
    if (!isShuttingDown) {
      log(
        "CLIENT",
        `Vite dev server exited with code ${code} signal ${signal}`,
      );
      if (code !== 0 && code !== null) {
        log("CLIENT", "Vite dev server failed, shutting down...");
        cleanup("vite-error");
      }
    }
  });

  child.on("error", (error) => {
    if (!isShuttingDown) {
      log("CLIENT", `Vite dev server error: ${error.message}`);
      cleanup("vite-error");
    }
  });

  processes.push({ name: "VITE-DEV", child, type: "client" });
  return child;
}

function startCliServer() {
  log("CLI", "Starting CLI server build...");

  // Run CLI build first, then start the server directly
  const child = spawn("bun", ["run", "build"], {
    cwd: cliDir,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    detached: false,
  });

  if (child.stdout) {
    child.stdout.on("data", (data) => {
      if (!isShuttingDown) {
        process.stdout.write(`[CLI-BUILD] ${data}`);
      }
    });
  }

  if (child.stderr) {
    child.stderr.on("data", (data) => {
      if (!isShuttingDown) {
        process.stderr.write(`[CLI-BUILD] ${data}`);
      }
    });
  }

  child.on("close", async (code, signal) => {
    if (!isShuttingDown) {
      if (code === 0) {
        log("CLI", "Build completed, starting server...");
        // Now start the actual CLI server
        const serverProcess = await startActualCliServer();
        if (serverProcess) {
          // Wait for server to be ready before starting frontend
          const port = process.env.SERVER_PORT || 3000;
          const url = `http://localhost:${port}/api/server/ping`;
          const ready = await waitForServer(url);

          if (ready && !isShuttingDown) {
            _serverReady = true;
            log("DEV", "🔧 Backend server is ready!");
            startViteDevServer();
            log("DEV", "🚀 Development environment fully ready!");
            log(
              "DEV",
              `📱 Frontend: ${cyan("http://localhost:5173")} (with HMR)`,
            );
            log("DEV", `🔧 Backend API: ${cyan("http://localhost:3000")}`);
            log("DEV", "✨ All services are connected and ready!");
          } else if (!isShuttingDown) {
            log("CLI", "Server failed to start properly, shutting down...");
            cleanup("server-health-check-failed");
```