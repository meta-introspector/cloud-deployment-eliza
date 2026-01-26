# a7046c18:packages_core_python_.venv_bin_ruff:47251-47400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47251-47400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
fruits.filter(lambda fruit: fruit.startwith("p"))
assert len(fruits) == 2
```
## What it does
Checks for unnecessary nested `Literal`.

## Why is this bad?
Prefer using a single `Literal`, which is equivalent and more concise.

Parameterization of literals by other literals is supported as an ergonomic
feature as proposed in [PEP 586], to enable patterns such as:
```python
ReadOnlyMode         = Literal["r", "r+"]
WriteAndTruncateMode = Literal["w", "w+", "wt", "w+t"]
WriteNoTruncateMode  = Literal["r+", "r+t"]
AppendMode           = Literal["a", "a+", "at", "a+t"]

AllModes = Literal[ReadOnlyMode, WriteAndTruncateMode,
                  WriteNoTruncateMode, AppendMode]
```

As a consequence, type checkers also support nesting of literals
which is less readable than a flat `Literal`:
```python
AllModes = Literal[Literal["r", "r+"], Literal["w", "w+", "wt", "w+t"],
                  Literal["r+", "r+t"], Literal["a", "a+", "at", "a+t"]]
```

## Example
```python
AllModes = Literal[
    Literal["r", "r+"],
    Literal["w", "w+", "wt", "w+t"],
    Literal["r+", "r+t"],
    Literal["a", "a+", "at", "a+t"],
]
```

Use instead:
```python
AllModes = Literal[
    "r", "r+", "w", "w+", "wt", "w+t", "r+", "r+t", "a", "a+", "at", "a+t"
]
```

or assign the literal to a variable as in the first example.

## Fix safety
The fix for this rule is marked as unsafe when the `Literal` slice is split
across multiple lines and some of the lines have trailing comments.

## References
- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.python.org/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)

[PEP 586]: https://peps.python.org/pep-0586/
## What it does
Checks for non-raw literal string arguments passed to the `match` parameter
of `pytest.raises()` where the string contains at least one unescaped
regex metacharacter.

## Why is this bad?
The `match` argument is implicitly converted to a regex under the hood.
It should be made explicit whether the string is meant to be a regex or a "plain" pattern
by prefixing the string with the `r` suffix, escaping the metacharacter(s)
in the string using backslashes, or wrapping the entire string in a call to
`re.escape()`.

## Example

```python
import pytest


with pytest.raises(Exception, match="A full sentence."):
    do_thing_that_raises()
```

If the pattern is intended to be a regular expression, use a raw string to signal this
intention:

```python
import pytest


with pytest.raises(Exception, match=r"A full sentence."):
    do_thing_that_raises()
```

Alternatively, escape any regex metacharacters with `re.escape`:

```python
import pytest
import re


with pytest.raises(Exception, match=re.escape("A full sentence.")):
    do_thing_that_raises()
```

or directly with backslashes:

```python
import pytest
import re


with pytest.raises(Exception, "A full sentence\\."):
    do_thing_that_raises()
```

## References
- [Python documentation: `re.escape`](https://docs.python.org/3/library/re.html#re.escape)
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
## What it does
Checks for implicit class variables in dataclasses.

Variables matching the [`lint.dummy-variable-rgx`] are excluded
from this rule.

## Why is this bad?
Class variables are shared between all instances of that class.
In dataclasses, fields with no annotations at all
are implicitly considered class variables, and a `TypeError` is
raised if a user attempts to initialize an instance of the class
with this field.


```python
@dataclass
class C:
    a = 1
    b: str = ""

C(a = 42)  # TypeError: C.__init__() got an unexpected keyword argument 'a'
```

## Example

```python
@dataclass
class C:
    a = 1
```

Use instead:

```python
from typing import ClassVar


```