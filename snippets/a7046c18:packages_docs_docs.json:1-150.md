# a7046c18:packages_docs_docs.json:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/docs.json:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "ElizaOS Documentation",
  "homepage": "index",
  "colors": {
    "primary": "#0B35F1",
    "light": "#0B35F1",
    "dark": "#0B35F1"
  },
  "favicon": "/favicon.svg",
  "topAnchor": {
    "name": "Documentation"
  },
  "anchors": {
    "style": "guide"
  },
  "navigation": {
    "global": {
      "anchors": [
        {
          "anchor": "Docs for LLMs",
          "icon": "robot",
          "href": "https://docs.elizaos.ai/llms-full.txt"
        }
      ]
    },
    "tabs": [
      {
        "tab": "Docs",
        "groups": [
          {
            "group": "GETTING STARTED",
            "pages": [
              "index",
              "installation",
              "quickstart",
              "what-you-can-build"
            ]
          },
          {
            "group": "GUIDES",
            "pages": [
              {
                "group": "Agent Configuration",
                "pages": [
                  "guides/customize-an-agent",
                  "guides/add-multiple-agents",
                  "guides/streaming-responses"
                ]
              },
              {
                "group": "Development",
                "pages": [
                  "guides/action-planning",
                  "guides/background-tasks",
                  "guides/test-a-project",
                  "guides/create-a-plugin",
                  "guides/publish-a-plugin"
                ]
              },
              {
                "group": "Deployment",
                "pages": [
                  "guides/deploy-a-project",
                  "guides/deploy-to-cloud",
                  "guides/tee-integration",
                  "guides/contribute-to-core"
                ]
              }
            ]
          },
          {
            "group": "PROJECTS",
            "pages": ["projects/overview", "projects/environment-variables"]
          },
          {
            "group": "AGENTS",
            "pages": [
              "agents/character-interface",
              "agents/personality-and-behavior",
              "agents/memory-and-state",
              "agents/runtime-and-lifecycle"
            ]
          },
          {
            "group": "PLUGINS",
            "pages": [
              "plugins/architecture",
              "plugins/components",
              "plugins/development",
              "plugins/patterns",
              "plugins/webhooks-and-routes",
              "plugins/schemas",
              "plugins/migration",
              "plugins/reference"
            ]
          },
          {
            "group": "RUNTIME",
            "pages": [
              {
                "group": "Core Concepts",
                "pages": [
                  "runtime/core",
                  "runtime/memory",
                  "runtime/events",
                  "runtime/providers"
                ]
              },
              {
                "group": "Communication",
                "pages": [
                  "runtime/models",
                  "runtime/services",
                  "runtime/messaging",
                  "runtime/sessions-api"
                ]
              },
              "runtime/types-reference"
            ]
          },
          {
            "group": "TOKEN",
            "pages": ["tokenomics"]
          }
        ]
      },
      {
        "tab": "REST Reference",
        "pages": ["rest-reference/index"],
        "groups": [
          {
            "group": "AGENTS",
            "pages": [
              {
                "group": "CRUD Operations",
                "expanded": true,
                "pages": [
                  "rest-reference/agents/list-all-agents",
                  "rest-reference/agents/create-a-new-agent",
                  "rest-reference/agents/get-agent-details",
                  "rest-reference/agents/update-agent",
                  "rest-reference/agents/delete-an-agent"
                ]
              },
              {
                "group": "Lifecycle",
                "expanded": true,
                "pages": [
```