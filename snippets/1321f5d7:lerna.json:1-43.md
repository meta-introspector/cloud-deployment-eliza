# 1321f5d7:lerna.json:1-43

**Commit:** 1321f5d7e03679efe78eae52d8f5d1816462b0bd
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 19:59:10 2025 -0800
**File:** lerna.json:1-43
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.0",
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