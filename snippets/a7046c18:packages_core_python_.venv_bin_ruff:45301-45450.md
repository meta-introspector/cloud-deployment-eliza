# a7046c18:packages_core_python_.venv_bin_ruff:45301-45450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45301-45450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:

```python
from datetime import datetime


date = "2025-01-01T00:00:00Z"

datetime.fromisoformat(date)
```

## Fix safety
The fix is always marked as unsafe,
as it might change the program's behaviour.

For example, working code might become non-working:

```python
d = "Z2025-01-01T00:00:00Z"  # Note the leading `Z`

datetime.fromisoformat(d.strip("Z") + "+00:00")  # Fine
datetime.fromisoformat(d)  # Runtime error
```

## References
* [What’s New In Python 3.11 &sect; `datetime`](https://docs.python.org/3/whatsnew/3.11.html#datetime)
* [`fromisoformat`](https://docs.python.org/3/library/datetime.html#datetime.date.fromisoformat)

[iso-8601]: https://www.iso.org/obp/ui/#iso:std:iso:8601
[fromisoformat]: https://docs.python.org/3/library/datetime.html#datetime.date.fromisoformat
## What it does
Checks for `math.log` calls with a redundant base.

## Why is this bad?
The default base of `math.log` is `e`, so specifying it explicitly is
redundant.

Instead of passing 2 or 10 as the base, use `math.log2` or `math.log10`
respectively, as these dedicated variants are typically more accurate
than `math.log`.

## Example
```python
import math

math.log(4, math.e)
math.log(4, 2)
math.log(4, 10)
```

Use instead:
```python
import math

math.log(4)
math.log2(4)
math.log10(4)
```

## Fix safety
This fix is marked unsafe when the argument is a starred expression, as this changes
the call semantics and may raise runtime errors. It is also unsafe if comments are
present within the call, as they will be removed. Additionally, `math.log(x, base)`
and `math.log2(x)` / `math.log10(x)` may differ due to floating-point rounding, so
the fix is also unsafe when making this transformation.

## References
- [Python documentation: `math.log`](https://docs.python.org/3/library/math.html#math.log)
- [Python documentation: `math.log2`](https://docs.python.org/3/library/math.html#math.log2)
- [Python documentation: `math.log10`](https://docs.python.org/3/library/math.html#math.log10)
- [Python documentation: `math.e`](https://docs.python.org/3/library/math.html#math.e)
## What it does
Checks for unnecessary `from_float` and `from_decimal` usages to construct
`Decimal` and `Fraction` instances.

## Why is this bad?
Since Python 3.2, the `Fraction` and `Decimal` classes can be constructed
by passing float or decimal instances to the constructor directly. As such,
the use of `from_float` and `from_decimal` methods is unnecessary, and
should be avoided in favor of the more concise constructor syntax.

However, there are important behavioral differences between the `from_*` methods
and the constructors:
- The `from_*` methods validate their argument types and raise `TypeError` for invalid types
- The constructors accept broader argument types without validation
- The `from_*` methods have different parameter names than the constructors

## Example
```python
from decimal import Decimal
from fractions import Fraction

Decimal.from_float(4.2)
Decimal.from_float(float("inf"))
Fraction.from_float(4.2)
Fraction.from_decimal(Decimal("4.2"))
```

Use instead:
```python
from decimal import Decimal
from fractions import Fraction

Decimal(4.2)
Decimal("inf")
Fraction(4.2)
Fraction(Decimal("4.2"))
```

## Fix safety
This rule's fix is marked as unsafe by default because:
- The `from_*` methods provide type validation that the constructors don't
- Removing type validation can change program behavior
- The parameter names are different between methods and constructors

The fix is marked as safe only when:
- The argument type is known to be valid for the target constructor
- No keyword arguments are used, or they match the constructor's parameters

## References
- [Python documentation: `decimal`](https://docs.python.org/3/library/decimal.html)
- [Python documentation: `fractions`](https://docs.python.org/3/library/fractions.html)
## What it does
Checks for uses of `int` with an explicit base in which a string expression
is stripped of its leading prefix (i.e., `0b`, `0o`, or `0x`).

## Why is this bad?
Given an integer string with a prefix (e.g., `0xABC`), Python can automatically
determine the base of the integer by the prefix without needing to specify
it explicitly.

Instead of `int(num[2:], 16)`, use `int(num, 0)`, which will automatically
deduce the base based on the prefix.

## Example
```python
num = "0xABC"

if num.startswith("0b"):
    i = int(num[2:], 2)
elif num.startswith("0o"):
    i = int(num[2:], 8)
elif num.startswith("0x"):
    i = int(num[2:], 16)

print(i)
```

```