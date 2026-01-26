# a7046c18:packages_core_python_.venv_bin_ruff:33901-34050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33901-34050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
by any trailing whitespace.

## Example
```python
spam (1)
```

Use instead:
```python
spam(1)
```

[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves
## What it does
Checks for extraneous whitespace before an operator.

## Why is this bad?
According to [PEP 8], operators should be surrounded by at most a single space on either
side.

## Example
```python
a = 4  + 5
```

Use instead:
```python
a = 4 + 5
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks for extraneous whitespace after an operator.

## Why is this bad?
According to [PEP 8], operators should be surrounded by at most a single space on either
side.

## Example
```python
a = 4 +  5
```

Use instead:
```python
a = 4 + 5
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks for extraneous tabs before an operator.

## Why is this bad?
According to [PEP 8], operators should be surrounded by at most a single space on either
side.

## Example
```python
a = 4\t+ 5
```

Use instead:
```python
a = 4 + 5
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks for extraneous tabs after an operator.

## Why is this bad?
According to [PEP 8], operators should be surrounded by at most a single space on either
side.

## Example
```python
a = 4 +\t5
```

Use instead:
```python
a = 4 + 5
```

[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements
## What it does
Checks for missing whitespace around all operators.

## Why is this bad?
According to [PEP 8], there should be one space before and after all
assignment (`=`), augmented assignment (`+=`, `-=`, etc.), comparison,
and Booleans operators.

## Example
```python
if number==42:
    print('you have found the meaning of life')
```

Use instead:
```python
if number == 42:
    print('you have found the meaning of life')
```

[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves
## What it does
Checks for missing whitespace arithmetic operators.

## Why is this bad?
[PEP 8] recommends never using more than one space, and always having the
same amount of whitespace on both sides of a binary operator.

For consistency, this rule enforces one space before and after an
arithmetic operator (`+`, `-`, `/`, and `*`).

(Note that [PEP 8] suggests only adding whitespace around the operator with
the lowest precedence, but that authors should "use [their] own judgment".)

## Example
```python
number = 40+2
```

Use instead:
```python
number = 40 + 2
```

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for missing whitespace around bitwise and shift operators.

## Why is this bad?
[PEP 8] recommends never using more than one space, and always having the
same amount of whitespace on both sides of a binary operator.

For consistency, this rule enforces one space before and after bitwise and
shift operators (`<<`, `>>`, `&`, `|`, `^`).

(Note that [PEP 8] suggests only adding whitespace around the operator with
the lowest precedence, but that authors should "use [their] own judgment".)

## Example
```python
x = 128<<1
```

Use instead:
```python
```