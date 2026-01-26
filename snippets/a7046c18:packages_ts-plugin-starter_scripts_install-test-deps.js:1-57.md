# a7046c18:packages_ts-plugin-starter_scripts_install-test-deps.js:1-57

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/scripts/install-test-deps.js:1-57
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const testDependencies = {
  "@cypress/react": "^9.0.1",
  "@testing-library/cypress": "^10.0.3",
  cypress: "^14.4.1",
};

function isInstalled(packageName) {
  try {
    const packageJsonPath = join(process.cwd(), "package.json");
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      return packageName in deps;
    }
  } catch (_error) {
    // Silent fail, will install if error
  }
  return false;
}

function installTestDependencies() {
  const missingDeps = Object.entries(testDependencies)
    .filter(([name]) => !isInstalled(name))
    .map(([name, version]) => `${name}@${version}`);

  if (missingDeps.length === 0) {
    console.log("✓ Test dependencies already installed");
    return;
  }

  console.log("Installing test dependencies...");
  try {
    const proc = Bun.spawnSync(["bun", "add", "-d", ...missingDeps], {
      stdout: "inherit",
      stderr: "inherit",
      cwd: process.cwd(),
    });

    if (proc.exitCode !== 0) {
      throw new Error("bun add command failed");
    }
    console.log("✓ Test dependencies installed successfully");
  } catch (error) {
    console.error("Failed to install test dependencies:", error.message);
    process.exit(1);
  }
}

installTestDependencies();
```