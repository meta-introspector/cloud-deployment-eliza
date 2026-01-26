# a7046c18:packages_core_python_.venv_bin_ruff:40201-40350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40201-40350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Why is this bad?
The `__bool__` method should return a `bool` object. Returning a different
type may cause unexpected behavior.

## Example
```python
class Foo:
    def __bool__(self):
        return 2
```

Use instead:
```python
class Foo:
    def __bool__(self):
        return True
```

## References
- [Python documentation: The `__bool__` method](https://docs.python.org/3/reference/datamodel.html#object.__bool__)
## What it does
Checks for `__index__` implementations that return non-integer values.

## Why is this bad?
The `__index__` method should return an integer. Returning a different
type may cause unexpected behavior.

Note: `bool` is a subclass of `int`, so it's technically valid for `__index__` to
return `True` or `False`. However, a `DeprecationWarning` (`DeprecationWarning:
__index__ returned non-int (type bool)`) for such cases was already introduced,
thus this is a conscious difference between the original pylint rule and the
current ruff implementation.

## Example
```python
class Foo:
    def __index__(self):
        return "2"
```

Use instead:
```python
class Foo:
    def __index__(self):
        return 2
```

## References
- [Python documentation: The `__index__` method](https://docs.python.org/3/reference/datamodel.html#object.__index__)
## What it does
Checks for `__str__` implementations that return a type other than `str`.

## Why is this bad?
The `__str__` method should return a `str` object. Returning a different
type may cause unexpected behavior.

## Example
```python
class Foo:
    def __str__(self):
        return True
```

Use instead:
```python
class Foo:
    def __str__(self):
        return "Foo"
```

## References
- [Python documentation: The `__str__` method](https://docs.python.org/3/reference/datamodel.html#object.__str__)
## What it does
Checks for `__bytes__` implementations that return types other than `bytes`.

## Why is this bad?
The `__bytes__` method should return a `bytes` object. Returning a different
type may cause unexpected behavior.

## Example
```python
class Foo:
    def __bytes__(self):
        return 2
```

Use instead:
```python
class Foo:
    def __bytes__(self):
        return b"2"
```

## References
- [Python documentation: The `__bytes__` method](https://docs.python.org/3/reference/datamodel.html#object.__bytes__)
## What it does
Checks for `__hash__` implementations that return non-integer values.

## Why is this bad?
The `__hash__` method should return an integer. Returning a different
type may cause unexpected behavior.

Note: `bool` is a subclass of `int`, so it's technically valid for `__hash__` to
return `True` or `False`. However, for consistency with other rules, Ruff will
still emit a diagnostic when `__hash__` returns a `bool`.

## Example
```python
class Foo:
    def __hash__(self):
        return "2"
```

Use instead:
```python
class Foo:
    def __hash__(self):
        return 2
```

## References
- [Python documentation: The `__hash__` method](https://docs.python.org/3/reference/datamodel.html#object.__hash__)
## What it does
Checks for the inclusion of invalid objects in `__all__`.

## Why is this bad?
In Python, `__all__` should contain a sequence of strings that represent
the names of all "public" symbols exported by a module.

Assigning anything other than a `tuple` or `list` of strings to `__all__`
is invalid.

## Example
```python
__all__ = [Foo, 1, None]
```

Use instead:
```python
__all__ = ["Foo", "Bar", "Baz"]
```

## References
- [Python documentation: The `import` statement](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement)
## What it does
Checks for invalid assignments to `__all__`.

## Why is this bad?
In Python, `__all__` should contain a sequence of strings that represent
```