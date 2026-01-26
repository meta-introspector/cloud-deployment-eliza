# a7046c18:packages_core_python_.venv_bin_ruff:25501-25650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25501-25650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

For example, the fix would be marked as unsafe in the following case:

```python
foo(
    **{
        # comment
        "x": 1.0,
        # comment
        "y": 2.0,
    }
)
```

as this is converted to `foo(x=1.0, y=2.0)` without any of the comments.

## References
- [Python documentation: Dictionary displays](https://docs.python.org/3/reference/expressions.html#dictionary-displays)
- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)
## What it does
Checks for lambdas that can be replaced with the `list` or `dict` builtins.

## Why is this bad?
Using container builtins are more succinct and idiomatic than wrapping
the literal in a lambda.

## Example
```python
from dataclasses import dataclass, field


@dataclass
class Foo:
    bar: list[int] = field(default_factory=lambda: [])
```

Use instead:
```python
from dataclasses import dataclass, field


@dataclass
class Foo:
    bar: list[int] = field(default_factory=list)
    baz: dict[str, int] = field(default_factory=dict)
```

## References
- [Python documentation: `list`](https://docs.python.org/3/library/functions.html#func-list)
## What it does
Checks for `range` calls with an unnecessary `start` argument.

## Why is this bad?
`range(0, x)` is equivalent to `range(x)`, as `0` is the default value for
the `start` argument. Omitting the `start` argument makes the code more
concise and idiomatic.

## Example
```python
range(0, 3)
```

Use instead:
```python
range(3)
```

## References
- [Python documentation: `range`](https://docs.python.org/3/library/stdtypes.html#range)
## What it does
Checks for `startswith` or `endswith` calls on the same value with
different prefixes or suffixes.

## Why is this bad?
The `startswith` and `endswith` methods accept tuples of prefixes or
suffixes respectively. Passing a tuple of prefixes or suffixes is more
efficient and readable than calling the method multiple times.

## Example
```python
msg = "Hello, world!"
if msg.startswith("Hello") or msg.startswith("Hi"):
    print("Greetings!")
```

Use instead:
```python
msg = "Hello, world!"
if msg.startswith(("Hello", "Hi")):
    print("Greetings!")
```

## Fix safety
This rule's fix is unsafe, as in some cases, it will be unable to determine
whether the argument to an existing `.startswith` or `.endswith` call is a
tuple. For example, given `msg.startswith(x) or msg.startswith(y)`, if `x`
or `y` is a tuple, and the semantic model is unable to detect it as such,
the rule will suggest `msg.startswith((x, y))`, which will error at
runtime.

## References
- [Python documentation: `str.startswith`](https://docs.python.org/3/library/stdtypes.html#str.startswith)
- [Python documentation: `str.endswith`](https://docs.python.org/3/library/stdtypes.html#str.endswith)
## What it does
Checks for `print` statements.

## Why is this bad?
`print` statements used for debugging should be omitted from production
code. They can lead the accidental inclusion of sensitive information in
logs, and are not configurable by clients, unlike `logging` statements.

`print` statements used to produce output as a part of a command-line
interface program are not typically a problem.

## Example
```python
def sum_less_than_four(a, b):
    print(f"Calling sum_less_than_four")
    return a + b < 4
```

The automatic fix will remove the print statement entirely:

```python
def sum_less_than_four(a, b):
    return a + b < 4
```

To keep the line for logging purposes, instead use something like:

```python
import logging

logger = logging.getLogger(__name__)


def sum_less_than_four(a, b):
    logger.debug("Calling sum_less_than_four")
    return a + b < 4


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
```

## Fix safety
This rule's fix is marked as unsafe, as it will remove `print` statements
that are used beyond debugging purposes.
## What it does
Checks for `pprint` statements.
```