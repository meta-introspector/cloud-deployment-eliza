# 6e35e5f3:lerna.json:1-43

**Commit:** 6e35e5f311b9651386c18ed8704860d18941a1a3
**Author:** github-actions[bot]
**Date:** Mon Jan 5 12:32:39 2026 +0000
**File:** lerna.json:1-43
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.1-alpha.7",
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