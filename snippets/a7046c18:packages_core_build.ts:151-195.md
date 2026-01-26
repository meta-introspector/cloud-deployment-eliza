# a7046c18:packages_core_build.ts:151-195

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/build.ts:151-195
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  const fs = await import("node:fs/promises");
  const { $ } = await import("bun");

  console.log("📝 Generating TypeScript declarations...");
  const startTime = Date.now();

  // Generate TypeScript declarations using tsc
  console.log("   Compiling TypeScript declarations...");
  await $`tsc --project tsconfig.declarations.json`;

  // Ensure directories exist for conditional exports
  await fs.mkdir("dist/node", { recursive: true });
  await fs.mkdir("dist/browser", { recursive: true });

  // Create re-export files for conditional exports structure
  // dist/node/index.d.ts - points to the Node.js entry point
  await fs.writeFile(
    "dist/node/index.d.ts",
    `// Type definitions for @elizaos/core (Node.js)\nexport * from '../index.node';\n`,
  );

  // dist/browser/index.d.ts - points to the browser entry point
  await fs.writeFile(
    "dist/browser/index.d.ts",
    `// Type definitions for @elizaos/core (Browser)\nexport * from '../index.browser';\n`,
  );

  // Create main index.js for runtime fallback (when conditional exports don't match)
  await fs.writeFile(
    "dist/index.js",
    `// Main entry point fallback for @elizaos/core\nexport * from './node/index.node.js';\n`,
  );

  // Ensure testing module directory and declarations exist
  await fs.mkdir("dist/testing", { recursive: true });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ TypeScript declarations generated in ${duration}s`);
}

// Execute the build
buildAll().catch((error) => {
  console.error("Build script error:", error);
  process.exit(1);
});
```