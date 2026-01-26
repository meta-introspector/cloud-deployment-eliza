# a7046c18:packages_core_python_.venv_bin_ruff:50401-50550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:50401-50550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
     C = B

 class D(C): ...  # error: [unsupported-base]
 ```

 [method resolution order]: https://docs.python.org/3/glossary.html#term-method-resolution-order
call-non-callabledetects calls to non-callable objects ## What it does
 Checks for calls to non-callable objects.

 ## Why is this bad?
 Calling a non-callable object will raise a `TypeError` at runtime.

 ## Examples
 ```python
 4()  # TypeError: 'int' object is not callable
 ```
0.0.7call-top-callabledetects calls to the top callable type ## What it does
 Checks for calls to objects typed as `Top[Callable[..., T]]` (the infinite union of all
 callable types with return type `T`).

 ## Why is this bad?
 When an object is narrowed to `Top[Callable[..., object]]` (e.g., via `callable(x)` or
 `isinstance(x, Callable)`), we know the object is callable, but we don't know its
 precise signature. This type represents the set of all possible callable types
 (including, e.g., functions that take no arguments and functions that require arguments),
 so no specific set of arguments can be guaranteed to be valid.

 ## Examples
 ```python
 def f(x: object):
     if callable(x):
         x()  # error: We know `x` is callable, but not what arguments it accepts
 ```
0.0.1-alpha.12duplicate-kw-onlydetects dataclass definitions with more than one usage of `KW_ONLY` ## What it does
 Checks for dataclass definitions with more than one field
 annotated with `KW_ONLY`.

 ## Why is this bad?
 `dataclasses.KW_ONLY` is a special marker used to
 emulate the `*` syntax in normal signatures.
 It can only be used once per dataclass.

 Attempting to annotate two different fields with
 it will lead to a runtime error.

 ## Examples
 ```python
 from dataclasses import dataclass, KW_ONLY

 @dataclass
 class A:  # Crash at runtime
     b: int
     _1: KW_ONLY
     c: str
     _2: KW_ONLY
     d: bytes
 ```
invalid-metaclassdetects invalid `metaclass=` arguments ## What it does
 Checks for arguments to `metaclass=` that are invalid.

 ## Why is this bad?
 Python allows arbitrary expressions to be used as the argument to `metaclass=`.
 These expressions, however, need to be callable and accept the same arguments
 as `type.__new__`.

 ## Example

 ```python
 def f(): ...

 # TypeError: f() takes 0 positional arguments but 3 were given
 class B(metaclass=f): ...
 ```

 ## References
 - [Python documentation: Metaclasses](https://docs.python.org/3/reference/datamodel.html#metaclasses)
invalid-paramspecdetects invalid ParamSpec usage ## What it does
 Checks for the creation of invalid `ParamSpec`s

 ## Why is this bad?
 There are several requirements that you must follow when creating a `ParamSpec`.

 ## Examples
 ```python
 from typing import ParamSpec

 P1 = ParamSpec("P1")  # okay
 P2 = ParamSpec("S2")  # error: ParamSpec name must match the variable it's assigned to
 ```

 ## References
 - [Typing spec: ParamSpec](https://typing.python.org/en/latest/spec/generics.html#paramspec)
invalid-type-formdetects invalid type forms ## What it does
 Checks for expressions that are used as [type expressions]
 but cannot validly be interpreted as such.

 ## Why is this bad?
 Such expressions cannot be understood by ty.
 In some cases, they might raise errors at runtime.

 ## Examples
 ```python
 from typing import Annotated

 a: type[1]  # `1` is not a type
 b: Annotated[int]  # `Annotated` expects at least two arguments
 ```
 [type expressions]: https://typing.python.org/en/latest/spec/annotations.html#type-and-annotation-expressions
not-subscriptabledetects subscripting objects that do not support subscripting ## What it does
 Checks for subscripting objects that do not support subscripting.

 ## Why is this bad?
 Subscripting an object that does not support it will raise a `TypeError` at runtime.

 ## Examples
 ```python
 4[1]  # TypeError: 'int' object is not subscriptable
 ```
0.0.1-alpha.15unresolved-globaldetects `global` statements with no definition in the global scope ## What it does
 Detects variables declared as `global` in an inner scope that have no explicit
 bindings or declarations in the global scope.

 ## Why is this bad?
 Function bodies with `global` statements can run in any order (or not at all), which makes
 it hard for static analysis tools to infer the types of globals without
 explicit definitions or declarations.

 ## Example
 ```python
 def f():
     global x  # unresolved global
     x = 42

 def g():
     print(x)  # unresolved reference
 ```

 Use instead:

 ```python
 x: int

 def f():
     global x
     x = 42

 def g():
     print(x)
 ```

```