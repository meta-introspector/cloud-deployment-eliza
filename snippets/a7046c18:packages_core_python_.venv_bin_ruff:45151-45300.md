# a7046c18:packages_core_python_.venv_bin_ruff:45151-45300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45151-45300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Use instead:
```python
A = math.pi * r**2
```

## References
- [Python documentation: `math` constants](https://docs.python.org/3/library/math.html#constants)
## What it does
Checks for consecutive `global` (or `nonlocal`) statements.

## Why is this bad?
The `global` and `nonlocal` keywords accepts multiple comma-separated names.
Instead of using multiple `global` (or `nonlocal`) statements for separate
variables, you can use a single statement to declare multiple variables at
once.

## Example
```python
def func():
    global x
    global y

    print(x, y)
```

Use instead:
```python
def func():
    global x, y

    print(x, y)
```

## References
- [Python documentation: the `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)
- [Python documentation: the `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#the-nonlocal-statement)
## What it does
Checks for uses of hardcoded charsets, which are defined in Python string module.

## Why is this bad?
Usage of named charsets from the standard library is more readable and less error-prone.

## Example
```python
x = "0123456789"
y in "abcdefghijklmnopqrstuvwxyz"
```

Use instead
```python
import string

x = string.digits
y in string.ascii_lowercase
```

## References
- [Python documentation: String constants](https://docs.python.org/3/library/string.html#string-constants)
## What it does
Checks for unnecessary string literal or float casts in `Decimal`
constructors.

## Why is this bad?
The `Decimal` constructor accepts a variety of arguments, including
integers, floats, and strings. However, it's not necessary to cast
integer literals to strings when passing them to the `Decimal`.

Similarly, `Decimal` accepts `inf`, `-inf`, and `nan` as string literals,
so there's no need to wrap those values in a `float` call when passing
them to the `Decimal` constructor.

Prefer the more concise form of argument passing for `Decimal`
constructors, as it's more readable and idiomatic.

Note that this rule does not flag quoted float literals such as `Decimal("0.1")`, which will
produce a more precise `Decimal` value than the unquoted `Decimal(0.1)`.

## Example
```python
from decimal import Decimal

Decimal("0")
Decimal(float("Infinity"))
```

Use instead:
```python
from decimal import Decimal

Decimal(0)
Decimal("Infinity")
```

## References
- [Python documentation: `decimal`](https://docs.python.org/3/library/decimal.html)
## What it does
Checks for uses of `bin(...).count("1")` to perform a population count.

## Why is this bad?
In Python 3.10, a `bit_count()` method was added to the `int` class,
which is more concise and efficient than converting to a binary
representation via `bin(...)`.

## Example
```python
x = bin(123).count("1")
y = bin(0b1111011).count("1")
```

Use instead:
```python
x = (123).bit_count()
y = 0b1111011.bit_count()
```

## Fix safety
This rule's fix is marked as unsafe unless the argument to `bin` can be inferred as
an instance of a type that implements the `__index__` and `bit_count` methods because this can
change the exception raised at runtime for an invalid argument.

## Options
- `target-version`

## References
- [Python documentation:`int.bit_count`](https://docs.python.org/3/library/stdtypes.html#int.bit_count)
## What it does
Checks for `datetime.fromisoformat()` calls
where the only argument is an inline replacement
of `Z` with a zero offset timezone.

## Why is this bad?
On Python 3.11 and later, `datetime.fromisoformat()` can handle most [ISO 8601][iso-8601]
formats including ones affixed with `Z`, so such an operation is unnecessary.

More information on unsupported formats
can be found in [the official documentation][fromisoformat].

## Example

```python
from datetime import datetime


date = "2025-01-01T00:00:00Z"

datetime.fromisoformat(date.replace("Z", "+00:00"))
datetime.fromisoformat(date[:-1] + "-00")
datetime.fromisoformat(date.strip("Z", "-0000"))
datetime.fromisoformat(date.rstrip("Z", "-00:00"))
```