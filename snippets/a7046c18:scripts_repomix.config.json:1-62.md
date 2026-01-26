# a7046c18:scripts_repomix.config.json:1-62

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/repomix.config.json:1-62
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "output": {
    "filePath": "packages/docs/static/llms-community.txt",
    "style": "markdown",
    "compress": true,
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": true,
    "removeEmptyLines": true,
    "showLineNumbers": false,
    "includeEmptyDirectories": false,
    "topFilesLength": 20,
    "headerText": "elizaOS Community Context",
    "instructionFilePath": "scripts/dev-instructions.md"
  },
  "include": [
    "packages/docs/blog/mission.mdx",
    "packages/docs/blog/reintroduction.mdx",
    "packages/docs/blog/taming_info.mdx",
    "packages/docs/blog/v1-v2.mdx",
    "packages/docs/blog/wdygdtw_recap.mdx",
    "packages/docs/docs/core/actions.md",
    "packages/docs/docs/core/agents.md",
    "packages/docs/docs/core/database.md",
    "packages/docs/docs/core/entities.md",
    "packages/docs/docs/core/evaluators.md",
    "packages/docs/docs/core/knowledge.md",
    "packages/docs/docs/core/overview.md",
    "packages/docs/docs/core/plugins.md",
    "packages/docs/docs/core/project.md",
    "packages/docs/docs/core/providers.md",
    "packages/docs/docs/core/rooms.md",
    "packages/docs/docs/core/services.md",
    "packages/docs/docs/core/tasks.md",
    "packages/docs/docs/core/worlds.md",
    "packages/docs/docs/intro.md",
    "packages/docs/docs/quickstart.md",
    "packages/docs/partners/**/brief.mdx",
    "packages/docs/static/packages/**/*.md"
  ],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "**/*.test.ts",
      "**/__tests__/**",
      "**/node_modules/**",
      "packages/docs/community/**",
      "packages/plugin-*/**",
      "**/*.ico",
      "**/*.png",
      "**/*.jpg",
      "**/*.svg"
    ]
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "cl100k_base"
  }
}
```