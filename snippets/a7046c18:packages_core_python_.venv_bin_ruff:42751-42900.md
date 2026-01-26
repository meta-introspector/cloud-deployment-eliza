# a7046c18:packages_core_python_.venv_bin_ruff:42751-42900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42751-42900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        return hash(self.name)
```

In general, it is unsound to inherit a `__hash__` implementation from a parent class while
overriding the `__eq__` implementation because the two must be kept in sync. However, an easy
way to resolve this error in cases where it _is_ sound is to explicitly set `__hash__` to the
parent class's implementation:

```python
class Developer(Person):
    def __init__(self): ...

    def __eq__(self, other): ...

    __hash__ = Person.__hash__
```

## References
- [Python documentation: `object.__hash__`](https://docs.python.org/3/reference/datamodel.html#object.__hash__)
- [Python glossary: hashable](https://docs.python.org/3/glossary.html#term-hashable)
## What it does
Checks for lock objects that are created and immediately discarded in
`with` statements.

## Why is this bad?
Creating a lock (via `threading.Lock` or similar) in a `with` statement
has no effect, as locks are only relevant when shared between threads.

Instead, assign the lock to a variable outside the `with` statement,
and share that variable between threads.

## Example
```python
import threading

counter = 0


def increment():
    global counter

    with threading.Lock():
        counter += 1
```

Use instead:
```python
import threading

counter = 0
lock = threading.Lock()


def increment():
    global counter

    with lock:
        counter += 1
```

## References
- [Python documentation: `Lock Objects`](https://docs.python.org/3/library/threading.html#lock-objects)
## What it does
Checks for variables defined in `for` loops and `with` statements that
get overwritten within the body, for example by another `for` loop or
`with` statement or by direct assignment.

## Why is this bad?
Redefinition of a loop variable inside the loop's body causes its value
to differ from the original loop iteration for the remainder of the
block, in a way that will likely cause bugs.

In Python, unlike many other languages, `for` loops and `with`
statements don't define their own scopes. Therefore, a nested loop that
uses the same target variable name as an outer loop will reuse the same
actual variable, and the value from the last iteration will "leak out"
into the remainder of the enclosing loop.

While this mistake is easy to spot in small examples, it can be hidden
in larger blocks of code, where the definition and redefinition of the
variable may not be visible at the same time.

## Example
```python
for i in range(10):
    i = 9
    print(i)  # prints 9 every iteration

for i in range(10):
    for i in range(10):  # original value overwritten
        pass
    print(i)  # also prints 9 every iteration

with path1.open() as f:
    with path2.open() as f:
        f = path2.open()
    print(f.readline())  # prints a line from path2
```

## Options

The rule ignores assignments to dummy variables, as specified by:

- `lint.dummy-variable-rgx`
## What it does
Checks for dunder methods that have no special meaning in Python 3.

## Why is this bad?
Misspelled or no longer supported dunder name methods may cause your code to not function
as expected.

Since dunder methods are associated with customizing the behavior
of a class in Python, introducing a dunder method such as `__foo__`
that diverges from standard Python dunder methods could potentially
confuse someone reading the code.

This rule will detect all methods starting and ending with at least
one underscore (e.g., `_str_`), but ignores known dunder methods (like
`__init__`), as well as methods that are marked with [`@override`][override].

Additional dunder methods names can be allowed via the
[`lint.pylint.allow-dunder-method-names`] setting.

## Example

```python
class Foo:
    def __init_(self): ...
```

Use instead:

```python
class Foo:
    def __init__(self): ...
```

## Options
- `lint.pylint.allow-dunder-method-names`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for nested `min` and `max` calls.

## Why is this bad?
Nested `min` and `max` calls can be flattened into a single call to improve
readability.

## Example

```