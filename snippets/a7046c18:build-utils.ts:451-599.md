# a7046c18:build-utils.ts:451-599

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** build-utils.ts:451-599
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 * Run a build with optional watch mode support
 */
export async function runBuild(
  options: BuildRunnerOptions & { isRebuild?: boolean },
) {
  const {
    packageName,
    buildOptions,
    isRebuild = false,
    onBuildComplete,
  } = options;
  const totalTimer = getTimer();

  // Clear console and show timestamp for rebuilds
  if (isRebuild) {
    console.clear();
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 🔄 Rebuilding ${packageName}...\n`);
  } else {
    console.log(`🚀 Building ${packageName}...\n`);
  }

  // Clean previous build
  await cleanBuild(buildOptions.outdir);

  // Create build configuration
  const configTimer = getTimer();
  const config = await createElizaBuildConfig(buildOptions);
  console.log(`✓ Configuration prepared (${configTimer.elapsed()}ms)`);

  // Build with Bun
  console.log("\nBundling with Bun...");
  const buildTimer = getTimer();
  const result = await Bun.build(config);

  if (!result.success) {
    console.error("✗ Build failed:", result.logs);
    onBuildComplete?.(false);
    return false;
  }

  const totalSize = result.outputs.reduce(
    (sum, output) => sum + output.size,
    0,
  );
  const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(
    `✓ Built ${result.outputs.length} file(s) - ${sizeMB}MB (${buildTimer.elapsed()}ms)`,
  );

  // Run post-build tasks
  const postBuildTasks: Promise<undefined | null>[] = [];

  // Add TypeScript declarations generation if requested
  if (buildOptions.generateDts) {
    postBuildTasks.push(
      generateDts("./tsconfig.build.json")
        .then(() => undefined)
        .catch((err) => {
          console.error("⚠ TypeScript declarations generation failed:", err);
          // Don't throw here, as it's often non-critical
          return null;
        }),
    );
  }

  // Add asset copying if specified
  if (buildOptions.assets && buildOptions.assets.length > 0) {
    postBuildTasks.push(
      copyAssets(buildOptions.assets)
        .then(() => undefined)
        .catch((err) => {
          console.error("✗ Asset copying failed:", err);
          throw err; // Asset copying failure is critical
        }),
    );
  }

  // Execute all post-build tasks
  if (postBuildTasks.length > 0) {
    const postBuildTimer = getTimer();
    await Promise.all(postBuildTasks);
    console.log(`✓ Post-build tasks completed (${postBuildTimer.elapsed()}ms)`);
  }

  console.log(`\n✅ ${packageName} build complete!`);
  console.log(`⏱️  Total build time: ${totalTimer.elapsed()}ms`);

  onBuildComplete?.(true);
  return true;
}

/**
 * Create a standardized build runner with watch mode support
 */
export function createBuildRunner(options: BuildRunnerOptions) {
  const isWatchMode = process.argv.includes("--watch");
  let cleanupWatcher: (() => void) | null = null;

  async function build(isRebuild = false) {
    return runBuild({
      ...options,
      isRebuild,
    });
  }

  async function startWatchMode() {
    console.log("👀 Starting watch mode...\n");

    // Initial build
    const buildSuccess = await build(false);

    if (buildSuccess) {
      const srcDir = join(process.cwd(), "src");

      // Store the cleanup function returned by watchFiles
      // The watcher stays active throughout the entire session
      cleanupWatcher = watchFiles(srcDir, async () => {
        await build(true);
        console.log("📁 Watching src/ directory for changes...");
        console.log("💡 Press Ctrl+C to stop\n");
      });
    }
  }

  // Ensure cleanup on process exit
  const cleanup = () => {
    if (cleanupWatcher) {
      cleanupWatcher();
      cleanupWatcher = null;
    }
  };

  process.once("beforeExit", cleanup);
  process.once("SIGUSR1", cleanup);
  process.once("SIGUSR2", cleanup);

  // Return the main function to run
  return async function run() {
    if (isWatchMode) {
      await startWatchMode();
    } else {
      const success = await build();
      if (!success) {
        process.exit(1);
      }
    }
  };
}
```