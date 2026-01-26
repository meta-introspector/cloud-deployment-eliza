# a7046c18:packages_core_python_.venv_bin_ruff:25651-25800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25651-25800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Why is this bad?
Like `print` statements, `pprint` statements used for debugging should
be omitted from production code. They can lead the accidental inclusion
of sensitive information in logs, and are not configurable by clients,
unlike `logging` statements.

`pprint` statements used to produce output as a part of a command-line
interface program are not typically a problem.

## Example
```python
import pprint


def merge_dicts(dict_a, dict_b):
    dict_c = {**dict_a, **dict_b}
    pprint.pprint(dict_c)
    return dict_c
```

Use instead:
```python
def merge_dicts(dict_a, dict_b):
    dict_c = {**dict_a, **dict_b}
    return dict_c
```

## Fix safety
This rule's fix is marked as unsafe, as it will remove `pprint` statements
that are used beyond debugging purposes.
## What it does
Checks that type `TypeVar`s, `ParamSpec`s, and `TypeVarTuple`s in stubs
have names prefixed with `_`.

## Why is this bad?
Prefixing type parameters with `_` avoids accidentally exposing names
internal to the stub.

## Example
```pyi
from typing import TypeVar

T = TypeVar("T")
```

Use instead:
```pyi
from typing import TypeVar

_T = TypeVar("_T")
```
## What it does
Checks for `if` statements with complex conditionals in stubs.

## Why is this bad?
Type checkers understand simple conditionals to express variations between
different Python versions and platforms. However, complex tests may not be
understood by a type checker, leading to incorrect inferences when they
analyze your code.

## Example
```pyi
import sys

if (3, 10) <= sys.version_info < (3, 12): ...
```

Use instead:
```pyi
import sys

if sys.version_info >= (3, 10) and sys.version_info < (3, 12): ...
```

## References
- [Typing documentation: Version and platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Checks for problematic `sys.version_info`-related conditions in stubs.

## Why is this bad?
Stub files support simple conditionals to test for differences in Python
versions using `sys.version_info`. However, there are a number of common
mistakes involving `sys.version_info` comparisons that should be avoided.
For example, comparing against a string can lead to unexpected behavior.

## Example
```pyi
import sys

if sys.version_info[0] == "2": ...
```

Use instead:
```pyi
import sys

if sys.version_info[0] == 2: ...
```

## References
- [Typing documentation: Version and Platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Checks for Python version comparisons in stubs that compare against patch
versions (e.g., Python 3.8.3) instead of major and minor versions (e.g.,
Python 3.8).

## Why is this bad?
Stub files support simple conditionals to test for differences in Python
versions and platforms. However, type checkers only understand a limited
subset of these conditionals. In particular, type checkers don't support
patch versions (e.g., Python 3.8.3), only major and minor versions (e.g.,
Python 3.8). Therefore, version checks in stubs should only use the major
and minor versions.

## Example
```pyi
import sys

if sys.version_info >= (3, 4, 3): ...
```

Use instead:
```pyi
import sys

if sys.version_info >= (3, 4): ...
```

## References
- [Typing documentation: Version and Platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Checks for Python version comparisons that compare against a tuple of the
wrong length.

## Why is this bad?
Stub files support simple conditionals to test for differences in Python
versions and platforms. When comparing against `sys.version_info`, avoid
comparing against tuples of the wrong length, which can lead to unexpected
behavior.

## Example
```pyi
import sys

if sys.version_info[:2] == (3,): ...
```

Use instead:
```pyi
```