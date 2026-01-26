# a7046c18:packages_core_interop_plugin.schema.json:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/plugin.schema.json:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://elizaos.ai/schemas/plugin.schema.json",
  "title": "elizaOS Plugin Definition",
  "description": "Cross-language plugin interface definition for elizaOS",
  "type": "object",
  "required": ["name", "description", "version", "language"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Unique plugin identifier",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "description": {
      "type": "string",
      "description": "Human-readable plugin description"
    },
    "version": {
      "type": "string",
      "description": "Semantic version",
      "pattern": "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+)?$"
    },
    "language": {
      "type": "string",
      "enum": ["typescript", "rust", "python"],
      "description": "Primary implementation language"
    },
    "interop": {
      "type": "object",
      "description": "Interoperability configuration",
      "properties": {
        "protocol": {
          "type": "string",
          "enum": ["wasm", "ffi", "ipc", "native"],
          "description": "How this plugin communicates with other runtimes"
        },
        "wasmPath": {
          "type": "string",
          "description": "Path to compiled WASM module (for rust/typescript plugins)"
        },
        "sharedLibPath": {
          "type": "string",
          "description": "Path to compiled shared library (.so/.dylib/.dll)"
        },
        "ipcCommand": {
          "type": "string",
          "description": "Command to spawn IPC subprocess"
        },
        "ipcPort": {
          "type": "integer",
          "description": "Port for IPC communication"
        }
      }
    },
    "config": {
      "type": "object",
      "additionalProperties": {
        "oneOf": [
          { "type": "string" },
          { "type": "number" },
          { "type": "boolean" },
          { "type": "null" }
        ]
      }
    },
    "dependencies": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Other plugins this plugin depends on"
    },
    "actions": {
      "type": "array",
      "items": { "$ref": "#/definitions/ActionDefinition" }
    },
    "providers": {
      "type": "array",
      "items": { "$ref": "#/definitions/ProviderDefinition" }
    },
    "evaluators": {
      "type": "array",
      "items": { "$ref": "#/definitions/EvaluatorDefinition" }
    },
    "services": {
      "type": "array",
      "items": { "$ref": "#/definitions/ServiceDefinition" }
    },
    "routes": {
      "type": "array",
      "items": { "$ref": "#/definitions/RouteDefinition" }
    },
    "events": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": { "type": "string" }
      },
      "description": "Event type to handler names mapping"
    }
  },
  "definitions": {
    "ActionDefinition": {
      "type": "object",
      "required": ["name", "description"],
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "similes": {
          "type": "array",
          "items": { "type": "string" }
        },
        "examples": {
          "type": "array",
          "items": {
            "type": "array",
            "items": { "$ref": "#/definitions/ActionExample" }
          }
        }
      }
    },
    "ActionExample": {
      "type": "object",
      "required": ["name", "content"],
      "properties": {
        "name": { "type": "string" },
        "content": { "$ref": "#/definitions/Content" }
      }
    },
    "Content": {
      "type": "object",
      "properties": {
        "text": { "type": "string" },
        "actions": {
          "type": "array",
          "items": { "type": "string" }
        },
        "source": { "type": "string" },
        "data": { "type": "object" }
      }
    },
    "ProviderDefinition": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "dynamic": { "type": "boolean" },
        "position": { "type": "integer" },
        "private": { "type": "boolean" }
      }
    },
```