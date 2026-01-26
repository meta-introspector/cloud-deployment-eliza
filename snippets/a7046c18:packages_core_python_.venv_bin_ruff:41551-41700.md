# a7046c18:packages_core_python_.venv_bin_ruff:41551-41700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41551-41700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
def show(host_id=10.11):
    for inner_host_id, host in [[12.13, "Venus"], [14.15, "Mars"]]:
        print(host_id, inner_host_id, host)
```

## Options
- `lint.dummy-variable-rgx`

## References
- [Pylint documentation](https://pylint.readthedocs.io/en/latest/user_guide/messages/refactor/redefined-argument-from-local.html)
## Removal
This rule was removed from Ruff because it was common for it to introduce behavioral changes.
See [#9007](https://github.com/astral-sh/ruff/issues/9007) for more information.

## What it does
Checks for uses of the known pre-Python 2.5 ternary syntax.

## Why is this bad?
Prior to the introduction of the if-expression (ternary) operator in Python
2.5, the only way to express a conditional expression was to use the `and`
and `or` operators.

The if-expression construct is clearer and more explicit, and should be
preferred over the use of `and` and `or` for ternary expressions.

## Example
```python
x, y = 1, 2
maximum = x >= y and x or y
```

Use instead:
```python
x, y = 1, 2
maximum = x if x >= y else y
```
## What it does
Checks for explicit `raise StopIteration` in generator functions.

## Why is this bad?
Raising `StopIteration` in a generator function causes a `RuntimeError`
when the generator is iterated over.

Instead of `raise StopIteration`, use `return` in generator functions.

## Example
```python
def my_generator():
    yield 1
    yield 2
    raise StopIteration  # This causes RuntimeError at runtime
```

Use instead:
```python
def my_generator():
    yield 1
    yield 2
    return  # Use return instead
```

## References
- [PEP 479](https://peps.python.org/pep-0479/)
- [Python documentation](https://docs.python.org/3/library/exceptions.html#StopIteration)
## What it does
Checks for functions that end with an unnecessary `return` or
`return None`, and contain no other `return` statements.

## Why is this bad?
Python implicitly assumes a `None` return at the end of a function, making
it unnecessary to explicitly write `return None`.

## Example
```python
def f():
    print(5)
    return None
```

Use instead:
```python
def f():
    print(5)
```
## What it does
Checks for repeated equality comparisons that can be rewritten as a membership
test.

This rule will try to determine if the values are hashable
and the fix will use a `set` if they are. If unable to determine, the fix
will use a `tuple` and suggest the use of a `set`.

## Why is this bad?
To check if a variable is equal to one of many values, it is common to
write a series of equality comparisons (e.g.,
`foo == "bar" or foo == "baz"`).

Instead, prefer to combine the values into a collection and use the `in`
operator to check for membership, which is more performant and succinct.
If the items are hashable, use a `set` for efficiency; otherwise, use a
`tuple`.

## Fix safety
This rule is always unsafe since literal sets and tuples
evaluate their members eagerly whereas `or` comparisons
are short-circuited. It is therefore possible that a fix
will change behavior in the presence of side-effects.

## Example
```python
foo == "bar" or foo == "baz" or foo == "qux"
```

Use instead:
```python
foo in {"bar", "baz", "qux"}
```

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)
- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)
## What it does
Check for chained boolean operations that can be simplified.

## Why is this bad?
Refactoring the code will improve readability for these cases.

## Example

```python
a = int(input())
b = int(input())
c = int(input())
if a < b and b < c:
    pass
```

Use instead:

```python
a = int(input())
b = int(input())
c = int(input())
if a < b < c:
    pass
```
## What it does
Checks for uses of the `exit()` and `quit()`.
```