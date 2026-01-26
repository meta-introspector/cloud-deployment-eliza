# 61d977c5:lerna.json:1-43

**Commit:** 61d977c5b5e49fbb6784afe3b937fe03f14ec53f
**Author:** github-actions[bot]
**Date:** Sat Dec 20 05:10:13 2025 +0000
**File:** lerna.json:1-43
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.0-beta.0",
  "packages": [
    "packages/*"
  ],
  "npmClient": "bun",
  "command": {
    "publish": {
      "message": "chore(release): publish alpha",
      "registry": "https://registry.npmjs.org",
      "allowBranch": [
        "main",
        "develop",
        "alpha",
        "release/*"
      ],
      "ignoreChanges": [
        "**/*.md",
        "**/test/**",
        "**/__tests__/**"
      ],
      "verifyAccess": false
    },
    "version": {
      "allowBranch": [
        "main",
        "develop",
        "alpha",
        "release/*"
      ],
      "message": "chore(release): publish %s",
      "push": true,
      "gitTagVersion": true,
      "tagVersionPrefix": "v",
      "signGitTag": false,
      "signGitCommit": false,
      "forcePublish": "*",
      "exact": true
    }
  },
  "stream": true,
  "concurrency": 1
}
```