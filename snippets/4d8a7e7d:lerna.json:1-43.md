# 4d8a7e7d:lerna.json:1-43

**Commit:** 4d8a7e7ddf7ebf0deee1bced5d93cbfc38ed47f1
**Author:** github-actions[bot]
**Date:** Mon Jan 5 08:59:26 2026 +0000
**File:** lerna.json:1-43
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.1-alpha.6",
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