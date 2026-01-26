# fb62d7c8:packages_elizaos_package.json:1-35

**Commit:** fb62d7c838cfab78dbe9f50bb625890e9456273d
**Author:** github-actions[bot]
**Date:** Sat Dec 20 04:00:46 2025 +0000
**File:** packages/elizaos/package.json:1-35
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "elizaos",
  "version": "1.7.0-alpha.0",
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