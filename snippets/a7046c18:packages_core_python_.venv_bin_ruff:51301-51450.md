# a7046c18:packages_core_python_.venv_bin_ruff:51301-51450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:51301-51450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

 ## References
 - [Python documentation: except clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
 - [Python documentation: Built-in Exceptions](https://docs.python.org/3/library/exceptions.html#built-in-exceptions)

 ## Ruff rule
  This rule corresponds to Ruff's [`except-with-non-exception-classes` (`B030`)](https://docs.astral.sh/ruff/rules/except-with-non-exception-classes)
override-of-final-methoddetects overrides of final methods ## What it does
 Checks for methods on subclasses that override superclass methods decorated with `@final`.

 ## Why is this bad?
 Decorating a method with `@final` declares to the type checker that it should not be
 overridden on any subclass.

 ## Example

 ```python
 from typing import final

 class A:
     @final
     def foo(self): ...

 class B(A):
     def foo(self): ...  # Error raised here
 ```
Cannot delete subscript on object of type `` with no `Cannot subscript object of type `ambiguous-protocol-memberdetects protocol classes with ambiguous interfaces ## What it does
 Checks for protocol classes with members that will lead to ambiguous interfaces.

 ## Why is this bad?
 Assigning to an undeclared variable in a protocol class leads to an ambiguous
 interface which may lead to the type checker inferring unexpected things. It's
 recommended to ensure that all members of a protocol class are explicitly declared.

 ## Examples

 ```py
 from typing import Protocol

 class BaseProto(Protocol):
     a: int                               # fine (explicitly declared as `int`)
     def method_member(self) -> int: ...  # fine: a method definition using `def` is considered a declaration
     c = "some variable"                  # error: no explicit declaration, leading to ambiguity
     b = method_member                    # error: no explicit declaration, leading to ambiguity

     # error: this creates implicit assignments of `d` and `e` in the protocol class body.
     # Were they really meant to be considered protocol members?
     for d, e in enumerate(range(42)):
         pass

 class SubProto(BaseProto, Protocol):
     a = 42  # fine (declared in superclass)
 ```
0.0.1-alpha.28invalid-explicit-overridedetects methods that are decorated with `@override` but do not override any method in a superclass ## What it does
 Checks for methods that are decorated with `@override` but do not override any method in a superclass.

 ## Why is this bad?
 Decorating a method with `@override` declares to the type checker that the intention is that it should
 override a method from a superclass.

 ## Example

 ```python
 from typing import override

 class A:
     @override
     def foo(self): ...  # Error raised here

 class B(A):
     @override
     def ffooo(self): ...  # Error raised here

 class C:
     @override
     def __repr__(self): ...  # fine: overrides `object.__repr__`

 class D(A):
     @override
     def foo(self): ...  # fine: overrides `A.foo`
 ```
invalid-parameter-defaultdetects default values that can't be assigned to the parameter's annotated type ## What it does
 Checks for default values that can't be
 assigned to the parameter's annotated type.

 ## Why is this bad?
 This breaks the rules of the type system and
 weakens a type checker's ability to accurately reason about your code.

 ## Examples
 ```python
 def f(a: int = ''): ...
 ```
` is not assignable to `Declared typeDeclared type `Incompatible value of type `conflicting-argument-formsdetects when an argument is used as both a value and a type form in a call ## What it does
 Checks whether an argument is used as both a value and a type form in a call.

 ## Why is this bad?
 Such calls have confusing semantics and often indicate a logic error.

 ## Examples
 ```python
 from typing import reveal_type
 from ty_extensions import is_singleton

 if flag:
     f = repr  # Expects a value
 else:
     f = is_singleton  # Expects a type form

 f(int)  # error
 ```
parameter-already-assigneddetects multiple arguments for the same parameter ## What it does
 Checks for calls which provide more than one argument for a single parameter.

 ## Why is this bad?
 Providing multiple values for a single parameter will raise a `TypeError` at runtime.

 ## Examples

 ```python
 def f(x: int) -> int: ...

 f(1, x=2)  # Error raised here
 ```
possibly-missing-attributedetects references to possibly missing attributes ## What it does
 Checks for possibly missing attributes.

 ## Why is this bad?
 Attempting to access a missing attribute will raise an `AttributeError` at runtime.

 ## Examples
 ```python
 class A:
     if b:
         c = 0

 A.c  # AttributeError: type object 'A' has no attribute 'c'
 ```
Cannot assign to read-only property `` on object of type `Property `` defined here with no setterAttempted assignment to `` hereInvalid assignment to data descriptor attribute `` on type `` with custom `__set__` methodIndex  is out of bounds for ` with length Return type does not match returned valueexpected `` because of return typeunsupported-bool-conversiondetects boolean conversion where the object incorrectly implements `__bool__` ## What it does
 Checks for bool conversions where the object doesn't correctly implement `__bool__`.

 ## Why is this bad?
 If an exception is raised when you attempt to evaluate the truthiness of an object,
 using the object in a boolean context will fail at runtime.

 ## Examples

 ```python
 class NotBoolable:
     __bool__ = None
```