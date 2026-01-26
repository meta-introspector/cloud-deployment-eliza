# a7046c18:packages_core_python_.venv_bin_ruff:18301-18450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18301-18450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:

```python
async def long_running_task(): ...


async def main():
    async with asyncio.timeout(2):
        await long_running_task()
```

## References
- [`asyncio` timeouts](https://docs.python.org/3/library/asyncio-task.html#timeouts)
- [`anyio` timeouts](https://anyio.readthedocs.io/en/stable/cancellation.html)
- [`trio` timeouts](https://trio.readthedocs.io/en/stable/reference-core.html#cancellation-and-timeouts)

["structured concurrency"]: https://vorpus.org/blog/some-thoughts-on-asynchronous-api-design-in-a-post-asyncawait-world/#timeouts-and-cancellation
## What it does
Checks for the use of an async sleep function in a `while` loop.

## Why is this bad?
Instead of sleeping in a `while` loop, and waiting for a condition
to become true, it's preferable to `await` on an `Event` object such
as: `asyncio.Event`, `trio.Event`, or `anyio.Event`.

## Example
```python
import asyncio

DONE = False


async def func():
    while not DONE:
        await asyncio.sleep(1)
```

Use instead:
```python
import asyncio

DONE = asyncio.Event()


async def func():
    await DONE.wait()
```

## References
- [`asyncio` events](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Event)
- [`anyio` events](https://anyio.readthedocs.io/en/latest/api.html#anyio.Event)
- [`trio` events](https://trio.readthedocs.io/en/latest/reference-core.html#trio.Event)
## What it does
Checks for uses of `trio.sleep(0)` or `anyio.sleep(0)`.

## Why is this bad?
`trio.sleep(0)` is equivalent to calling `trio.lowlevel.checkpoint()`.
However, the latter better conveys the intent of the code.

## Example
```python
import trio


async def func():
    await trio.sleep(0)
```

Use instead:
```python
import trio


async def func():
    await trio.lowlevel.checkpoint()
```
## Fix safety
This rule's fix is marked as unsafe if there's comments in the
`trio.sleep(0)` expression, as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
import trio


async def func():
    await trio.sleep(  # comment
        # comment
        0
    )
```
## What it does
Checks for uses of `trio.sleep()` or `anyio.sleep()` with a delay greater than 24 hours.

## Why is this bad?
Calling `sleep()` with a delay greater than 24 hours is usually intended
to sleep indefinitely. Instead of using a large delay,
`trio.sleep_forever()` or `anyio.sleep_forever()` better conveys the intent.


## Example
```python
import trio


async def func():
    await trio.sleep(86401)
```

Use instead:
```python
import trio


async def func():
    await trio.sleep_forever()
```

## Fix safety

This fix is marked as unsafe as it changes program behavior.
## What it does
Checks that async functions do not contain blocking HTTP calls.

## Why is this bad?
Blocking an async function via a blocking HTTP call will block the entire
event loop, preventing it from executing other tasks while waiting for the
HTTP response, negating the benefits of asynchronous programming.

Instead of making a blocking HTTP call, use an asynchronous HTTP client
library such as `aiohttp` or `httpx`.

## Example
```python
import urllib


async def fetch():
    urllib.request.urlopen("https://example.com/foo/bar").read()
```

Use instead:
```python
import aiohttp


async def fetch():
    async with aiohttp.ClientSession() as session:
```