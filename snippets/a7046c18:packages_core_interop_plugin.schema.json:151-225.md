# a7046c18:packages_core_interop_plugin.schema.json:151-225

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/plugin.schema.json:151-225
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    "EvaluatorDefinition": {
      "type": "object",
      "required": ["name", "description"],
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "alwaysRun": { "type": "boolean" },
        "similes": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "ServiceDefinition": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": { "type": "string" },
        "description": { "type": "string" }
      }
    },
    "RouteDefinition": {
      "type": "object",
      "required": ["path", "method"],
      "properties": {
        "path": { "type": "string" },
        "method": {
          "type": "string",
          "enum": ["GET", "POST", "PUT", "PATCH", "DELETE", "STATIC"]
        },
        "name": { "type": "string" },
        "public": { "type": "boolean" },
        "isMultipart": { "type": "boolean" }
      }
    },
    "ActionResult": {
      "type": "object",
      "required": ["success"],
      "properties": {
        "success": { "type": "boolean" },
        "text": { "type": "string" },
        "error": { "type": "string" },
        "data": { "type": "object" },
        "values": { "type": "object" }
      }
    },
    "ProviderResult": {
      "type": "object",
      "properties": {
        "text": { "type": "string" },
        "values": { "type": "object" },
        "data": { "type": "object" }
      }
    },
    "Memory": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "agentId": { "type": "string", "format": "uuid" },
        "entityId": { "type": "string", "format": "uuid" },
        "roomId": { "type": "string", "format": "uuid" },
        "content": { "$ref": "#/definitions/Content" },
        "createdAt": { "type": "integer" }
      }
    },
    "State": {
      "type": "object",
      "properties": {
        "text": { "type": "string" },
        "values": { "type": "object" },
        "data": { "type": "object" }
      }
    }
  }
}
```