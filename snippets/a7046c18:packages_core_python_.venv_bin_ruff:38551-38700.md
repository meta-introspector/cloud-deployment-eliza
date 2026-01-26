# a7046c18:packages_core_python_.venv_bin_ruff:38551-38700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:38551-38700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"Hello, {0}".format("world", print(1))
```

## References
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `str.format` calls with placeholders that are missing arguments.

## Why is this bad?
In `str.format` calls, omitting arguments for placeholders will raise a
`KeyError` at runtime.

## Example
```python
"{greeting}, {name}".format(name="World")
```

Use instead:
```python
"{greeting}, {name}".format(greeting="Hello", name="World")
```

## References
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `str.format` calls that mix automatic and manual numbering.

## Why is this bad?
In `str.format` calls, mixing automatic and manual numbering will raise a
`ValueError` at runtime.

## Example
```python
"{0}, {}".format("Hello", "World")
```

Use instead:
```python
"{0}, {1}".format("Hello", "World")
```

Or:
```python
"{}, {}".format("Hello", "World")
```

## References
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for f-strings that do not contain any placeholder expressions.

## Why is this bad?
f-strings are a convenient way to format strings, but they are not
necessary if there are no placeholder expressions to format. In this
case, a regular string should be used instead, as an f-string without
placeholders can be confusing for readers, who may expect such a
placeholder to be present.

An f-string without any placeholders could also indicate that the
author forgot to add a placeholder expression.

## Example
```python
f"Hello, world!"
```

Use instead:
```python
"Hello, world!"
```

**Note:** to maintain compatibility with PyFlakes, this rule only flags
f-strings that are part of an implicit concatenation if _none_ of the
f-string segments contain placeholder expressions.

For example:

```python
# Will not be flagged.
(
    f"Hello,"
    f" {name}!"
)

# Will be flagged.
(
    f"Hello,"
    f" World!"
)
```

See [#10885](https://github.com/astral-sh/ruff/issues/10885) for more.

## References
- [PEP 498 – Literal String Interpolation](https://peps.python.org/pep-0498/)
## What it does
Checks for dictionary literals that associate multiple values with the
same key.

## Why is this bad?
Dictionary keys should be unique. If a key is associated with multiple values,
the earlier values will be overwritten. Including multiple values for the
same key in a dictionary literal is likely a mistake.

## Example
```python
foo = {
    "bar": 1,
    "baz": 2,
    "baz": 3,
}
foo["baz"]  # 3
```

Use instead:
```python
foo = {
    "bar": 1,
    "baz": 2,
}
foo["baz"]  # 2
```

## Fix safety

This rule's fix is marked as unsafe because removing a repeated dictionary key
may delete comments that are attached to the removed key-value pair. This can also change
the program's behavior if the value expressions have side effects.

## References
- [Python documentation: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
## What it does
Checks for dictionary keys that are repeated with different values.

## Why is this bad?
Dictionary keys should be unique. If a key is repeated with a different
value, the first values will be overwritten and the key will correspond to
the last value. This is likely a mistake.

## Example
```python
foo = {
    bar: 1,
    baz: 2,
    baz: 3,
}
foo[baz]  # 3
```

Use instead:
```