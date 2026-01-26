# a7046c18:packages_core_python_.venv_bin_ruff:33601-33750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33601-33750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
most cases.

## Example
```python
pairs = (("a", 1), ("b", 2))
result = {}
for x, y in pairs:
    if y % 2:
        result[x] = y
```

Use instead:
```python
pairs = (("a", 1), ("b", 2))
result = {x: y for x, y in pairs if y % 2}
```

If you're appending to an existing dictionary, use the `update` method instead:
```python
pairs = (("a", 1), ("b", 2))
result.update({x: y for x, y in pairs if y % 2})
```
## What it does
Checks for mixed tabs and spaces in indentation.

## Why is this bad?
Never mix tabs and spaces.

The most popular way of indenting Python is with spaces only. The
second-most popular way is with tabs only. Code indented with a
mixture of tabs and spaces should be converted to using spaces
exclusively.

## Example
```python
if a == 0:\n        a = 1\n\tb = 1
```

Use instead:
```python
if a == 0:\n    a = 1\n    b = 1
```
## What it does
Checks for indentation with a non-multiple of 4 spaces.

## Why is this bad?
According to [PEP 8], 4 spaces per indentation level should be preferred.

## Example
```python
if True:
   a = 1
```

Use instead:
```python
if True:
    a = 1
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

The rule is also incompatible with the [formatter] when using
`indent-width` with a value other than `4`.

## Options
- `indent-width`

[PEP 8]: https://peps.python.org/pep-0008/#indentation
[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for indented blocks that are lacking indentation.

## Why is this bad?
All indented blocks should be indented; otherwise, they are not valid
Python syntax.

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

[PEP 8]: https://peps.python.org/pep-0008/#indentation
## What it does
Checks for unexpected indentation.

## Why is this bad?
Indentation outside of a code block is not valid Python syntax.

## Example
```python
a = 1
    b = 2
```

Use instead:
```python
a = 1
b = 2
```

[PEP 8]: https://peps.python.org/pep-0008/#indentation
## What it does
Checks for indentation of comments with a non-multiple of 4 spaces.

## Why is this bad?
According to [PEP 8], 4 spaces per indentation level should be preferred.

## Example
```python
if True:
   # a = 1
    ...
```

Use instead:
```python
if True:
    # a = 1
    ...
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

The rule is also incompatible with the [formatter] when using
`indent-width` with a value other than `4`.

## Options
- `indent-width`

[PEP 8]: https://peps.python.org/pep-0008/#indentation
[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for comments in a code blocks that are lacking indentation.

## Why is this bad?
Comments within an indented block should themselves be indented, to
indicate that they are part of the block.

```