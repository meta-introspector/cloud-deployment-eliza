# a7046c18:packages_core_python_.venv_bin_ruff:50701-50850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:50701-50850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 Accessing an unbound attribute will raise an `AttributeError` at runtime.
 An unresolved attribute is not guaranteed to exist from the type alone,
 so this could also indicate that the object is not of the type that the user expects.

 ## Examples
 ```python
 class A: ...

 A().foo  # AttributeError: 'A' object has no attribute 'foo'
 ```
unresolved-referencedetects references to names that are not defined ## What it does
 Checks for references to names that are not defined.

 ## Why is this bad?
 Using an undefined variable will raise a `NameError` at runtime.

 ## Example

 ```python
 print(x)  # NameError: name 'x' is not defined
 ```
unsupported-operatordetects binary, unary, or comparison expressions where the operands don't support the operator ## What it does
 Checks for binary expressions, comparisons, and unary expressions where
 the operands don't support the operator.

 ## Why is this bad?
 Attempting to use an unsupported operator will raise a `TypeError` at
 runtime.

 ## Examples
 ```python
 class A: ...

 A() + A()  # TypeError: unsupported operand type(s) for +: 'A' and 'A'
 ```
conflicting-metaclassdetects conflicting metaclasses ## What it does
 Checks for class definitions where the metaclass of the class
 being created would not be a subclass of the metaclasses of
 all the class's bases.

 ## Why is it bad?
 Such a class definition raises a `TypeError` at runtime.

 ## Examples
 ```python
 class M1(type): ...
 class M2(type): ...
 class A(metaclass=M1): ...
 class B(metaclass=M2): ...

 # TypeError: metaclass conflict
 class C(A, B): ...
 ```
invalid-argument-typedetects call arguments whose type is not assignable to the corresponding typed parameter ## What it does
 Detects call arguments whose type is not assignable to the corresponding typed parameter.

 ## Why is this bad?
 Passing an argument of a type the function (or callable object) does not accept violates
 the expectations of the function author and may cause unexpected runtime errors within the
 body of the function.

 ## Examples
 ```python
 def func(x: int): ...
 func("foo")  # error: [invalid-argument-type]
 ```
invalid-generic-classdetects invalid generic classes ## What it does
 Checks for the creation of invalid generic classes

 ## Why is this bad?
 There are several requirements that you must follow when defining a generic class.
 Many of these result in `TypeError` being raised at runtime if they are violated.

 ## Examples
 ```python
 from typing_extensions import Generic, TypeVar

 T = TypeVar("T")
 U = TypeVar("U", default=int)

 # error: class uses both PEP-695 syntax and legacy syntax
 class C[U](Generic[T]): ...

 # error: type parameter with default comes before type parameter without default
 class D(Generic[U, T]): ...
 ```

 ## References
 - [Typing spec: Generics](https://typing.python.org/en/latest/spec/generics.html#introduction)
0.0.1-alpha.22useless-overload-bodydetects `@overload`-decorated functions with non-stub bodies ## What it does
 Checks for various `@overload`-decorated functions that have non-stub bodies.

 ## Why is this bad?
 Functions decorated with `@overload` are ignored at runtime; they are overridden
 by the implementation function that follows the series of overloads. While it is
 not illegal to provide a body for an `@overload`-decorated function, it may indicate
 a misunderstanding of how the `@overload` decorator works.

 ## Example

 ```py
 from typing import overload

 @overload
 def foo(x: int) -> int:
     return x + 1  # will never be executed

 @overload
 def foo(x: str) -> str:
     return "Oh no, got a string"  # will never be executed

 def foo(x: int | str) -> int | str:
     raise Exception("unexpected type encountered")
 ```

 Use instead:

 ```py
 from typing import assert_never, overload

 @overload
 def foo(x: int) -> int: ...

 @overload
 def foo(x: str) -> str: ...

 def foo(x: int | str) -> int | str:
     if isinstance(x, int):
         return x + 1
     elif isinstance(x, str):
         return "Oh no, got a string"
     else:
         assert_never(x)
 ```

 ## References
 - [Python documentation: `@overload`](https://docs.python.org/3/library/typing.html#typing.overload)
invalid-super-argumentdetects invalid arguments for `super()` ## What it does
 Detects `super()` calls where:
 - the first argument is not a valid class literal, or
 - the second argument is not an instance or subclass of the first argument.

 ## Why is this bad?
 `super(type, obj)` expects:
 - the first argument to be a class,
 - and the second argument to satisfy one of the following:
   - `isinstance(obj, type)` is `True`
   - `issubclass(obj, type)` is `True`

 Violating this relationship will raise a `TypeError` at runtime.
```