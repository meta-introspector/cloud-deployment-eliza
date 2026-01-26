# a7046c18:packages_core_python_.venv_bin_ruff:50851-51000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:50851-51000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

 ## Examples
 ```python
 class A:
     ...
 class B(A):
     ...

 super(A, B())  # it's okay! `A` satisfies `isinstance(B(), A)`

 super(A(), B()) # error: `A()` is not a class

 super(B, A())  # error: `A()` does not satisfy `isinstance(A(), B)`
 super(B, A)  # error: `A` does not satisfy `issubclass(A, B)`
 ```

 ## References
 - [Python documentation: super()](https://docs.python.org/3/library/functions.html#super)
0.0.10invalid-total-orderingdetects `@total_ordering` classes without an ordering method ## What it does
 Checks for classes decorated with `@functools.total_ordering` that don't
 define any ordering method (`__lt__`, `__le__`, `__gt__`, or `__ge__`).

 ## Why is this bad?
 The `@total_ordering` decorator requires the class to define at least one
 ordering method. If none is defined, Python raises a `ValueError` at runtime.

 ## Example

 ```python
 from functools import total_ordering

 @total_ordering
 class MyClass:  # Error: no ordering method defined
     def __eq__(self, other: object) -> bool:
         return True
 ```

 Use instead:

 ```python
 from functools import total_ordering

 @total_ordering
 class MyClass:
     def __eq__(self, other: object) -> bool:
         return True

     def __lt__(self, other: "MyClass") -> bool:
         return True
 ```
0.0.1-alpha.29invalid-type-argumentsdetects invalid type arguments in generic specialization ## What it does
 Checks for invalid type arguments in explicit type specialization.

 ## Why is this bad?
 Providing the wrong number of type arguments or type arguments that don't
 satisfy the type variable's bounds or constraints will lead to incorrect
 type inference and may indicate a misunderstanding of the generic type's
 interface.

 ## Examples

 Using legacy type variables:
 ```python
 from typing import Generic, TypeVar

 T1 = TypeVar('T1', int, str)
 T2 = TypeVar('T2', bound=int)

 class Foo1(Generic[T1]): ...
 class Foo2(Generic[T2]): ...

 Foo1[bytes]  # error: bytes does not satisfy T1's constraints
 Foo2[str]  # error: str does not satisfy T2's bound
 ```

 Using PEP 695 type variables:
 ```python
 class Foo[T]: ...
 class Bar[T, U]: ...

 Foo[int, str]  # error: too many arguments
 Bar[int]  # error: too few arguments
 ```
0.0.1-alpha.20missing-typed-dict-keydetects missing required keys in `TypedDict` constructors ## What it does
 Detects missing required keys in `TypedDict` constructor calls.

 ## Why is this bad?
 `TypedDict` requires all non-optional keys to be provided during construction.
 Missing items can lead to a `KeyError` at runtime.

 ## Example
 ```python
 from typing import TypedDict

 class Person(TypedDict):
     name: str
     age: int

 alice: Person = {"name": "Alice"}  # missing required key 'age'

 alice["age"]  # KeyError
 ```
type-assertion-failuredetects failed type assertions ## What it does
 Checks for `assert_type()` and `assert_never()` calls where the actual type
 is not the same as the asserted type.

 ## Why is this bad?
 `assert_type()` allows confirming the inferred type of a certain value.

 ## Example

 ```python
 def _(x: int):
     assert_type(x, int)  # fine
     assert_type(x, str)  # error: Actual type does not match asserted type
 ```
zero-stepsize-in-slicedetects a slice step size of zero ## What it does
 Checks for step size 0 in slices.

 ## Why is this bad?
 A slice with a step size of zero will raise a `ValueError` at runtime.

 ## Examples
 ```python
 l = list(range(10))
 l[1:10:0]  # ValueError: slice step cannot be zero
 ```
Duplicate base class `The definition of class `` first included in bases list here` later repeated hereGeneric class `` must not reference type variables bound in an enclosing scope` referenced in class definition here` is bound in this enclosing scopecyclic-class-definition ## What it does
 Checks for class definitions in stub files that inherit
 (directly or indirectly) from themselves.

 ## Why is it bad?
 Although forward references are natively supported in stub files,
 inheritance cycles are still disallowed, as it is impossible to
 resolve a consistent [method resolution order] for a class that
 inherits from itself.

 ## Examples
 ```python
 # foo.pyi
 class A(B): ...
 class B(A): ...
 ```

 [method resolution order]: https://docs.python.org/3/glossary.html#term-method-resolution-order
invalid-context-managerdetects expressions used in with statements that don't implement the context manager protocol ## What it does
 Checks for expressions used in `with` statements
 that do not implement the context manager protocol.

 ## Why is this bad?
```