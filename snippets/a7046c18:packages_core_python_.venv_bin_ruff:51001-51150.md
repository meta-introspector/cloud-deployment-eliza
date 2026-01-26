# a7046c18:packages_core_python_.venv_bin_ruff:51001-51150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:51001-51150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 Such a statement will raise `TypeError` at runtime.

 ## Examples
 ```python
 # TypeError: 'int' object does not support the context manager protocol
 with 1:
     print(2)
 ```
invalid-method-overridedetects method definitions that violate the Liskov Substitution Principle ## What it does
 Detects method overrides that violate the [Liskov Substitution Principle] ("LSP").

 The LSP states that an instance of a subtype should be substitutable for an instance of its supertype.
 Applied to Python, this means:
 1. All argument combinations a superclass method accepts
    must also be accepted by an overriding subclass method.
 2. The return type of an overriding subclass method must be a subtype
    of the return type of the superclass method.

 ## Why is this bad?
 Violating the Liskov Substitution Principle will lead to many of ty's assumptions and
 inferences being incorrect, which will mean that it will fail to catch many possible
 type errors in your code.

 ## Example
 ```python
 class Super:
     def method(self, x) -> int:
         return 42

 class Sub(Super):
     # Liskov violation: `str` is not a subtype of `int`,
     # but the supertype method promises to return an `int`.
     def method(self, x) -> str:  # error: [invalid-override]
         return "foo"

 def accepts_super(s: Super) -> int:
     return s.method(x=42)

 accepts_super(Sub())  # The result of this call is a string, but ty will infer
                       # it to be an `int` due to the violation of the Liskov Substitution Principle.

 class Sub2(Super):
     # Liskov violation: the superclass method can be called with a `x=`
     # keyword argument, but the subclass method does not accept it.
     def method(self, y) -> int:  # error: [invalid-override]
        return 42

 accepts_super(Sub2())  # TypeError at runtime: method() got an unexpected keyword argument 'x'
                        # ty cannot catch this error due to the violation of the Liskov Substitution Principle.
 ```

 ## Common issues

 ### Why does ty complain about my `__eq__` method?

 `__eq__` and `__ne__` methods in Python are generally expected to accept arbitrary
 objects as their second argument, for example:

 ```python
 class A:
     x: int

     def __eq__(self, other: object) -> bool:
         # gracefully handle an object of an unexpected type
         # without raising an exception
         if not isinstance(other, A):
             return False
         return self.x == other.x
 ```

 If `A.__eq__` here were annotated as only accepting `A` instances for its second argument,
 it would imply that you wouldn't be able to use `==` between instances of `A` and
 instances of unrelated classes without an exception possibly being raised. While some
 classes in Python do indeed behave this way, the strongly held convention is that it should
 be avoided wherever possible. As part of this check, therefore, ty enforces that `__eq__`
 and `__ne__` methods accept `object` as their second argument.

 ### Why does ty disagree with Ruff about how to write my method?

 Ruff has several rules that will encourage you to rename a parameter, or change its type
 signature, if it thinks you're falling into a certain anti-pattern. For example, Ruff's
 [ARG002](https://docs.astral.sh/ruff/rules/unused-method-argument/) rule recommends that an
 unused parameter should either be removed or renamed to start with `_`. Applying either of
 these suggestions can cause ty to start reporting an `invalid-method-override` error if
 the function in question is a method on a subclass that overrides a method on a superclass,
 and the change would cause the subclass method to no longer accept all argument combinations
 that the superclass method accepts.

 This can usually be resolved by adding [`@typing.override`][override] to your method
 definition. Ruff knows that a method decorated with `@typing.override` is intended to
 override a method by the same name on a superclass, and avoids reporting rules like ARG002
 for such methods; it knows that the changes recommended by ARG002 would violate the Liskov
 Substitution Principle.

 Correct use of `@override` is enforced by ty's `invalid-explicit-override` rule.

 [Liskov Substitution Principle]: https://en.wikipedia.org/wiki/Liskov_substitution_principle
 [override]: https://docs.python.org/3/library/typing.html#typing.override
0.0.1-alpha.6invalid-type-alias-typedetects invalid TypeAliasType definitions ## What it does
 Checks for the creation of invalid `TypeAliasType`s

 ## Why is this bad?
 There are several requirements that you must follow when creating a `TypeAliasType`.

 ## Examples
 ```python
 from typing import TypeAliasType

 IntOrStr = TypeAliasType("IntOrStr", int | str)  # okay
 NewAlias = TypeAliasType(get_name(), int)        # error: TypeAliasType name must be a string literal
 ```
0.0.1-alpha.11invalid-type-guard-calldetects type guard function calls that has no narrowing effect ## What it does
 Checks for type guard function calls without a valid target.

 ## Why is this bad?
 The first non-keyword non-variadic argument to a type guard function
 is its target and must map to a symbol.

 Starred (`is_str(*a)`), literal (`is_str(42)`) and other non-symbol-like
 expressions are invalid as narrowing targets.

 ## Examples
 ```python
 from typing import TypeIs

 def f(v: object) -> TypeIs[int]: ...

 f()  # Error
 f(*a)  # Error
 f(10)  # Error
 ```
possibly-missing-import ## What it does
 Checks for imports of symbols that may be missing.

 ## Why is this bad?
 Importing a missing module or name will raise a `ModuleNotFoundError`
 or `ImportError` at runtime.

 ## Rule status
 This rule is currently disabled by default because of the number of
 false positives it can produce.

 ## Examples
 ```python
 # module.py
 import datetime

 if datetime.date.today().weekday() != 6:
     a = 1

```