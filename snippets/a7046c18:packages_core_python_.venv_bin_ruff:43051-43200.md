# a7046c18:packages_core_python_.venv_bin_ruff:43051-43200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43051-43200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
variants based on [PEP 585].

## Why is this bad?
[PEP 585] enabled collections in the Python standard library (like `list`)
to be used as generics directly, instead of importing analogous members
from the `typing` module (like `typing.List`).

When available, the [PEP 585] syntax should be used instead of importing
members from the `typing` module, as it's more concise and readable.
Importing those members from `typing` is considered deprecated as of [PEP
585].

This rule is enabled when targeting Python 3.9 or later (see:
[`target-version`]). By default, it's _also_ enabled for earlier Python
versions if `from __future__ import annotations` is present, as
`__future__` annotations are not evaluated at runtime. If your code relies
on runtime type annotations (either directly or via a library like
Pydantic), you can disable this behavior for Python versions prior to 3.9
by setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.

## Example
```python
from typing import List

foo: List[int] = [1, 2, 3]
```

Use instead:
```python
foo: list[int] = [1, 2, 3]
```

## Fix safety
This rule's fix is marked as unsafe, as it may lead to runtime errors when
alongside libraries that rely on runtime type annotations, like Pydantic,
on Python versions prior to Python 3.9.

## Options
- `target-version`
- `lint.pyupgrade.keep-runtime-typing`

[PEP 585]: https://peps.python.org/pep-0585/
## What it does
Check for type annotations that can be rewritten based on [PEP 604] syntax.

## Why is this bad?
[PEP 604] introduced a new syntax for union type annotations based on the
`|` operator. This syntax is more concise and readable than the previous
`typing.Union` and `typing.Optional` syntaxes.

This rule is enabled when targeting Python 3.10 or later (see:
[`target-version`]). By default, it's _also_ enabled for earlier Python
versions if `from __future__ import annotations` is present, as
`__future__` annotations are not evaluated at runtime. If your code relies
on runtime type annotations (either directly or via a library like
Pydantic), you can disable this behavior for Python versions prior to 3.10
by setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.

## Example
```python
from typing import Union

foo: Union[int, str] = 1
```

Use instead:
```python
foo: int | str = 1
```

Note that this rule only checks for usages of `typing.Union`,
while `UP045` checks for `typing.Optional`.

## Fix safety
This rule's fix is marked as unsafe, as it may lead to runtime errors when
alongside libraries that rely on runtime type annotations, like Pydantic,
on Python versions prior to Python 3.10. It may also lead to runtime errors
in unusual and likely incorrect type annotations where the type does not
support the `|` operator.

## Options
- `target-version`
- `lint.pyupgrade.keep-runtime-typing`

[PEP 604]: https://peps.python.org/pep-0604/
## What it does
Checks for `super` calls that pass redundant arguments.

## Why is this bad?
In Python 3, `super` can be invoked without any arguments when: (1) the
first argument is `__class__`, and (2) the second argument is equivalent to
the first argument of the enclosing method.

When possible, omit the arguments to `super` to make the code more concise
and maintainable.

## Example
```python
class A:
    def foo(self):
        pass


class B(A):
    def bar(self):
        super(B, self).foo()
```

Use instead:
```python
class A:
    def foo(self):
        pass


class B(A):
    def bar(self):
        super().foo()
```

## Fix safety

This rule's fix is marked as unsafe because removing the arguments from a call
may delete comments that are attached to the arguments.

In [preview], the fix is marked safe if no comments are present.

[preview]: https://docs.astral.sh/ruff/preview/

## References
- [Python documentation: `super`](https://docs.python.org/3/library/functions.html#super)
- [super/MRO, Python's most misunderstood feature.](https://www.youtube.com/watch?v=X1PQ7zzltz4)
## What it does
Checks for unnecessary UTF-8 encoding declarations.

## Why is this bad?
[PEP 3120] makes UTF-8 the default encoding, so a UTF-8 encoding
declaration is unnecessary.

## Example
```python
# -*- coding: utf-8 -*-
print("Hello, world!")
```

Use instead:
```python
print("Hello, world!")
```

```