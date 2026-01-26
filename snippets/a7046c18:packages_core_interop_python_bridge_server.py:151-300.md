# a7046c18:packages_core_interop_python_bridge_server.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/bridge_server.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                valid = await action.validate(None, memory, state)  # type: ignore
                return {"type": "validate.result", "id": req_id, "valid": valid}

            elif req_type == "action.invoke":
                action_name = request.get("action", "")
                action = self.actions.get(action_name)
                if not action:
                    return {
                        "type": "action.result",
                        "id": req_id,
                        "result": {"success": False, "error": f"Action not found: {action_name}"},
                    }

                memory = self._parse_memory(request.get("memory"))
                state = self._parse_state(request.get("state"))
                options = request.get("options") or {}

                # Call handler
                result = await action.handler(
                    None,  # runtime
                    memory,
                    state,
                    HandlerOptions(**options) if isinstance(options, dict) else None,
                    None,  # callback
                    None,  # responses
                )

                return {
                    "type": "action.result",
                    "id": req_id,
                    "result": self._serialize_action_result(result),
                }

            elif req_type == "provider.get":
                provider_name = request.get("provider", "")
                provider = self.providers.get(provider_name)
                if not provider:
                    return {
                        "type": "provider.result",
                        "id": req_id,
                        "result": {"text": None, "values": None, "data": None},
                    }

                memory = self._parse_memory(request.get("memory"))
                state = self._parse_state(request.get("state"))

                result = await provider.get(None, memory, state)  # type: ignore

                return {
                    "type": "provider.result",
                    "id": req_id,
                    "result": self._serialize_provider_result(result),
                }

            elif req_type == "evaluator.invoke":
                evaluator_name = request.get("evaluator", "")
                evaluator = self.evaluators.get(evaluator_name)
                if not evaluator:
                    return {
                        "type": "action.result",
                        "id": req_id,
                        "result": None,
                    }

                memory = self._parse_memory(request.get("memory"))
                state = self._parse_state(request.get("state"))

                result = await evaluator.handler(
                    None,  # runtime
                    memory,
                    state,
                    None,  # options
                    None,  # callback
                    None,  # responses
                )

                return {
                    "type": "action.result",
                    "id": req_id,
                    "result": self._serialize_action_result(result) if result else None,
                }

            else:
                return {
                    "type": "error",
                    "id": req_id,
                    "error": f"Unknown request type: {req_type}",
                }

        except Exception as e:
            return {
                "type": "error",
                "id": req_id,
                "error": str(e),
                "details": traceback.format_exc(),
            }

    def _parse_memory(self, data: dict[str, Any] | None) -> Memory:
        """Parse memory from JSON."""
        if data is None:
            return Memory()  # type: ignore
        if isinstance(data, dict):
            return Memory(**data)  # type: ignore
        return data  # type: ignore

    def _parse_state(self, data: dict[str, Any] | None) -> State | None:
        """Parse state from JSON."""
        if data is None:
            return None
        if isinstance(data, dict):
            return State(**data)  # type: ignore
        return data  # type: ignore

    def _serialize_action_result(self, result: ActionResult | None) -> dict[str, Any] | None:
        """Serialize action result to JSON-compatible dict."""
        if result is None:
            return None

        if isinstance(result, dict):
            return result

        return {
            "success": result.success,
            "text": result.text,
            "error": str(result.error) if result.error else None,
            "data": result.data,
            "values": result.values,
        }

    def _serialize_provider_result(self, result: ProviderResult) -> dict[str, Any]:
        """Serialize provider result to JSON-compatible dict."""
        if isinstance(result, dict):
            return result

        return {
            "text": result.text,
            "values": result.values,
            "data": result.data,
        }


async def main(module_name: str) -> None:
    """Main entry point for the bridge server."""
    server = PluginBridgeServer(module_name)

    # Load the plugin
    await server.load_plugin()

    # Send ready message with manifest
    manifest = server.get_manifest()
```