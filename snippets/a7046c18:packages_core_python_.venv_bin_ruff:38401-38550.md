# a7046c18:packages_core_python_.venv_bin_ruff:38401-38550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:38401-38550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"%s, %(name)s" % ("Hello", {"name": "World"})
```

Use instead:
```python
"%s, %s" % ("Hello", "World")
```

Or:
```python
"%(greeting)s, %(name)s" % {"greeting": "Hello", "name": "World"}
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for `printf`-style format strings that have a mismatch between the
number of positional placeholders and the number of substitution values.

## Why is this bad?
When a `printf`-style format string is provided with too many or too few
substitution values, it will raise a `TypeError` at runtime.

## Example
```python
"%s, %s" % ("Hello", "world", "!")
```

Use instead:
```python
"%s, %s" % ("Hello", "world")
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for `printf`-style format strings that use the `*` specifier with
non-tuple values.

## Why is this bad?
The use of the `*` specifier with non-tuple values will raise a
`TypeError` at runtime.

## Example
```python
from math import pi

"%(n).*f" % {"n": (2, pi)}
```

Use instead:
```python
from math import pi

"%.*f" % (2, pi)  # 3.14
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for `printf`-style format strings with invalid format characters.

## Why is this bad?
In `printf`-style format strings, the `%` character is used to indicate
placeholders. If a `%` character is not followed by a valid format
character, it will raise a `ValueError` at runtime.

## Example
```python
"Hello, %S" % "world"
```

Use instead:
```python
"Hello, %s" % "world"
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for `str.format` calls with invalid format strings.

## Why is this bad?
Invalid format strings will raise a `ValueError`.

## Example
```python
"{".format(foo)
```

Use instead:
```python
"{}".format(foo)
```

## References
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `str.format` calls with unused keyword arguments.

## Why is this bad?
Unused keyword arguments are redundant, and often indicative of a mistake.
They should be removed.

## Example
```python
"Hello, {name}".format(greeting="Hello", name="World")
```

Use instead:
```python
"Hello, {name}".format(name="World")
```

## Fix safety
This rule's fix is marked as unsafe if the unused keyword argument
contains a function call with potential side effects,
because removing such arguments could change the behavior of the code.

For example, the fix would be marked as unsafe in the following case:
```python
"Hello, {name}".format(greeting=print(1), name="World")
```

## References
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `str.format` calls with unused positional arguments.

## Why is this bad?
Unused positional arguments are redundant, and often indicative of a mistake.
They should be removed.

## Example
```python
"Hello, {0}".format("world", "!")
```

Use instead:
```python
"Hello, {0}".format("world")
```

## Fix safety
This rule's fix is marked as unsafe if the unused positional argument
contains a function call with potential side effects,
because removing such arguments could change the behavior of the code.

For example, the fix would be marked as unsafe in the following case:
```python
```