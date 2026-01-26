# a7046c18:packages_core_python_.venv_bin_ruff:18151-18300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18151-18300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks that function arguments are annotated with a more specific type than
`Any`.

## Why is this bad?
`Any` is a special type indicating an unconstrained type. When an
expression is annotated with type `Any`, type checkers will allow all
operations on it.

It's better to be explicit about the type of an expression, and to use
`Any` as an "escape hatch" only when it is really needed.

## Example

```python
from typing import Any


def foo(x: Any): ...
```

Use instead:

```python
def foo(x: int): ...
```

## Known problems

Type aliases are unsupported and can lead to false positives.
For example, the following will trigger this rule inadvertently:

```python
from typing import Any

MyAny = Any


def foo(x: MyAny): ...
```

## Options
- `lint.flake8-annotations.allow-star-arg-any`

## References
- [Typing spec: `Any`](https://typing.python.org/en/latest/spec/special-types.html#any)
- [Python documentation: `typing.Any`](https://docs.python.org/3/library/typing.html#typing.Any)
- [Mypy documentation: The Any type](https://mypy.readthedocs.io/en/stable/kinds_of_types.html#the-any-type)
## What it does
Checks for timeout context managers which do not contain a checkpoint.

For the purposes of this check, `yield` is considered a checkpoint,
since checkpoints may occur in the caller to which we yield.

## Why is this bad?
Some asynchronous context managers, such as `asyncio.timeout` and
`trio.move_on_after`, have no effect unless they contain a checkpoint.
The use of such context managers without an `await`, `async with` or
`async for` statement is likely a mistake.

## Example
```python
import asyncio


async def func():
    async with asyncio.timeout(2):
        do_something()
```

Use instead:
```python
import asyncio


async def func():
    async with asyncio.timeout(2):
        do_something()
        await awaitable()
```

## References
- [`asyncio` timeouts](https://docs.python.org/3/library/asyncio-task.html#timeouts)
- [`anyio` timeouts](https://anyio.readthedocs.io/en/stable/cancellation.html)
- [`trio` timeouts](https://trio.readthedocs.io/en/stable/reference-core.html#cancellation-and-timeouts)
## What it does
Checks for calls to trio functions that are not immediately awaited.

## Why is this bad?
Many of the functions exposed by trio are asynchronous, and must be awaited
to take effect. Calling a trio function without an `await` can lead to
`RuntimeWarning` diagnostics and unexpected behaviour.

## Example
```python
import trio


async def double_sleep(x):
    trio.sleep(2 * x)
```

Use instead:
```python
import trio


async def double_sleep(x):
    await trio.sleep(2 * x)
```

## Fix safety
This rule's fix is marked as unsafe, as adding an `await` to a function
call changes its semantics and runtime behavior.
## What it does
Checks for `async` function definitions with `timeout` parameters.

## Why is this bad?
Rather than implementing asynchronous timeout behavior manually, prefer
built-in timeout functionality, such as `asyncio.timeout`, `trio.fail_after`,
or `anyio.move_on_after`, among others.

This rule is highly opinionated to enforce a design pattern
called ["structured concurrency"] that allows for
`async` functions to be oblivious to timeouts,
instead letting callers to handle the logic with a context manager.

## Details

This rule attempts to detect which async framework your code is using
by analysing the imports in the file it's checking. If it sees an
`anyio` import in your code, it will assume `anyio` is your framework
of choice; if it sees a `trio` import, it will assume `trio`; if it
sees neither, it will assume `asyncio`. `asyncio.timeout` was added
in Python 3.11, so if `asyncio` is detected as the framework being used,
this rule will be ignored when your configured [`target-version`] is set
to less than Python 3.11.

For functions that wrap `asyncio.timeout`, `trio.fail_after` or
`anyio.move_on_after`, false positives from this rule can be avoided
by using a different parameter name.

## Example

```python
async def long_running_task(timeout): ...


async def main():
    await long_running_task(timeout=2)
```