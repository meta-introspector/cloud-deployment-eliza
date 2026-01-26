# a7046c18:build-utils.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** build-utils.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    } catch (error: unknown) {
      lastError = error;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check for specific error types
      if (errorMessage.includes("EACCES") || errorMessage.includes("EPERM")) {
        console.error(`✗ Permission denied while cleaning ${outdir}`);
        console.error(
          `  Try running with elevated privileges or check file permissions.`,
        );
        throw error; // Don't retry permission errors
      } else if (errorMessage.includes("ENOENT")) {
        // Directory was already deleted (possibly by concurrent process)
        console.log(
          `✓ ${outdir} directory was already removed (${timer.elapsed()}ms)`,
        );
        return;
      } else if (
        errorMessage.includes("EBUSY") ||
        errorMessage.includes("EMFILE")
      ) {
        // Resource busy or too many open files - these might be temporary
        if (attempt < maxRetries) {
          const waitTime = attempt * 500; // Exponential backoff: 500ms, 1000ms, 1500ms
          console.warn(
            `⚠ Failed to clean ${outdir} (attempt ${attempt}/${maxRetries}): ${errorMessage}`,
          );
          console.warn(`  Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      } else {
        // Unknown error
        console.error(`✗ Failed to clean ${outdir}: ${errorMessage}`);
        throw error;
      }
    }
  }

  // If we've exhausted all retries
  const finalError =
    lastError instanceof Error ? lastError : new Error(String(lastError));
  console.error(`✗ Failed to clean ${outdir} after ${maxRetries} attempts`);
  throw finalError;
}

/**
 * Watch files for changes and trigger rebuilds with proper cleanup
 */
export function watchFiles(
  directory: string,
  onChange: () => void,
  options: {
    extensions?: string[];
    debounceMs?: number;
  } = {},
): () => void {
  const { extensions = [".ts", ".js", ".tsx", ".jsx"], debounceMs = 100 } =
    options;

  let debounceTimer: NodeJS.Timeout | null = null;
  let watcher: FSWatcher | null = null;
  let isCleanedUp = false;

  console.log(`📁 Watching ${directory} for changes...`);
  console.log("💡 Press Ctrl+C to stop\n");

  // Cleanup function to close watcher and clear timers
  const cleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (watcher) {
      try {
        watcher.close();
      } catch (_error) {
        // Ignore errors during cleanup
      }
      watcher = null;
    }
  };

  // Create the watcher with proper error handling
  watcher = watch(directory, { recursive: true }, (_eventType, filename) => {
    if (isCleanedUp) return;

    if (filename && extensions.some((ext) => filename.endsWith(ext))) {
      // Debounce to avoid multiple rapid rebuilds
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        if (!isCleanedUp) {
          console.log(`\n📝 File changed: ${filename}`);
          onChange();
        }
      }, debounceMs);
    }
  });

  // Handle watcher errors
  if (watcher && typeof watcher.on === "function") {
    watcher.on("error", (error: Error) => {
      console.error("Watch error:", error.message);
      if (error.message.includes("EMFILE")) {
        console.error(
          "Too many open files. Consider increasing your system limits or reducing the watch scope.",
        );
      }
    });
  }

  // Register cleanup handlers only once per watcher
  const handleExit = () => {
    cleanup();
    console.log("\n\n👋 Stopping watch mode...");
    process.exit(0);
  };

  // Remove any existing handlers to avoid duplicates
  process.removeAllListeners("SIGINT");
  process.removeAllListeners("SIGTERM");

  // Add new handlers
  process.once("SIGINT", handleExit);
  process.once("SIGTERM", handleExit);

  // Also cleanup on normal exit
  process.once("exit", cleanup);

  // Return cleanup function for manual cleanup
  return cleanup;
}

/**
 * Standard build runner configuration
 */
export interface BuildRunnerOptions {
  packageName: string;
  buildOptions: ElizaBuildOptions;
  onBuildComplete?: (success: boolean) => void;
}

/**
```