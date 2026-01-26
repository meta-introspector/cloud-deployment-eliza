# a7046c18:packages_core_python_.venv_bin_ruff:50251-50400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:50251-50400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 There are several requirements that you must follow when creating a `NewType`.

 ## Examples
 ```python
 from typing import NewType

 def get_name() -> str: ...

 Foo = NewType("Foo", int)        # okay
 Bar = NewType(get_name(), int)   # error: The first argument to `NewType` must be a string literal
 Baz = NewType("Baz", int | str)  # error: invalid base for `typing.NewType`
 ```
detects division by zero ## What it does
 It detects division by zero.

 ## Why is this bad?
 Dividing by zero raises a `ZeroDivisionError` at runtime.

 ## Rule status
 This rule is currently disabled by default because of the number of
 false positives it can produce.

 ## Examples
 ```python
 5 / 0
 ```
detects class definitions with an inconsistent MRO ## What it does
 Checks for classes with an inconsistent [method resolution order] (MRO).

 ## Why is this bad?
 Classes with an inconsistent MRO will raise a `TypeError` at runtime.

 ## Examples
 ```python
 class A: ...
 class B(A): ...

 # TypeError: Cannot create a consistent method resolution order
 class C(A, B): ...
 ```

 [method resolution order]: https://docs.python.org/3/glossary.html#term-method-resolution-order
detects invalid `@overload` usages ## What it does
 Checks for various invalid `@overload` usages.

 ## Why is this bad?
 The `@overload` decorator is used to define functions and methods that accepts different
 combinations of arguments and return different types based on the arguments passed. This is
 mainly beneficial for type checkers. But, if the `@overload` usage is invalid, the type
 checker may not be able to provide correct type information.

 ## Example

 Defining only one overload:

 ```py
 from typing import overload

 @overload
 def foo(x: int) -> int: ...
 def foo(x: int | None) -> int | None:
     return x
 ```

 Or, not providing an implementation for the overloaded definition:

 ```py
 from typing import overload

 @overload
 def foo() -> None: ...
 @overload
 def foo(x: int) -> int: ...
 ```

 ## References
 - [Python documentation: `@overload`](https://docs.python.org/3/library/typing.html#typing.overload)
detects invalid protocol class definitions ## What it does
 Checks for protocol classes that will raise `TypeError` at runtime.

 ## Why is this bad?
 An invalidly defined protocol class may lead to the type checker inferring
 unexpected things. It may also lead to `TypeError`s at runtime.

 ## Examples
 A `Protocol` class cannot inherit from a non-`Protocol` class;
 this raises a `TypeError` at runtime:

 ```pycon
 >>> from typing import Protocol
 >>> class Foo(int, Protocol): ...
 ...
 Traceback (most recent call last):
   File "<python-input-1>", line 1, in <module>
     class Foo(int, Protocol): ...
 TypeError: Protocols can only inherit from other protocols, got <class 'int'>
 ```
detects missing required arguments in a call ## What it does
 Checks for missing required arguments in a call.

 ## Why is this bad?
 Failing to provide a required argument will raise a `TypeError` at runtime.

 ## Examples
 ```python
 def func(x: int): ...
 func()  # TypeError: func() missing 1 required positional argument: 'x'
 ```
detects usages of `reveal_type` without importing it ## What it does
 Checks for calls to `reveal_type` without importing it.

 ## Why is this bad?
 Using `reveal_type` without importing it will raise a `NameError` at runtime.

 ## Examples
 ```python
 reveal_type(1)  # NameError: name 'reveal_type' is not defined
 ```
detects unknown keyword arguments in calls ## What it does
 Checks for keyword arguments in calls that don't match any parameter of the callable.

 ## Why is this bad?
 Providing an unknown keyword argument will raise `TypeError` at runtime.

 ## Example

 ```python
 def f(x: int) -> int: ...

 f(x=1, y=2)  # Error raised here
 ```
0.0.1-alpha.7detects class bases that are unsupported as ty could not feasibly calculate the class's MRO ## What it does
 Checks for class definitions that have bases which are unsupported by ty.

 ## Why is this bad?
 If a class has a base that is an instance of a complex type such as a union type,
 ty will not be able to resolve the [method resolution order] (MRO) for the class.
 This will lead to an inferior understanding of your codebase and unpredictable
 type-checking behavior.

 ## Examples
 ```python
 import datetime

 class A: ...
 class B: ...

 if datetime.date.today().weekday() != 6:
     C = A
 else:
```