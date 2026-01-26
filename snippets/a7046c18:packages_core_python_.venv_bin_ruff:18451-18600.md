# a7046c18:packages_core_python_.venv_bin_ruff:18451-18600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18451-18600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        async with session.get("https://example.com/foo/bar") as resp:
            ...
```
## What it does
Checks that async functions do not use blocking httpx clients.

## Why is this bad?
Blocking an async function via a blocking HTTP call will block the entire
event loop, preventing it from executing other tasks while waiting for the
HTTP response, negating the benefits of asynchronous programming.

Instead of using the blocking `httpx` client, use the asynchronous client.

## Example
```python
import httpx


async def fetch():
    client = httpx.Client()
    response = client.get(...)
```

Use instead:
```python
import httpx


async def fetch():
    async with httpx.AsyncClient() as client:
        response = await client.get(...)
```
## What it does
Checks that async functions do not create subprocesses with blocking methods.

## Why is this bad?
Blocking an async function via a blocking call will block the entire
event loop, preventing it from executing other tasks while waiting for the
call to complete, negating the benefits of asynchronous programming.

Instead of making a blocking call, use an equivalent asynchronous library
or function, like [`trio.run_process()`](https://trio.readthedocs.io/en/stable/reference-io.html#trio.run_process)
or [`anyio.run_process()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.run_process).

## Example
```python
import os


async def foo():
    os.popen(cmd)
```

Use instead:
```python
import asyncio


async def foo():
    asyncio.create_subprocess_shell(cmd)
```
## What it does
Checks that async functions do not run processes with blocking methods.

## Why is this bad?
Blocking an async function via a blocking call will block the entire
event loop, preventing it from executing other tasks while waiting for the
call to complete, negating the benefits of asynchronous programming.

Instead of making a blocking call, use an equivalent asynchronous library
or function, like [`trio.run_process()`](https://trio.readthedocs.io/en/stable/reference-io.html#trio.run_process)
or [`anyio.run_process()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.run_process).

## Example
```python
import subprocess


async def foo():
    subprocess.run(cmd)
```

Use instead:
```python
import asyncio


async def foo():
    asyncio.create_subprocess_shell(cmd)
```
## What it does
Checks that async functions do not wait on processes with blocking methods.

## Why is this bad?
Blocking an async function via a blocking call will block the entire
event loop, preventing it from executing other tasks while waiting for the
call to complete, negating the benefits of asynchronous programming.

Instead of making a blocking call, use an equivalent asynchronous library
or function, like [`trio.to_thread.run_sync()`](https://trio.readthedocs.io/en/latest/reference-core.html#trio.to_thread.run_sync)
or [`anyio.to_thread.run_sync()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.to_thread.run_sync).

## Example
```python
import os


async def foo():
    os.waitpid(0)
```

Use instead:
```python
import asyncio
import os


def wait_for_process():
    os.waitpid(0)


async def foo():
    await asyncio.loop.run_in_executor(None, wait_for_process)
```
## What it does
Checks that async functions do not open files with blocking methods like `open`.

## Why is this bad?
Blocking an async function via a blocking call will block the entire
event loop, preventing it from executing other tasks while waiting for the
call to complete, negating the benefits of asynchronous programming.

Instead of making a blocking call, use an equivalent asynchronous library
or function.

## Example
```python
async def foo():
    with open("bar.txt") as f:
        contents = f.read()
```

Use instead:
```python
import anyio


async def foo():
    async with await anyio.open_file("bar.txt") as f:
        contents = await f.read()
```