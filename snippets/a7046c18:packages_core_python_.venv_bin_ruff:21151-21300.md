# a7046c18:packages_core_python_.venv_bin_ruff:21151-21300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21151-21300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
If the variable is intended to be unused (e.g., to facilitate
destructuring of a tuple or other object), prefix it with an underscore
to indicate the intent. Otherwise, remove the variable entirely.

## Example
```python
for i, j in foo:
    bar(i)
```

Use instead:
```python
for i, _j in foo:
    bar(i)
```

## Options

- `lint.dummy-variable-rgx`

## References
- [PEP 8: Naming Conventions](https://peps.python.org/pep-0008/#naming-conventions)
## What it does
Checks for function calls in default function arguments.

## Why is this bad?
Any function call that's used in a default argument will only be performed
once, at definition time. The returned value will then be reused by all
calls to the function, which can lead to unexpected behaviour.

Parameters with immutable type annotations will be ignored by this rule.
Those whose default arguments are `NewType` calls where the original type
is immutable are also ignored.

Calls and types outside of the standard library can be marked as an exception
to this rule with the [`lint.flake8-bugbear.extend-immutable-calls`] configuration option.

## Example

```python
def create_list() -> list[int]:
    return [1, 2, 3]


def mutable_default(arg: list[int] = create_list()) -> list[int]:
    arg.append(4)
    return arg
```

Use instead:

```python
def better(arg: list[int] | None = None) -> list[int]:
    if arg is None:
        arg = create_list()

    arg.append(4)
    return arg
```

If the use of a singleton is intentional, assign the result call to a
module-level variable, and use that variable in the default argument:

```python
ERROR = ValueError("Hosts weren't successfully added")


def add_host(error: Exception = ERROR) -> None: ...
```

## Options
- `lint.flake8-bugbear.extend-immutable-calls`
## What it does
Checks for uses of `getattr` that take a constant attribute value as an
argument (e.g., `getattr(obj, "foo")`).

## Why is this bad?
`getattr` is used to access attributes dynamically. If the attribute is
defined as a constant, it is no safer than a typical property access. When
possible, prefer property access over `getattr` calls, as the former is
more concise and idiomatic.


## Example
```python
getattr(obj, "foo")
```

Use instead:
```python
obj.foo
```

## Fix safety
The fix is marked as unsafe for attribute names that are not in NFKC (Normalization Form KC)
normalization. Python normalizes identifiers using NFKC when using attribute access syntax
(e.g., `obj.attr`), but does not normalize string arguments passed to `getattr`. Rewriting
`getattr(obj, "ſ")` to `obj.ſ` would be interpreted as `obj.s` at runtime, changing behavior.

For example, the long s character `"ſ"` normalizes to `"s"` under NFKC, so:
```python
# This accesses an attribute with the exact name "ſ" (if it exists)
value = getattr(obj, "ſ")

# But this would normalize to "s" and access a different attribute
obj.ſ  # This is interpreted as obj.s, not obj.ſ
```

## References
- [Python documentation: `getattr`](https://docs.python.org/3/library/functions.html#getattr)
## What it does
Checks for uses of `setattr` that take a constant attribute value as an
argument (e.g., `setattr(obj, "foo", 42)`).

## Why is this bad?
`setattr` is used to set attributes dynamically. If the attribute is
defined as a constant, it is no safer than a typical property access. When
possible, prefer property access over `setattr` calls, as the former is
more concise and idiomatic.

## Example
```python
setattr(obj, "foo", 42)
```

Use instead:
```python
obj.foo = 42
```

## Fix safety
The fix is marked as unsafe for attribute names that are not in NFKC (Normalization Form KC)
normalization. Python normalizes identifiers using NFKC when using attribute access syntax
(e.g., `obj.attr = value`), but does not normalize string arguments passed to `setattr`.
Rewriting `setattr(obj, "ſ", 1)` to `obj.ſ = 1` would be interpreted as `obj.s = 1` at
runtime, changing behavior.

For example, the long s character `"ſ"` normalizes to `"s"` under NFKC, so:
```python
# This creates an attribute with the exact name "ſ"
setattr(obj, "ſ", 1)
getattr(obj, "ſ")  # Returns 1

# But this would normalize to "s" and set a different attribute
obj.ſ = 1  # This is interpreted as obj.s = 1, not obj.ſ = 1
```

## References
- [Python documentation: `setattr`](https://docs.python.org/3/library/functions.html#setattr)
## What it does
```