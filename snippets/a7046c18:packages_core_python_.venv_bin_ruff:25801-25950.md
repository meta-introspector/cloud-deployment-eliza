# a7046c18:packages_core_python_.venv_bin_ruff:25801-25950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25801-25950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import sys

if sys.version_info[0] == 3: ...
```

## References
- [Typing documentation: Version and Platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Checks for uses of comparators other than `<` and `>=` for
`sys.version_info` checks. All other comparators, such
as `>`, `<=`, and `==`, are banned.

## Why is this bad?
Comparing `sys.version_info` with `==` or `<=` has unexpected behavior
and can lead to bugs.

For example, `sys.version_info > (3, 8, 1)` will resolve to `True` if your
Python version is 3.8.1; meanwhile, `sys.version_info <= (3, 8)` will _not_
resolve to `True` if your Python version is 3.8.10:

```python
>>> import sys
>>> print(sys.version_info)
sys.version_info(major=3, minor=8, micro=10, releaselevel='final', serial=0)
>>> print(sys.version_info > (3, 8))
True
>>> print(sys.version_info == (3, 8))
False
>>> print(sys.version_info <= (3, 8))
False
>>> print(sys.version_info in (3, 8))
False
```

## Example
```py
import sys

if sys.version_info > (3, 8): ...
```

Use instead:
```py
import sys

if sys.version_info >= (3, 9): ...
```

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Check for unrecognized `sys.platform` checks. Platform checks should be
simple string comparisons.

**Note**: this rule is only enabled in `.pyi` stub files.

## Why is this bad?
Some `sys.platform` checks are too complex for type checkers to
understand, and thus result in incorrect inferences by these tools.
`sys.platform` checks should be simple string comparisons, like
`if sys.platform == "linux"`.

## Example
```pyi
import sys

if sys.platform == "xunil"[::-1]:
    # Linux specific definitions
    ...
else:
    # Posix specific definitions
    ...
```

Instead, use a simple string comparison, such as `==` or `!=`:
```pyi
import sys

if sys.platform == "linux":
    # Linux specific definitions
    ...
else:
    # Posix specific definitions
    ...
```

## References
- [Typing documentation: Version and Platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Check for unrecognized platform names in `sys.platform` checks.

**Note**: this rule is only enabled in `.pyi` stub files.

## Why is this bad?
If a `sys.platform` check compares to a platform name outside of a
small set of known platforms (e.g. "linux", "win32", etc.), it's likely
a typo or a platform name that is not recognized by type checkers.

The list of known platforms is: "linux", "win32", "cygwin", "darwin".

## Example
```pyi
import sys

if sys.platform == "linus": ...
```

Use instead:
```pyi
import sys

if sys.platform == "linux": ...
```

## References
- [Typing documentation: Version and Platform checking](https://typing.python.org/en/latest/spec/directives.html#version-and-platform-checks)
## What it does
Checks for `pass` statements in empty stub bodies.

## Why is this bad?
For stylistic consistency, `...` should always be used rather than `pass`
in stub files.

## Example
```pyi
def foo(bar: int) -> list[int]: pass
```

Use instead:
```pyi
def foo(bar: int) -> list[int]: ...
```

## References
- [Typing documentation - Writing and Maintaining Stub Files](https://typing.python.org/en/latest/guides/writing_stubs.html)
## What it does
Checks for non-empty function stub bodies.

## Why is this bad?
Stub files are never executed at runtime; they should be thought of as
"data files" for type checkers or IDEs. Function bodies are redundant
for this purpose.

## Example
```pyi
def double(x: int) -> int:
    return x * 2
```

Use instead:
```pyi
```