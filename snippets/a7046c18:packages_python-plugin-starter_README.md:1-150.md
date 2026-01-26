# a7046c18:packages_python-plugin-starter_README.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/python-plugin-starter/README.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# elizaOS Python Plugin Starter

A template for creating elizaOS plugins in Python that can be loaded by both the Python and TypeScript runtimes.

## Features

- 🐍 **Native Python** with full async/await support
- 📦 **Pydantic models** for type-safe data handling
- 🔄 **IPC bridge** for TypeScript runtime compatibility
- 🧪 **pytest** testing setup included

## Installation

### For Development

```bash
# From the plugin directory
pip install -e ".[dev]"
```

### For Production

```bash
pip install elizaos-plugin-starter
```

## Usage

### In Python Runtime

```python
from elizaos_plugin_starter import plugin

# Register with runtime
await runtime.register_plugin(plugin)

# The HELLO_PYTHON action is now available
```

### In TypeScript Runtime

The TypeScript runtime can load Python plugins via IPC:

```typescript
import { loadPythonPlugin } from '@elizaos/core/interop';

const plugin = await loadPythonPlugin({
  moduleName: 'elizaos_plugin_starter',
  pythonPath: 'python3',
});

await runtime.registerPlugin(plugin);
```

## Plugin Structure

```
python-plugin-starter/
├── pyproject.toml                    # Python package configuration
├── elizaos_plugin_starter/
│   ├── __init__.py                   # Package exports
│   └── plugin.py                     # Main plugin implementation
├── tests/
│   └── test_plugin.py               # Unit tests
└── README.md
```

## Creating Your Own Plugin

### 1. Define Actions

```python
from elizaos.types.components import Action, ActionResult

async def my_action_validate(runtime, message, state):
    """Decide if this action should run."""
    # Check message content, state, etc.
    return True

async def my_action_handler(runtime, message, state, options, callback, responses):
    """Execute the action."""
    # Your action logic here
    result = do_something_cool()
    
    return ActionResult(
        success=True,
        text="Action completed!",
        data={"result": result},
    )

my_action = Action(
    name="MY_ACTION",
    description="Does something cool",
    validate=my_action_validate,
    handler=my_action_handler,
)
```

### 2. Define Providers

```python
from elizaos.types.components import Provider, ProviderResult

async def my_provider_get(runtime, message, state):
    """Provide context data."""
    return ProviderResult(
        text="Context for the LLM prompt",
        values={"key": "value"},
        data={"structured": "data"},
    )

my_provider = Provider(
    name="MY_PROVIDER",
    description="Provides useful context",
    get=my_provider_get,
)
```

### 3. Define Services

```python
from elizaos.types.service import Service

class MyService(Service):
    service_type = "my-service"
    
    def __init__(self, runtime):
        super().__init__(runtime)
        self.initialized = False
    
    @classmethod
    async def start(cls, runtime):
        service = cls(runtime)
        service.initialized = True
        return service
    
    async def stop(self):
        self.initialized = False
```

### 4. Create the Plugin

```python
from elizaos.types.plugin import Plugin

plugin = Plugin(
    name="my-python-plugin",
    description="My awesome plugin",
    actions=[my_action],
    providers=[my_provider],
```