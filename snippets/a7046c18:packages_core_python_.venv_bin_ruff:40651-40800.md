# a7046c18:packages_core_python_.venv_bin_ruff:40651-40800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40651-40800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
os.getenv("1")
```
## What it does
Checks for methods decorated with `@singledispatch`.

## Why is this bad?
The `@singledispatch` decorator is intended for use with functions, not methods.

Instead, use the `@singledispatchmethod` decorator, or migrate the method to a
standalone function.

## Example

```python
from functools import singledispatch


class Class:
    @singledispatch
    def method(self, arg): ...
```

Use instead:

```python
from functools import singledispatchmethod


class Class:
    @singledispatchmethod
    def method(self, arg): ...
```

## Fix safety
This rule's fix is marked as unsafe, as migrating from `@singledispatch` to
`@singledispatchmethod` may change the behavior of the code.

## Options

This rule applies to regular, static, and class methods. You can customize how Ruff categorizes
methods with the following options:

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`
## What it does
Checks for non-method functions decorated with `@singledispatchmethod`.

## Why is this bad?
The `@singledispatchmethod` decorator is intended for use with methods, not
functions.

Instead, use the `@singledispatch` decorator.

## Example

```python
from functools import singledispatchmethod


@singledispatchmethod
def func(arg): ...
```

Use instead:

```python
from functools import singledispatch


@singledispatch
def func(arg): ...
```

## Fix safety
This rule's fix is marked as unsafe, as migrating from `@singledispatchmethod` to
`@singledispatch` may change the behavior of the code.
## What it does
Checks for uses of `yield from` in async functions.

## Why is this bad?
Python doesn't support the use of `yield from` in async functions, and will
raise a `SyntaxError` in such cases.

Instead, considering refactoring the code to use an `async for` loop instead.

## Example
```python
async def numbers():
    yield from [1, 2, 3, 4, 5]
```

Use instead:
```python
async def numbers():
    async for number in [1, 2, 3, 4, 5]:
        yield number
```
## What it does
Checks for bidirectional formatting characters.

## Why is this bad?
The interaction between bidirectional formatting characters and the
surrounding code can be surprising to those that are unfamiliar
with right-to-left writing systems.

In some cases, bidirectional formatting characters can also be used to
obfuscate code and introduce or mask security vulnerabilities.

## Example
```python
example = "x‏" * 100  #    "‏x" is assigned
```

The example uses two `RIGHT-TO-LEFT MARK`s to make the `100 * ` appear inside the comment.
Without the `RIGHT-TO-LEFT MARK`s, the code looks like this:

```py
example = "x" * 100  #    "x" is assigned
```

## References
- [PEP 672: Bidirectional Marks, Embeddings, Overrides and Isolates](https://peps.python.org/pep-0672/#bidirectional-marks-embeddings-overrides-and-isolates)
## What it does
Checks for strings that contain the control character `BS`.

## Why is this bad?
Control characters are displayed differently by different text editors and
terminals.

By using the `\b` sequence in lieu of the `BS` control character, the
string will contain the same value, but will render visibly in all editors.

## Example
```python
x = ""
```

Use instead:
```python
x = "\b"
```
## What it does
Checks for strings that contain the raw control character `SUB`.

## Why is this bad?
Control characters are displayed differently by different text editors and
terminals.

By using the `\x1a` sequence in lieu of the `SUB` control character, the
string will contain the same value, but will render visibly in all editors.
```