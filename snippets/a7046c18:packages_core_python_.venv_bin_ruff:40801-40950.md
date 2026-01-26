# a7046c18:packages_core_python_.venv_bin_ruff:40801-40950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40801-40950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
x = ""
```

Use instead:
```python
x = "\x1a"
```
## What it does
Checks for strings that contain the raw control character `ESC`.

## Why is this bad?
Control characters are displayed differently by different text editors and
terminals.

By using the `\x1b` sequence in lieu of the `ESC` control character, the
string will contain the same value, but will render visibly in all editors.

## Example
```python
x = ""
```

Use instead:
```python
x = "\x1b"
```
## What it does
Checks for strings that contain the raw control character `NUL` (0 byte).

## Why is this bad?
Control characters are displayed differently by different text editors and
terminals.

By using the `\0` sequence in lieu of the `NUL` control character, the
string will contain the same value, but will render visibly in all editors.

## Example
```python
x = ""
```

Use instead:
```python
x = "\0"
```
## What it does
Checks for strings that contain the zero width space character.

## Why is this bad?
This character is rendered invisibly in some text editors and terminals.

By using the `\u200B` sequence, the string will contain the same value,
but will render visibly in all editors.

## Example
```python
x = "Dear Sir/Madam"
```

Use instead:
```python
x = "Dear Sir\u200b/\u200bMadam"  # zero width space
```
## What it does
Checks for loops in which a `set` is modified during iteration.

## Why is this bad?
If a `set` is modified during iteration, it will cause a `RuntimeError`.

If you need to modify a `set` within a loop, consider iterating over a copy
of the `set` instead.

## Known problems
This rule favors false negatives over false positives. Specifically, it
will only detect variables that can be inferred to be a `set` type based on
local type inference, and will only detect modifications that are made
directly on the variable itself (e.g., `set.add()`), as opposed to
modifications within other function calls (e.g., `some_function(set)`).

## Example
```python
nums = {1, 2, 3}
for num in nums:
    nums.add(num + 5)
```

Use instead:
```python
nums = {1, 2, 3}
for num in nums.copy():
    nums.add(num + 5)
```

## Fix safety
This fix is always unsafe because it changes the program’s behavior. Replacing the
original set with a copy during iteration allows code that would previously raise a
`RuntimeError` to run without error.

## References
- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)
## What it does
Checks for operations that compare a name to itself.

## Why is this bad?
Comparing a name to itself always results in the same value, and is likely
a mistake.

## Example
```python
foo == foo
```

In some cases, self-comparisons are used to determine whether a float is
NaN. Instead, prefer `math.isnan`:
```python
import math

math.isnan(foo)
```

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
## What it does
Checks for comparisons between constants.

## Why is this bad?
Comparing two constants will always resolve to the same value, so the
comparison is redundant. Instead, the expression should be replaced
with the result of the comparison.

## Example
```python
foo = 1 == 1
```

Use instead:
```python
foo = True
```

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
## What it does
Checks for the use of a classmethod being made without the decorator.

## Why is this bad?
When it comes to consistency and readability, it's preferred to use the decorator.
```