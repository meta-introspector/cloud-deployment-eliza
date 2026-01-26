# 730e2815:packages_elizaos_package.json:1-35

**Commit:** 730e2815062351dd2e4bd56394ecbfd0a84a7c8f
**Author:** github-actions[bot]
**Date:** Mon Jan 5 08:21:10 2026 +0000
**File:** packages/elizaos/package.json:1-35
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "elizaos",
  "version": "1.7.1-alpha.5",
  "description": "Alias package for @elizaos/cli",
  "publishConfig": {
    "access": "public",
    "workspaces": {
      "preserveIfPresent": true
    }
  },
  "license": "MIT",
  "author": "elizaOS",
  "repository": {
    "type": "git",
    "url": "https://github.com/elizaOS/eliza.git",
    "directory": "packages/elizaos"
  },
  "files": [
    "bin",
    "bin/**/*"
  ],
  "keywords": [
    "eliza",
    "elizaos",
    "cli",
    "agents"
  ],
  "type": "module",
  "bin": {
    "elizaos": "bin/elizaos.js"
  },
  "dependencies": {
    "@elizaos/cli": "workspace:*"
  }
}
```