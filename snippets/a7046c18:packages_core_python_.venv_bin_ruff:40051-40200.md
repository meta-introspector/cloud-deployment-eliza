# a7046c18:packages_core_python_.venv_bin_ruff:40051-40200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40051-40200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for assignments to attributes that are not defined in `__slots__`.

## Why is this bad?
When using `__slots__`, only the specified attributes are allowed.
Attempting to assign to an attribute that is not defined in `__slots__`
will result in an `AttributeError` at runtime.

## Known problems
This rule can't detect `__slots__` implementations in superclasses, and
so limits its analysis to classes that inherit from (at most) `object`.

## Example
```python
class Student:
    __slots__ = ("name",)

    def __init__(self, name, surname):
        self.name = name
        self.surname = surname  # [assigning-non-slot]
        self.setup()

    def setup(self):
        pass
```

Use instead:
```python
class Student:
    __slots__ = ("name", "surname")

    def __init__(self, name, surname):
        self.name = name
        self.surname = surname
        self.setup()

    def setup(self):
        pass
```
## What it does
Checks for duplicate base classes in class definitions.

## Why is this bad?
Including duplicate base classes will raise a `TypeError` at runtime.

## Example
```python
class Foo:
    pass


class Bar(Foo, Foo):
    pass
```

Use instead:
```python
class Foo:
    pass


class Bar(Foo):
    pass
```

## Fix safety
This rule's fix is marked as unsafe if there's comments in the
base classes, as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
class Foo:
    pass


class Bar(
    Foo,  # comment
    Foo,
):
    pass
```

## References
- [Python documentation: Class definitions](https://docs.python.org/3/reference/compound_stmts.html#class-definitions)
## What it does
Checks for "special" methods that have an unexpected method signature.

## Why is this bad?
"Special" methods, like `__len__`, are expected to adhere to a specific,
standard function signature. Implementing a "special" method using a
non-standard function signature can lead to unexpected and surprising
behavior for users of a given class.

## Example
```python
class Bookshelf:
    def __init__(self):
        self._books = ["Foo", "Bar", "Baz"]

    def __len__(self, index):  # __len__ does not except an index parameter
        return len(self._books)

    def __getitem__(self, index):
        return self._books[index]
```

Use instead:
```python
class Bookshelf:
    def __init__(self):
        self._books = ["Foo", "Bar", "Baz"]

    def __len__(self):
        return len(self._books)

    def __getitem__(self, index):
        return self._books[index]
```

## References
- [Python documentation: Data model](https://docs.python.org/3/reference/datamodel.html)
## What it does
Checks for `__len__` implementations that return values that are not non-negative
integers.

## Why is this bad?
The `__len__` method should return a non-negative integer. Returning a different
value may cause unexpected behavior.

Note: `bool` is a subclass of `int`, so it's technically valid for `__len__` to
return `True` or `False`. However, for consistency with other rules, Ruff will
still emit a diagnostic when `__len__` returns a `bool`.

## Example
```python
class Foo:
    def __len__(self):
        return "2"
```

Use instead:
```python
class Foo:
    def __len__(self):
        return 2
```

## References
- [Python documentation: The `__len__` method](https://docs.python.org/3/reference/datamodel.html#object.__len__)
## What it does
Checks for `__bool__` implementations that return a type other than `bool`.
```