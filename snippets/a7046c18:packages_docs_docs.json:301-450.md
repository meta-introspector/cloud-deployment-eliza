# a7046c18:packages_docs_docs.json:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/docs.json:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                "group": "Delete",
                "expanded": true,
                "pages": [
                  "rest-reference/memory/delete-all-agent-memories",
                  "rest-reference/memory/delete-all-memories-for-a-room"
                ]
              }
            ]
          },
          {
            "group": "ROOMS",
            "pages": [
              "rest-reference/rooms/create-a-room",
              "rest-reference/rooms/get-room-details",
              "rest-reference/rooms/get-agent-rooms",
              "rest-reference/rooms/update-a-room",
              "rest-reference/rooms/delete-a-room"
            ]
          },
          {
            "group": "MEDIA",
            "pages": [
              "rest-reference/media/upload-media-for-agent",
              "rest-reference/media/upload-media-to-channel"
            ]
          },
          {
            "group": "LOGS",
            "pages": [
              {
                "group": "Read",
                "expanded": true,
                "pages": [
                  "rest-reference/logs/get-agent-logs",
                  "rest-reference/logs/get-system-logs",
                  "rest-reference/logs/get-system-logs-post"
                ]
              },
              {
                "group": "Delete",
                "expanded": true,
                "pages": [
                  "rest-reference/logs/delete-a-specific-log-entry",
                  "rest-reference/logs/clear-system-logs"
                ]
              }
            ]
          },
          {
            "group": "SYSTEM",
            "pages": [
              {
                "group": "Health & Status",
                "expanded": true,
                "pages": [
                  "rest-reference/system/basic-health-check",
                  "rest-reference/system/health-check-endpoint",
                  "rest-reference/system/ping-health-check",
                  "rest-reference/system/get-system-status",
                  "rest-reference/system/get-version"
                ]
              },
              {
                "group": "Configuration",
                "expanded": true,
                "pages": [
                  "rest-reference/system/get-system-config",
                  "rest-reference/system/get-local-environment-variables",
                  "rest-reference/system/update-local-environment-variables"
                ]
              },
              {
                "group": "Debug & Control",
                "expanded": true,
                "pages": [
                  "rest-reference/system/get-server-debug-info",
                  "rest-reference/system/get-server-debug-info-1",
                  "rest-reference/system/stop-the-server"
                ]
              }
            ]
          },
          {
            "group": "JOBS",
            "pages": [
              "rest-reference/jobs/create-job",
              "rest-reference/jobs/get-job",
              "rest-reference/jobs/jobs-health"
            ]
          },
          {
            "group": "RUNS",
            "pages": [
              "rest-reference/runs/list-agent-runs",
              "rest-reference/runs/get-agent-run"
            ]
          },
          {
            "group": "WEBSOCKET",
            "pages": ["rest-reference/websocket/socketio-real-time-connection"]
          }
        ]
      },
      {
        "tab": "CLI Reference",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["cli-reference/overview"]
          },
          {
            "group": "Commands",
            "pages": [
              "cli-reference/create",
              "cli-reference/start",
              "cli-reference/dev",
              "cli-reference/env",
              "cli-reference/agent",
              "cli-reference/plugins",
              "cli-reference/test",
              "cli-reference/update",
              "cli-reference/publish",
              "cli-reference/monorepo",
              "cli-reference/tee",
              "cli-reference/deploy",
              "cli-reference/login",
              "cli-reference/containers",
              "cli-reference/scenario",
              "cli-reference/report"
            ]
          }
        ]
      },
      {
        "tab": "Plugin Registry",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["plugin-registry/overview", "plugin-registry/registry"]
          },
          {
            "group": "Core Plugins",
            "pages": [
              {
                "group": "Bootstrap",
                "pages": [
                  "plugin-registry/bootstrap",
                  "plugin-registry/bootstrap/complete-documentation",
                  "plugin-registry/bootstrap/message-flow",
                  "plugin-registry/bootstrap/examples",
```