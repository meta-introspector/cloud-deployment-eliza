# 61d977c5:packages_elizaos_package.json:1-35

**Commit:** 61d977c5b5e49fbb6784afe3b937fe03f14ec53f
**Author:** github-actions[bot]
**Date:** Sat Dec 20 05:10:13 2025 +0000
**File:** packages/elizaos/package.json:1-35
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "name": "elizaos",
  "version": "1.7.0-beta.0",
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