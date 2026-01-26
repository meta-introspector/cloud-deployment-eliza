# a7046c18:packages_core_python_.venv_bin_ruff:51151-51300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:51151-51300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 # main.py
 from module import a  # ImportError: cannot import name 'a' from 'module'
 ```
subclass-of-final-classdetects subclasses of final classes ## What it does
 Checks for classes that subclass final classes.

 ## Why is this bad?
 Decorating a class with `@final` declares to the type checker that it should not be subclassed.

 ## Example

 ```python
 from typing import final

 @final
 class A: ...
 class B(A): ...  # Error raised here
 ```
Unsupported class baseHas type `Unsupported class base with type `ty cannot resolve a consistent method resolution order (MRO) for class `` due to this baseOnly class objects or `Any` are supported as class basesconflicting-declarations ## What it does
 Checks whether a variable has been declared as two conflicting types.

 ## Why is this bad
 A variable with two conflicting declarations likely indicates a mistake.
 Moreover, it could lead to incorrect or ill-defined type inference for
 other code that relies on these variables.

 ## Examples
 ```python
 if b:
     a: int
 else:
     a: str

 a = 1
 ```
instance-layout-conflictdetects class definitions that raise `TypeError` due to instance layout conflict ## What it does
 Checks for classes definitions which will fail at runtime due to
 "instance memory layout conflicts".

 This error is usually caused by attempting to combine multiple classes
 that define non-empty `__slots__` in a class's [Method Resolution Order]
 (MRO), or by attempting to combine multiple builtin classes in a class's
 MRO.

 ## Why is this bad?
 Inheriting from bases with conflicting instance memory layouts
 will lead to a `TypeError` at runtime.

 An instance memory layout conflict occurs when CPython cannot determine
 the memory layout instances of a class should have, because the instance
 memory layout of one of its bases conflicts with the instance memory layout
 of one or more of its other bases.

 For example, if a Python class defines non-empty `__slots__`, this will
 impact the memory layout of instances of that class. Multiple inheritance
 from more than one different class defining non-empty `__slots__` is not
 allowed:

 ```python
 class A:
     __slots__ = ("a", "b")

 class B:
     __slots__ = ("a", "b")  # Even if the values are the same

 # TypeError: multiple bases have instance lay-out conflict
 class C(A, B): ...
 ```

 An instance layout conflict can also be caused by attempting to use
 multiple inheritance with two builtin classes, due to the way that these
 classes are implemented in a CPython C extension:

 ```python
 class A(int, float): ...  # TypeError: multiple bases have instance lay-out conflict
 ```

 Note that pure-Python classes with no `__slots__`, or pure-Python classes
 with empty `__slots__`, are always compatible:

 ```python
 class A: ...
 class B:
     __slots__ = ()
 class C:
     __slots__ = ("a", "b")

 # fine
 class D(A, B, C): ...
 ```

 ## Known problems
 Classes that have "dynamic" definitions of `__slots__` (definitions do not consist
 of string literals, or tuples of string literals) are not currently considered disjoint
 bases by ty.

 Additionally, this check is not exhaustive: many C extensions (including several in
 the standard library) define classes that use extended memory layouts and thus cannot
 coexist in a single MRO. Since it is currently not possible to represent this fact in
 stub files, having a full knowledge of these classes is also impossible. When it comes
 to classes that do not define `__slots__` at the Python level, therefore, ty, currently
 only hard-codes a number of cases where it knows that a class will produce instances with
 an atypical memory layout.

 ## Further reading
 - [CPython documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)
 - [CPython documentation: Method Resolution Order](https://docs.python.org/3/glossary.html#term-method-resolution-order)

 [Method Resolution Order]: https://docs.python.org/3/glossary.html#term-method-resolution-order
invalid-attribute-accessInvalid attribute access ## What it does
 Checks for assignments to class variables from instances
 and assignments to instance variables from its class.

 ## Why is this bad?
 Incorrect assignments break the rules of the type system and
 weaken a type checker's ability to accurately reason about your code.

 ## Examples
 ```python
 class C:
     class_var: ClassVar[int] = 1
     instance_var: int

 C.class_var = 3  # okay
 C().class_var = 3  # error: Cannot assign to class variable

 C().instance_var = 3  # okay
 C.instance_var = 3  # error: Cannot assign to instance variable
 ```
invalid-exception-caughtdetects exception handlers that catch classes that do not inherit from `BaseException` ## What it does
 Checks for exception handlers that catch non-exception classes.

 ## Why is this bad?
 Catching classes that do not inherit from `BaseException` will raise a `TypeError` at runtime.

 ## Example
 ```python
 try:
     1 / 0
 except 1:
     ...
 ```

 Use instead:
 ```python
 try:
     1 / 0
 except ZeroDivisionError:
     ...
 ```
```