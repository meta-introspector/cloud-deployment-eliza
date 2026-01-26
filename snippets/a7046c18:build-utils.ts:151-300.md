# a7046c18:build-utils.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** build-utils.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

/**
 * Copy assets after build with proper error handling (parallel processing)
 */
export async function copyAssets(assets: Array<{ from: string; to: string }>) {
  if (!assets.length) return;

  const timer = getTimer();
  const { cp } = await import("node:fs/promises");

  console.log("Copying assets...");

  // Process all assets in parallel
  const copyPromises = assets.map(async (asset) => {
    const assetTimer = getTimer();
    try {
      if (existsSync(asset.from)) {
        await cp(asset.from, asset.to, { recursive: true });
        return {
          success: true,
          message: `Copied ${asset.from} to ${asset.to} (${assetTimer.elapsed()}ms)`,
          asset,
        };
      } else {
        return {
          success: false,
          message: `Source not found: ${asset.from}`,
          asset,
          error: "Source not found",
        };
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to copy ${asset.from} to ${asset.to}: ${errorMessage}`,
        asset,
        error: errorMessage,
      };
    }
  });

  // Wait for all copies to complete
  const results = await Promise.all(copyPromises);

  // Process results
  let successCount = 0;
  const failedAssets: Array<{
    asset: { from: string; to: string };
    error: string;
  }> = [];

  results.forEach((result) => {
    if (result.success) {
      successCount++;
    } else {
      console.warn(`  ⚠ ${result.message}`);
      if (result.error) {
        // Check for specific error types
        if (result.error.includes("EACCES") || result.error.includes("EPERM")) {
          console.error(
            `    Permission denied. Try running with elevated privileges.`,
          );
        } else if (result.error.includes("ENOSPC")) {
          console.error(`    Insufficient disk space.`);
        }
        failedAssets.push({ asset: result.asset, error: result.error });
      }
    }
  });

  const totalTime = timer.elapsed();

  if (failedAssets.length === 0) {
    console.log(`✓ Assets copied (${totalTime}ms)`);
  } else if (successCount > 0) {
    console.warn(
      `⚠ Copied ${successCount}/${assets.length} assets (${totalTime}ms)`,
    );
    console.warn(
      `  Failed assets: ${failedAssets.map((f) => f.asset.from).join(", ")}`,
    );
  } else {
    throw new Error(
      `Failed to copy all assets. Errors: ${failedAssets.map((f) => `${f.asset.from}: ${f.error}`).join("; ")}`,
    );
  }
}

/**
 * Generate TypeScript declarations using tsc
 */
export async function generateDts(
  tsconfigPath = "./tsconfig.build.json",
  throwOnError = true,
) {
  const timer = getTimer();
  const { $ } = await import("bun");

  if (!existsSync(tsconfigPath)) {
    console.warn(
      `TypeScript config not found at ${tsconfigPath}, skipping d.ts generation`,
    );
    return;
  }

  console.log("Generating TypeScript declarations...");
  try {
    // Use incremental compilation for faster subsequent builds
    await $`tsc --emitDeclarationOnly --project ${tsconfigPath} --composite false --incremental false --types node,bun`;
    console.log(
      `✓ TypeScript declarations generated successfully (${timer.elapsed()}ms)`,
    );
  } catch (error: unknown) {
    console.error(
      `✗ Failed to generate TypeScript declarations (${timer.elapsed()}ms)`,
    );
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );

    if (throwOnError) {
      // Propagate so calling build fails hard on TS errors
      throw error;
    }
    console.warn("Continuing build without TypeScript declarations...");
  }
}

/**
 * Clean build artifacts with proper error handling and retry logic
 */
export async function cleanBuild(outdir = "dist", maxRetries = 3) {
  const timer = getTimer();
  const { rm } = await import("node:fs/promises");

  if (!existsSync(outdir)) {
    console.log(`✓ ${outdir} directory already clean (${timer.elapsed()}ms)`);
    return;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await rm(outdir, { recursive: true, force: true });
      console.log(`✓ Cleaned ${outdir} directory (${timer.elapsed()}ms)`);
      return; // Success, exit the function
```