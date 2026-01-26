# a7046c18:packages_core_python_.venv_bin_ruff:45451-45600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45451-45600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Use instead:
```python
num = "0xABC"

i = int(num, 0)

print(i)
```

## Fix safety
The rule's fix is marked as unsafe, as Ruff cannot guarantee that the
argument to `int` will remain valid when its base is included in the
function call.

## References
- [Python documentation: `int`](https://docs.python.org/3/library/functions.html#int)
## What it does
Checks for the use of shorthand aliases for regular expression flags
(e.g., `re.I` instead of `re.IGNORECASE`).

## Why is this bad?
The regular expression module provides descriptive names for each flag,
along with single-letter aliases. Prefer the descriptive names, as they
are more readable and self-documenting.

## Example
```python
import re

if re.match("^hello", "hello world", re.I):
    ...
```

Use instead:
```python
import re

if re.match("^hello", "hello world", re.IGNORECASE):
    ...
```
## What it does
Checks for uses of `isinstance` that check if an object is of type `None`.

## Why is this bad?
There is only ever one instance of `None`, so it is more efficient and
readable to use the `is` operator to check if an object is `None`.

## Example
```python
isinstance(obj, type(None))
```

Use instead:
```python
obj is None
```

## Fix safety
The fix will be marked as unsafe if there are any comments within the call.

## References
- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)
- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)
- [Python documentation: `type`](https://docs.python.org/3/library/functions.html#type)
- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)
## What it does
Checks for uses of `type` that compare the type of an object to the type of `None`.

## Why is this bad?
There is only ever one instance of `None`, so it is more efficient and
readable to use the `is` operator to check if an object is `None`.

## Example
```python
type(obj) is type(None)
```

Use instead:
```python
obj is None
```

## Fix safety
If the fix might remove comments, it will be marked as unsafe.

## References
- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)
- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)
- [Python documentation: `type`](https://docs.python.org/3/library/functions.html#type)
- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)
## What it does
Checks for membership tests against single-item containers.

## Why is this bad?
Performing a membership test against a container (like a `list` or `set`)
with a single item is less readable and less efficient than comparing
against the item directly.

## Example
```python
1 in [1]
```

Use instead:
```python
1 == 1
```

## Fix safety
The fix is always marked as unsafe.

When the right-hand side is a string, this fix can change the behavior of your program.
This is because `c in "a"` is true both when `c` is `"a"` and when `c` is the empty string.

Additionally, converting `in`/`not in` against a single-item container to `==`/`!=` can
change runtime behavior: `in` may consider identity (e.g., `NaN`) and always
yields a `bool`.

Comments within the replacement range will also be removed.

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)
## What it does
Checks for current-directory lookups using `Path().resolve()`.

## Why is this bad?
When looking up the current directory, prefer `Path.cwd()` over
`Path().resolve()`, as `Path.cwd()` is more explicit in its intent.

## Example
```python
from pathlib import Path

cwd = Path().resolve()
```

Use instead:
```python
from pathlib import Path

cwd = Path.cwd()
```

## References
- [Python documentation: `Path.cwd`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.cwd)
## What it does
Checks for uses of `metaclass=abc.ABCMeta` to define abstract base classes
(ABCs).

```