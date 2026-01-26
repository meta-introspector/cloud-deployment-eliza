# 6231b5a9:lerna.json:1-43

**Commit:** 6231b5a9342b8a787b1eb43b757d096edc1d7577
**Author:** github-actions[bot]
**Date:** Wed Jan 7 10:47:26 2026 +0000
**File:** lerna.json:1-43
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.1-alpha.10",
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