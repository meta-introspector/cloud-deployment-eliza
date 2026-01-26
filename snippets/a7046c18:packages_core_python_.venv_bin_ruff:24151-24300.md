# a7046c18:packages_core_python_.venv_bin_ruff:24151-24300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:24151-24300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
using a more descriptive comment tag (e.g, "TODO").

## Example
```python
def speed(distance, time):
    return distance / time  # XXX: Raises ZeroDivisionError for time = 0.
```
## What it does
Checks for "HACK" comments.

## Why is this bad?
"HACK" comments are used to describe an issue that should be resolved
(usually, a suboptimal solution or temporary workaround).

Consider resolving the issue before deploying the code.

Note that if you use "HACK" comments as a form of documentation, this
rule may not be appropriate for your project.

## Example
```python
import os


def running_windows():  # HACK: Use platform module instead.
    try:
        os.mkdir("C:\\Windows\\System32\\")
    except FileExistsError:
        return True
    else:
        os.rmdir("C:\\Windows\\System32\\")
        return False
```
## What it does
Checks for missing `from __future__ import annotations` imports upon
detecting type annotations that can be written more succinctly under
PEP 563.

## Why is this bad?
PEP 585 enabled the use of a number of convenient type annotations, such as
`list[str]` instead of `List[str]`. However, these annotations are only
available on Python 3.9 and higher, _unless_ the `from __future__ import annotations`
import is present.

Similarly, PEP 604 enabled the use of the `|` operator for unions, such as
`str | None` instead of `Optional[str]`. However, these annotations are only
available on Python 3.10 and higher, _unless_ the `from __future__ import annotations`
import is present.

By adding the `__future__` import, the pyupgrade rules can automatically
migrate existing code to use the new syntax, even for older Python versions.
This rule thus pairs well with pyupgrade and with Ruff's pyupgrade rules.

This rule respects the [`target-version`] setting. For example, if your
project targets Python 3.10 and above, adding `from __future__ import annotations`
does not impact your ability to leverage PEP 604-style unions (e.g., to
convert `Optional[str]` to `str | None`). As such, this rule will only
flag such usages if your project targets Python 3.9 or below.

## Example

```python
from typing import List, Dict, Optional


def func(obj: Dict[str, Optional[int]]) -> None: ...
```

Use instead:

```python
from __future__ import annotations

from typing import List, Dict, Optional


def func(obj: Dict[str, Optional[int]]) -> None: ...
```

After running the additional pyupgrade rules:

```python
from __future__ import annotations


def func(obj: dict[str, int | None]) -> None: ...
```

## Fix safety
This rule's fix is marked as unsafe, as adding `from __future__ import annotations`
may change the semantics of the program.

## Options
- `target-version`
## What it does
Checks for uses of PEP 585- and PEP 604-style type annotations in Python
modules that lack the required `from __future__ import annotations` import
for compatibility with older Python versions.

## Why is this bad?
Using PEP 585 and PEP 604 style annotations without a `from __future__ import
annotations` import will cause runtime errors on Python versions prior to
3.9 and 3.10, respectively.

By adding the `__future__` import, the interpreter will no longer interpret
annotations at evaluation time, making the code compatible with both past
and future Python versions.

This rule respects the [`target-version`] setting. For example, if your
project targets Python 3.10 and above, adding `from __future__ import annotations`
does not impact your ability to leverage PEP 604-style unions (e.g., to
convert `Optional[str]` to `str | None`). As such, this rule will only
flag such usages if your project targets Python 3.9 or below.

## Example

```python
def func(obj: dict[str, int | None]) -> None: ...
```

Use instead:

```python
from __future__ import annotations


def func(obj: dict[str, int | None]) -> None: ...
```

## Fix safety
This rule's fix is marked as unsafe, as adding `from __future__ import annotations`
may change the semantics of the program.

## Options
- `target-version`
## What it does
Checks for f-strings in `gettext` function calls.

## Why is this bad?
In the `gettext` API, the `gettext` function (often aliased to `_`) returns
a translation of its input argument by looking it up in a translation
catalog.

Calling `gettext` with an f-string as its argument can cause unexpected
behavior. Since the f-string is resolved before the function call, the
translation catalog will look up the formatted string, rather than the
f-string template.

Instead, format the value returned by the function call, rather than
its argument.
```