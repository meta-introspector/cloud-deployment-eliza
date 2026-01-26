# a7046c18:packages_core_python_README.md:1-97

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/README.md:1-97
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# elizaOS Core (Python)

The Python implementation of elizaOS Core - the runtime and types for elizaOS AI agents.

## Installation

```bash
pip install elizaos
```

## Features

- **Strong typing** with Pydantic models and full type hints
- **Plugin architecture** for extensibility
- **Character configuration** for defining agent personalities
- **Memory system** for conversation history and knowledge
- **Event system** for reactive programming
- **Service abstraction** for external integrations

## Quick Start

```python
from elizaos import AgentRuntime, Character
from elizaos.types import UUID

# Define a character
character = Character(
    name="Assistant",
    bio="A helpful AI assistant.",
    system="You are a helpful and friendly assistant.",
)

# Create and initialize the runtime
async def main():
    runtime = AgentRuntime(
        character=character,
    )
    await runtime.initialize()
    
    # Runtime is now ready to process messages

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

## Architecture

### Core Types

- `UUID` - Universally unique identifier
- `Content` - Message content with text, actions, attachments
- `Memory` - Stored message or information
- `Entity` - User or agent representation
- `Room` - Conversation context
- `World` - Collection of rooms and entities

### Components

- `Action` - Define agent capabilities
- `Provider` - Supply contextual information
- `Evaluator` - Post-interaction analysis
- `Service` - Long-running integrations

### Plugin System

```python
from elizaos import Plugin, Action, Provider

my_plugin = Plugin(
    name="my-plugin",
    description="A custom plugin",
    actions=[...],
    providers=[...],
)
```

## Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Type checking
mypy elizaos

# Linting
ruff check elizaos
```

## License

MIT

```