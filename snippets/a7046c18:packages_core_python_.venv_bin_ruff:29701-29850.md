# a7046c18:packages_core_python_.venv_bin_ruff:29701-29850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29701-29850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

In some languages, Yoda conditions are used to prevent accidental
assignment in conditions (i.e., accidental uses of the `=` operator,
instead of the `==` operator). However, Python does not allow assignments
in conditions unless using the `:=` operator, so Yoda conditions provide
no benefit in this regard.

## Example
```python
if "Foo" == foo:
    ...
```

Use instead:
```python
if foo == "Foo":
    ...
```

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
- [Python documentation: Assignment statements](https://docs.python.org/3/reference/simple_stmts.html#assignment-statements)
## What it does
Checks for `if` statements that can be replaced with `dict.get` calls.

## Why is this bad?
`dict.get()` calls can be used to replace `if` statements that assign a
value to a variable in both branches, falling back to a default value if
the key is not found. When possible, using `dict.get` is more concise and
more idiomatic.

Under [preview mode](https://docs.astral.sh/ruff/preview), this rule will
also suggest replacing `if`-`else` _expressions_ with `dict.get` calls.

## Example
```python
foo = {}
if "bar" in foo:
    value = foo["bar"]
else:
    value = 0
```

Use instead:
```python
foo = {}
value = foo.get("bar", 0)
```

If preview mode is enabled:
```python
value = foo["bar"] if "bar" in foo else 0
```

Use instead:
```python
value = foo.get("bar", 0)
```

## Options

The rule will avoid flagging cases where using the resulting `dict.get` call would exceed the
configured line length, as determined by these options:

- `lint.pycodestyle.max-line-length`
- `indent-width`

## References
- [Python documentation: Mapping Types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
## What it does
Checks for static `str.split` calls that can be replaced with list literals.

## Why is this bad?
List literals are more readable and do not require the overhead of calling `str.split`.

## Example
```python
"a,b,c,d".split(",")
```

Use instead:
```python
["a", "b", "c", "d"]
```

## Fix safety
This rule's fix is marked as unsafe for implicit string concatenations with comments interleaved
between segments, as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
(
    "a"  # comment
    ","  # comment
    "b"  # comment
).split(",")
```

as this is converted to `["a", "b"]` without any of the comments.

## References
- [Python documentation: `str.split`](https://docs.python.org/3/library/stdtypes.html#str.split)
## What it does
Checks for `dict.get()` calls that pass `None` as the default value.

## Why is this bad?
`None` is the default value for `dict.get()`, so it is redundant to pass it
explicitly.

## Example
```python
ages = {"Tom": 23, "Maria": 23, "Dog": 11}
age = ages.get("Cat", None)
```

Use instead:
```python
ages = {"Tom": 23, "Maria": 23, "Dog": 11}
age = ages.get("Cat")
```

## References
- [Python documentation: `dict.get`](https://docs.python.org/3/library/stdtypes.html#dict.get)
## What it does
Checks for use of `zip()` to iterate over keys and values of a dictionary at once.

## Why is this bad?
The `dict` type provides an `.items()` method which is faster and more readable.

## Example
```python
flag_stars = {"USA": 50, "Slovenia": 3, "Panama": 2, "Australia": 6}

for country, stars in zip(flag_stars.keys(), flag_stars.values()):
    print(f"{country}'s flag has {stars} stars.")
```

Use instead:
```python
flag_stars = {"USA": 50, "Slovenia": 3, "Panama": 2, "Australia": 6}

for country, stars in flag_stars.items():
    print(f"{country}'s flag has {stars} stars.")
```

## References
- [Python documentation: `dict.items`](https://docs.python.org/3/library/stdtypes.html#dict.items)
## What it does
Checks for subclasses of `str` that lack a `__slots__` definition.

```