# a6548d3b:lerna.json:1-43

**Commit:** a6548d3bbaa9a31f89d4afe6a36ef8222ef82dce
**Author:** github-actions[bot]
**Date:** Mon Jan 5 13:46:16 2026 +0000
**File:** lerna.json:1-43
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.1-alpha.8",
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