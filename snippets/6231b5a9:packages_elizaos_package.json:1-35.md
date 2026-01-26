# 6231b5a9:packages_elizaos_package.json:1-35

**Commit:** 6231b5a9342b8a787b1eb43b757d096edc1d7577
**Author:** github-actions[bot]
**Date:** Wed Jan 7 10:47:26 2026 +0000
**File:** packages/elizaos/package.json:1-35
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "name": "elizaos",
  "version": "1.7.1-alpha.10",
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