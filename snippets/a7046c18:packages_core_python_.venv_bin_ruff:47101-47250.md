# a7046c18:packages_core_python_.venv_bin_ruff:47101-47250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47101-47250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## References
- [Python documentation: Union type](https://docs.python.org/3/library/stdtypes.html#types-union)
- [Python documentation: `typing.Optional`](https://docs.python.org/3/library/typing.html#typing.Optional)
- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)
## What it does
Checks for usages of `collections.deque` that have an empty iterable as the first argument.

## Why is this bad?
It's unnecessary to use an empty literal as a deque's iterable, since this is already the default behavior.

## Example

```python
from collections import deque

queue = deque(set())
queue = deque([], 10)
```

Use instead:

```python
from collections import deque

queue = deque()
queue = deque(maxlen=10)
```

## Fix safety

The fix is marked as unsafe whenever it would delete comments present in the `deque` call or if
there are unrecognized arguments other than `iterable` and `maxlen`.

## Fix availability

This rule's fix is unavailable if any starred arguments are present after the initial iterable.

## References
- [Python documentation: `collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque)
## What it does
Checks for `Literal[True, False]` type annotations.

## Why is this bad?
`Literal[True, False]` can be replaced with `bool` in type annotations,
which has the same semantic meaning but is more concise and readable.

`bool` type has exactly two constant instances: `True` and `False`. Static
type checkers such as [mypy] treat `Literal[True, False]` as equivalent to
`bool` in a type annotation.

## Example
```python
from typing import Literal

x: Literal[True, False]
y: Literal[True, False, "hello", "world"]
```

Use instead:
```python
from typing import Literal

x: bool
y: Literal["hello", "world"] | bool
```

## Fix safety
The fix for this rule is marked as unsafe, as it may change the semantics of the code.
Specifically:

- Type checkers may not treat `bool` as equivalent when overloading boolean arguments
  with `Literal[True]` and `Literal[False]` (see, e.g., [#14764] and [#5421]).
- `bool` is not strictly equivalent to `Literal[True, False]`, as `bool` is
  a subclass of `int`, and this rule may not apply if the type annotations are used
  in a numeric context.

Further, the `Literal` slice may contain trailing-line comments which the fix would remove.

## References
- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.python.org/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)
- [Python documentation: Boolean type - `bool`](https://docs.python.org/3/library/stdtypes.html#boolean-type-bool)

[mypy]: https://github.com/python/mypy/blob/master/mypy/typeops.py#L985
[#14764]: https://github.com/python/mypy/issues/14764
[#5421]: https://github.com/microsoft/pyright/issues/5421
## What it does
Reports the following `re` and `regex` calls when
their first arguments are not raw strings:

- For `regex` and `re`: `compile`, `findall`, `finditer`,
  `fullmatch`, `match`, `search`, `split`, `sub`, `subn`.
- `regex`-specific: `splititer`, `subf`, `subfn`, `template`.

## Why is this bad?
Regular expressions should be written
using raw strings to avoid double escaping.

## Fix safety
The fix is unsafe if the string/bytes literal contains an escape sequence because the fix alters
the runtime value of the literal while retaining the regex semantics.

For example
```python
# Literal is `1\n2`.
re.compile("1\n2")

# Literal is `1\\n2`, but the regex library will interpret `\\n` and will still match a newline
# character as before.
re.compile(r"1\n2")
```

## Fix availability
 A fix is not available if either
 * the argument is a string with a (no-op) `u` prefix (e.g., `u"foo"`) as the prefix is
   incompatible with the raw prefix `r`
 * the argument is a string or bytes literal with an escape sequence that has a different
   meaning in the context of a regular expression such as `\b`, which is word boundary or
   backspace in a regex, depending on the context, but always a backspace in string and bytes
   literals.

## Example

```python
re.compile("foo\\bar")
```

Use instead:

```python
re.compile(r"foo\bar")
```
## What it does
Checks for invalid use of literals in assert message arguments.

## Why is this bad?
An assert message which is a non-string literal was likely intended
to be used in a comparison assertion, rather than as a message.

## Example
```python
fruits = ["apples", "plums", "pears"]
fruits.filter(lambda fruit: fruit.startwith("p"))
assert len(fruits), 2  # True unless the list is empty
```

Use instead:
```python
fruits = ["apples", "plums", "pears"]
```