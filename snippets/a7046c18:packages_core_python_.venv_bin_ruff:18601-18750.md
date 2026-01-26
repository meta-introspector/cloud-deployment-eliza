# a7046c18:packages_core_python_.venv_bin_ruff:18601-18750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18601-18750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```
## What it does
Checks that async functions do not call blocking `os.path` or `pathlib.Path`
methods.

## Why is this bad?
Calling some `os.path` or `pathlib.Path` methods in an async function will block
the entire event loop, preventing it from executing other tasks while waiting
for the operation. This negates the benefits of asynchronous programming.

Instead, use the methods' async equivalents from `trio.Path` or `anyio.Path`.

## Example
```python
import os


async def func():
    path = "my_file.txt"
    file_exists = os.path.exists(path)
```

Use instead:
```python
import trio


async def func():
    path = trio.Path("my_file.txt")
    file_exists = await path.exists()
```

Non-blocking methods are OK to use:
```python
import pathlib


async def func():
    path = pathlib.Path("my_file.txt")
    file_dirname = path.dirname()
    new_path = os.path.join("/tmp/src/", path)
```
## What it does
Checks that async functions do not contain blocking usage of input from user.

## Why is this bad?
Blocking an async function via a blocking input call will block the entire
event loop, preventing it from executing other tasks while waiting for user
input, negating the benefits of asynchronous programming.

Instead of making a blocking input call directly, wrap the input call in
an executor to execute the blocking call on another thread.

## Example
```python
async def foo():
    username = input("Username:")
```

Use instead:
```python
import asyncio


async def foo():
    loop = asyncio.get_running_loop()
    username = await loop.run_in_executor(None, input, "Username:")
```
## What it does
Checks that async functions do not call `time.sleep`.

## Why is this bad?
Blocking an async function via a `time.sleep` call will block the entire
event loop, preventing it from executing other tasks while waiting for the
`time.sleep`, negating the benefits of asynchronous programming.

Instead of `time.sleep`, use `asyncio.sleep`.

## Example
```python
import time


async def fetch():
    time.sleep(1)
```

Use instead:
```python
import asyncio


async def fetch():
    await asyncio.sleep(1)
```
## What it does
Checks for uses of the `assert` keyword.

## Why is this bad?
Assertions are removed when Python is run with optimization requested
(i.e., when the `-O` flag is present), which is a common practice in
production environments. As such, assertions should not be used for runtime
validation of user input or to enforce  interface constraints.

Consider raising a meaningful error instead of using `assert`.

## Example
```python
assert x > 0, "Expected positive value."
```

Use instead:
```python
if not x > 0:
    raise ValueError("Expected positive value.")

# or even better:
if x <= 0:
    raise ValueError("Expected positive value.")
```
## What it does
Checks for uses of the builtin `exec` function.

## Why is this bad?
The `exec()` function is insecure as it allows for arbitrary code
execution.

## Example
```python
exec("print('Hello World')")
```

## References
- [Python documentation: `exec`](https://docs.python.org/3/library/functions.html#exec)
- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)
## What it does
Checks for files with overly permissive permissions.

## Why is this bad?
Overly permissive file permissions may allow unintended access and
arbitrary code execution.

## Example
```python
import os

os.chmod("/etc/secrets.txt", 0o666)  # rw-rw-rw-
```

Use instead:
```