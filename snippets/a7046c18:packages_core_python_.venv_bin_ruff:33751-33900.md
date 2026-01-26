# a7046c18:packages_core_python_.venv_bin_ruff:33751-33900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33751-33900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Example
```python
for item in items:
# Hi
    pass
```

Use instead:
```python
for item in items:
    # Hi
    pass
```

[PEP 8]: https://peps.python.org/pep-0008/#indentation
## What it does
Checks for unexpected indentation of comment.

## Why is this bad?
Comments should match the indentation of the containing code block.

## Example
```python
a = 1
    # b = 2
```

Use instead:
```python
a = 1
# b = 2
```

[PEP 8]: https://peps.python.org/pep-0008/#indentation
## What it does
Checks for over-indented code.

## Why is this bad?
According to [PEP 8], 4 spaces per indentation level should be preferred. Increased
indentation can lead to inconsistent formatting, which can hurt
readability.

## Example
```python
for item in items:
      pass
```

Use instead:
```python
for item in items:
    pass
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

[PEP 8]: https://peps.python.org/pep-0008/#indentation
[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for the use of extraneous whitespace after "(", "[" or "{".

## Why is this bad?
[PEP 8] recommends the omission of whitespace in the following cases:
- "Immediately inside parentheses, brackets or braces."
- "Immediately before a comma, semicolon, or colon."

## Example
```python
spam( ham[1], {eggs: 2})
spam(ham[ 1], {eggs: 2})
spam(ham[1], { eggs: 2})
```

Use instead:
```python
spam(ham[1], {eggs: 2})
```

[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves
## What it does
Checks for the use of extraneous whitespace before ")", "]" or "}".

## Why is this bad?
[PEP 8] recommends the omission of whitespace in the following cases:
- "Immediately inside parentheses, brackets or braces."
- "Immediately before a comma, semicolon, or colon."

## Example
```python
spam(ham[1], {eggs: 2} )
spam(ham[1 ], {eggs: 2})
spam(ham[1], {eggs: 2 })
```

Use instead:
```python
spam(ham[1], {eggs: 2})
```

[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves
## What it does
Checks for the use of extraneous whitespace before ",", ";" or ":".

## Why is this bad?
[PEP 8] recommends the omission of whitespace in the following cases:
- "Immediately inside parentheses, brackets or braces."
- "Immediately before a comma, semicolon, or colon."

## Example
```python
if x == 4: print(x, y); x, y = y , x
```

Use instead:
```python
if x == 4: print(x, y); x, y = y, x
```

[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves
## What it does
Checks for trailing whitespace after a decorator's opening `@`.

## Why is this bad?
Including whitespace after the `@` symbol is not compliant with
[PEP 8].

## Example

```python
@ decorator
def func():
   pass
```

Use instead:
```python
@decorator
def func():
  pass
```

[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length
## What it does
Checks for extraneous whitespace immediately preceding an open parenthesis
or bracket.

## Why is this bad?
According to [PEP 8], open parentheses and brackets should not be preceded
```