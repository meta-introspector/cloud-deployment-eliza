# a7046c18:packages_core_python_.venv_bin_ruff:42001-42150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42001-42150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for the presence of unused `self` parameter in methods definitions.

## Why is this bad?
Unused `self` parameters are usually a sign of a method that could be
replaced by a function, class method, or static method.

This rule exempts methods decorated with [`@typing.override`][override].
Converting an instance method into a static method or class method may
cause type checkers to complain about a violation of the Liskov
Substitution Principle if it means that the method now incompatibly
overrides a method defined on a superclass. Explicitly decorating an
overriding method with `@override` signals to Ruff that the method is
intended to override a superclass method and that a type checker will
enforce that it does so; Ruff therefore knows that it should not enforce
rules about unused `self` parameters on such methods.

## Example
```python
class Person:
    def greeting(self):
        print("Greetings friend!")
```

Use instead:
```python
def greeting():
    print("Greetings friend!")
```

or

```python
class Person:
    @staticmethod
    def greeting():
        print("Greetings friend!")
```

## Options

The rule will not trigger on methods that are already marked as static or class methods.

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for `lambda` definitions that consist of a single function call
with the same arguments as the `lambda` itself.

## Why is this bad?
When a `lambda` is used to wrap a function call, and merely propagates
the `lambda` arguments to that function, it can typically be replaced with
the function itself, removing a level of indirection.

## Example
```python
df.apply(lambda x: str(x))
```

Use instead:
```python
df.apply(str)
```

## Fix safety
This rule's fix is marked as unsafe for two primary reasons.

First, the lambda body itself could contain an effect.

For example, replacing `lambda x, y: (func()(x, y))` with `func()` would
lead to a change in behavior, as `func()` would be evaluated eagerly when
defining the lambda, rather than when the lambda is called.

However, even when the lambda body itself is pure, the lambda may
change the argument names, which can lead to a change in behavior when
callers pass arguments by name.

For example, replacing `foo = lambda x, y: func(x, y)` with `foo = func`,
where `func` is defined as `def func(a, b): return a + b`, would be a
breaking change for callers that execute the lambda by passing arguments by
name, as in: `foo(x=1, y=2)`. Since `func` does not define the arguments
`x` and `y`, unlike the lambda, the call would raise a `TypeError`.
## What it does
Checks for `else` clauses on loops without a `break` statement.

## Why is this bad?
When a loop includes an `else` statement, the code inside the `else` clause
will be executed if the loop terminates "normally" (i.e., without a
`break`).

If a loop _always_ terminates "normally" (i.e., does _not_ contain a
`break`), then the `else` clause is redundant, as the code inside the
`else` clause will always be executed.

In such cases, the code inside the `else` clause can be moved outside the
loop entirely, and the `else` clause can be removed.

## Example
```python
for item in items:
    print(item)
else:
    print("All items printed")
```

Use instead:
```python
for item in items:
    print(item)
print("All items printed")
```

## References
- [Python documentation: `break` and `continue` Statements, and `else` Clauses on Loops](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops)
## What it does
Checks for self-assignment of variables.

## Why is this bad?
Self-assignment of variables is redundant and likely a mistake.

## Example
```python
country = "Poland"
country = country
```

Use instead:
```python
country = "Poland"
```
## What it does
Checks for declared assignments to the same variable multiple times
in the same assignment.

## Why is this bad?
Assigning a variable multiple times in the same assignment is redundant,
as the final assignment to the variable is what the value will be.

## Example
```python
a, b, a = (1, 2, 3)
print(a)  # 3
```

Use instead:
```python
# this is assuming you want to assign 3 to `a`
_, b, a = (1, 2, 3)
```