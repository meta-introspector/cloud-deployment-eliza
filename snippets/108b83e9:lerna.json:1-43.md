# 108b83e9:lerna.json:1-43

**Commit:** 108b83e9ec584b0c0093b76b3d137a2086579aae
**Author:** github-actions[bot]
**Date:** Tue Dec 30 19:54:18 2025 +0000
**File:** lerna.json:1-43
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "version": "1.7.1-alpha.3",
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