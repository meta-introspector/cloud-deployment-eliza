# a7046c18:packages_core_python_elizaos_plugin.py:151-227

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/plugin.py:151-227
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                await runtime.register_service(service_class)
                logger.debug(f"Registered service: {service_class.service_type}")

        # Register models
        if plugin.models:
            for model_type, handler in plugin.models.items():
                runtime.register_model(
                    model_type,
                    handler,
                    provider=plugin.name,
                )
                logger.debug(f"Registered model: {model_type}")

        # Register event handlers
        if plugin.events:
            for event_type, event_handlers in plugin.events.items():
                for event_handler in event_handlers:
                    runtime.register_event(event_type, event_handler)
                logger.debug(f"Registered event handlers for: {event_type}")

        logger.info(f"Plugin registered successfully: {plugin.name}")

    except PluginRegistrationError:
        raise
    except Exception as e:
        raise PluginRegistrationError(
            f"Failed to register plugin {plugin.name}: {e}",
            plugin_name=plugin.name,
            cause=e,
        ) from e


def resolve_plugin_dependencies(plugins: list[Plugin]) -> list[Plugin]:
    """
    Resolve plugin dependencies and return plugins in topological order.

    Args:
        plugins: List of plugins to sort

    Returns:
        Plugins sorted by dependency order

    Raises:
        PluginLoadError: If there are circular dependencies
    """
    plugin_map = {p.name: p for p in plugins}
    resolved: list[Plugin] = []
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(name: str) -> None:
        if name in visited:
            return
        if name in visiting:
            raise PluginLoadError(
                f"Circular dependency detected: {name}",
                plugin_name=name,
            )

        visiting.add(name)
        plugin = plugin_map.get(name)

        if plugin and plugin.dependencies:
            for dep in plugin.dependencies:
                if dep in plugin_map:
                    visit(dep)

        visiting.remove(name)
        visited.add(name)

        if plugin:
            resolved.append(plugin)

    for plugin in plugins:
        visit(plugin.name)

    return resolved
```