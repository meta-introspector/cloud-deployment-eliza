# a7046c18:packages_core_python_.venv_bin_ruff:50551-50700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:50551-50700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 Or:

 ```python
 x: int | None = None

 def f():
     global x
     x = 42

 def g():
     print(x)
 ```
unresolved-importdetects unresolved imports ## What it does
 Checks for import statements for which the module cannot be resolved.

 ## Why is this bad?
 Importing a module that cannot be resolved will raise a `ModuleNotFoundError`
 at runtime.

 ## Examples
 ```python
 import foo  # ModuleNotFoundError: No module named 'foo'
 ```
invalid-assignmentdetects invalid assignments ## What it does
 Checks for assignments where the type of the value
 is not [assignable to] the type of the assignee.

 ## Why is this bad?
 Such assignments break the rules of the type system and
 weaken a type checker's ability to accurately reason about your code.

 ## Examples
 ```python
 a: int = ''
 ```

 [assignable to]: https://typing.python.org/en/latest/spec/glossary.html#term-assignable
index-out-of-boundsdetects index out of bounds errors ## What it does
 Checks for attempts to use an out of bounds index to get an item from
 a container.

 ## Why is this bad?
 Using an out of bounds index will raise an `IndexError` at runtime.

 ## Examples
 ```python
 t = (0, 1, 2)
 t[3]  # IndexError: tuple index out of range
 ```
invalid-declarationdetects invalid declarations ## What it does
 Checks for declarations where the inferred type of an existing symbol
 is not [assignable to] its post-hoc declared type.

 ## Why is this bad?
 Such declarations break the rules of the type system and
 weaken a type checker's ability to accurately reason about your code.

 ## Examples
 ```python
 a = 1
 a: str
 ```

 [assignable to]: https://typing.python.org/en/latest/spec/glossary.html#term-assignable
invalid-named-tupledetects invalid `NamedTuple` class definitions ## What it does
 Checks for invalidly defined `NamedTuple` classes.

 ## Why is this bad?
 An invalidly defined `NamedTuple` class may lead to the type checker
 drawing incorrect conclusions. It may also lead to `TypeError`s or
 `AttributeError`s at runtime.

 ## Examples
 A class definition cannot combine `NamedTuple` with other base classes
 in multiple inheritance; doing so raises a `TypeError` at runtime. The sole
 exception to this rule is `Generic[]`, which can be used alongside `NamedTuple`
 in a class's bases list.

 ```pycon
 >>> from typing import NamedTuple
 >>> class Foo(NamedTuple, object): ...
 TypeError: can only inherit from a NamedTuple type and Generic
 ```

 Further, `NamedTuple` field names cannot start with an underscore:

 ```pycon
 >>> from typing import NamedTuple
 >>> class Foo(NamedTuple):
 ...     _bar: int
 ValueError: Field names cannot start with an underscore: '_bar'
 ```

 `NamedTuple` classes also have certain synthesized attributes (like `_asdict`, `_make`,
 `_replace`, etc.) that cannot be overwritten. Attempting to assign to these attributes
 without a type annotation will raise an `AttributeError` at runtime.

 ```pycon
 >>> from typing import NamedTuple
 >>> class Foo(NamedTuple):
 ...     x: int
 ...     _asdict = 42
 AttributeError: Cannot overwrite NamedTuple attribute _asdict
 ```
invalid-return-typedetects returned values that can't be assigned to the function's annotated return type ## What it does
 Detects returned values that can't be assigned to the function's annotated return type.

 ## Why is this bad?
 Returning an object of a type incompatible with the annotated return type may cause confusion to the user calling the function.

 ## Examples
 ```python
 def func() -> int:
     return "a"  # error: [invalid-return-type]
 ```
static-assert-errorFailed static assertion ## What it does
 Makes sure that the argument of `static_assert` is statically known to be true.

 ## Why is this bad?
 A `static_assert` call represents an explicit request from the user
 for the type checker to emit an error if the argument cannot be verified
 to evaluate to `True` in a boolean context.

 ## Examples
 ```python
 from ty_extensions import static_assert

 static_assert(1 + 1 == 3)  # error: evaluates to `False`

 static_assert(int(2.0 * 3.0) == 6)  # error: does not have a statically known truthiness
 ```
Invalid class base with type `Definition of class `` will raise `TypeError` at runtimeno-matching-overloaddetects calls that do not match any overload ## What it does
 Checks for calls to an overloaded function that do not match any of the overloads.

 ## Why is this bad?
 Failing to provide the correct arguments to one of the overloads will raise a `TypeError`
 at runtime.

 ## Examples
 ```python
 @overload
 def func(x: int): ...
 @overload
 def func(x: bool): ...
 func("string")  # error: [no-matching-overload]
 ```
unresolved-attributedetects references to unresolved attributes ## What it does
 Checks for unresolved attributes.

 ## Why is this bad?
```