# f227f085:packages_elizaos_package.json:1-35

**Commit:** f227f085a3c61f2d164ff47931ea8aa01afc2a37
**Author:** github-actions[bot]
**Date:** Fri Dec 19 21:54:51 2025 +0000
**File:** packages/elizaos/package.json:1-35
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "elizaos",
  "version": "1.6.6-alpha.8",
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