# a7046c18:packages_core_python_.venv_bin_ruff:34051-34200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34051-34200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
x = 128 << 1
```

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for missing whitespace around the modulo operator.

## Why is this bad?
[PEP 8] recommends never using more than one space, and always having the
same amount of whitespace on both sides of a binary operator.

For consistency, this rule enforces one space before and after a modulo
operator (`%`).

(Note that [PEP 8] suggests only adding whitespace around the operator with
the lowest precedence, but that authors should "use [their] own judgment".)

## Example
```python
remainder = 10%2
```

Use instead:
```python
remainder = 10 % 2
```

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for missing whitespace after `,`, `;`, and `:`.

## Why is this bad?
Missing whitespace after `,`, `;`, and `:` makes the code harder to read.

## Example
```python
a = (1,2)
```

Use instead:
```python
a = (1, 2)
```
## What it does
Checks for extraneous whitespace after a comma.

## Why is this bad?
Consistency is good. This rule helps ensure you have a consistent
formatting style across your project.

## Example
```python
a = 4,    5
```

Use instead:
```python
a = 4, 5
```
## What it does
Checks for extraneous tabs after a comma.

## Why is this bad?
Commas should be followed by one space, never tabs.

## Example
```python
a = 4,\t5
```

Use instead:
```python
a = 4, 5
```

## What it does
Checks for missing whitespace around the equals sign in an unannotated
function keyword parameter.

## Why is this bad?
According to [PEP 8], there should be no spaces around the equals sign in a
keyword parameter, if it is unannotated:

> Don’t use spaces around the = sign when used to indicate a keyword
> argument, or when used to indicate a default value for an unannotated
> function parameter.

## Example
```python
def add(a = 0) -> int:
    return a + 1
```

Use instead:
```python
def add(a=0) -> int:
    return a + 1
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks for missing whitespace around the equals sign in an annotated
function keyword parameter.

## Why is this bad?
According to [PEP 8], the spaces around the equals sign in a keyword
parameter should only be omitted when the parameter is unannotated:

> Don’t use spaces around the = sign when used to indicate a keyword
> argument, or when used to indicate a default value for an unannotated
> function parameter.

## Example
```python
def add(a: int=0) -> int:
    return a + 1
```

Use instead:
```python
def add(a: int = 0) -> int:
    return a + 1
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks if inline comments are separated by at least two spaces.

## Why is this bad?
An inline comment is a comment on the same line as a statement.

Per [PEP 8], inline comments should be separated by at least two spaces from
the preceding statement.

## Example
```python
x = x + 1 # Increment x
```

Use instead:
```python
x = x + 1  # Increment x
x = x + 1    # Increment x
```

[PEP 8]: https://peps.python.org/pep-0008/#comments
## What it does
Checks if one space is used after inline comments.

## Why is this bad?
```