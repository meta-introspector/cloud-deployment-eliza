# a7046c18:packages_core_python_.venv_bin_ruff:38251-38400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:38251-38400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```python
from math import *


def foo(): ...
```

[PEP 8]: https://peps.python.org/pep-0008/#imports
## What it does
Checks for `__future__` imports that are not defined in the current Python
version.

## Why is this bad?
Importing undefined or unsupported members from the `__future__` module is
a `SyntaxError`.

## References
- [Python documentation: `__future__`](https://docs.python.org/3/library/__future__.html)
## What it does
Checks for invalid `printf`-style format strings.

## Why is this bad?
Conversion specifiers are required for `printf`-style format strings. These
specifiers must contain a `%` character followed by a conversion type.

## Example
```python
"Hello, %" % "world"
```

Use instead:
```python
"Hello, %s" % "world"
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for named placeholders in `printf`-style format strings without
mapping-type values.

## Why is this bad?
When using named placeholders in `printf`-style format strings, the values
must be a map type (such as a dictionary). Otherwise, the expression will
raise a `TypeError`.

## Example
```python
"%(greeting)s, %(name)s" % ("Hello", "World")
```

Use instead:
```python
"%(greeting)s, %(name)s" % {"greeting": "Hello", "name": "World"}
```

Or:
```python
"%s, %s" % ("Hello", "World")
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for uses of mapping-type values in `printf`-style format strings
without named placeholders.

## Why is this bad?
When using mapping-type values (such as `dict`) in `printf`-style format
strings, the keys must be named. Otherwise, the expression will raise a
`TypeError`.

## Example
```python
"%s, %s" % {"greeting": "Hello", "name": "World"}
```

Use instead:
```python
"%(greeting)s, %(name)s" % {"greeting": "Hello", "name": "World"}
```

Or:
```python
"%s, %s" % ("Hello", "World")
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for unused mapping keys in `printf`-style format strings.

## Why is this bad?
Unused named placeholders in `printf`-style format strings are unnecessary,
and likely indicative of a mistake. They should be removed.

## Example
```python
"Hello, %(name)s" % {"greeting": "Hello", "name": "World"}
```

Use instead:
```python
"Hello, %(name)s" % {"name": "World"}
```

## Fix safety
This rule's fix is marked as unsafe for mapping key
containing function calls with potential side effects,
because removing such arguments could change the behavior of the code.

For example, the fix would be marked as unsafe in the following case:
```python
"Hello, %(name)s" % {"greeting": print(1), "name": "World"}
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for named placeholders in `printf`-style format strings that are not
present in the provided mapping.

## Why is this bad?
Named placeholders that lack a corresponding value in the provided mapping
will raise a `KeyError`.

## Example
```python
"%(greeting)s, %(name)s" % {"name": "world"}
```

Use instead:
```python
"Hello, %(name)s" % {"name": "world"}
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)
## What it does
Checks for `printf`-style format strings that have mixed positional and
named placeholders.

## Why is this bad?
Python does not support mixing positional and named placeholders in
`printf`-style format strings. The use of mixed placeholders will raise a
`TypeError` at runtime.

## Example
```python
```