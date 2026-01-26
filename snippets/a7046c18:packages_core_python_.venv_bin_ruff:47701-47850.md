# a7046c18:packages_core_python_.venv_bin_ruff:47701-47850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47701-47850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- `re.split`

For `re.sub`, the `repl` (replacement) argument must also be a string literal,
not a function. For `re.match`, `re.search`, and `re.fullmatch`, the return
value must also be used only for its truth value.

## Fix safety

This rule's fix is marked as unsafe if the affected expression contains comments. Otherwise,
the fix can be applied safely.

## References
- [Python Regular Expression HOWTO: Common Problems - Use String Methods](https://docs.python.org/3/howto/regex.html#use-string-methods)
## What it does
Checks for `dict.get(key, falsy_value)` calls in boolean test positions.

## Why is this bad?
The default fallback `None` is already falsy.

## Example

```python
if dict.get(key, False):
    ...
```

Use instead:

```python
if dict.get(key):
    ...
```

## Fix safety

This rule's fix is marked as safe, unless the `dict.get()` call contains comments between
arguments that will be deleted.

## Fix availability

This rule's fix is unavailable in cases where invalid arguments are provided to `dict.get`. As
shown in the [documentation], `dict.get` takes two positional-only arguments, so invalid cases
are identified by the presence of more than two arguments or any keyword arguments.

[documentation]: https://docs.python.org/3.13/library/stdtypes.html#dict.get
## What it does
Checks for `round()` calls that have no effect on the input.

## Why is this bad?
Rounding a value that's already an integer is unnecessary.
It's clearer to use the value directly.

## Example

```python
a = round(1, 0)
```

Use instead:

```python
a = 1
```

## Fix safety

The fix is marked unsafe if it is not possible to guarantee that the first argument of
`round()` is of type `int`, or if the fix deletes comments.
## What it does
Checks for `itertools.starmap` calls where the second argument is a `zip` call.

## Why is this bad?
`zip`-ping iterables only to unpack them later from within `starmap` is unnecessary.
For such cases, `map()` should be used instead.

## Example

```python
from itertools import starmap


starmap(func, zip(a, b))
starmap(func, zip(a, b, strict=True))
```

Use instead:

```python
map(func, a, b)
map(func, a, b, strict=True)  # 3.14+
```

## Fix safety

This rule's fix is marked as unsafe if the `starmap` or `zip` expressions contain comments that
would be deleted by applying the fix. Otherwise, the fix can be applied safely.

## Fix availability

This rule will emit a diagnostic but not suggest a fix if `map` has been shadowed from its
builtin binding.
## What it does
Checks for the presence of unused variables in unpacked assignments.

## Why is this bad?
A variable that is defined but never used can confuse readers.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

## Example

```python
def get_pair():
    return 1, 2


def foo():
    x, y = get_pair()
    return x
```

Use instead:

```python
def foo():
    x, _ = get_pair()
    return x
```

## See also

This rule applies only to unpacked assignments. For regular assignments, see
[`unused-variable`][F841].

## Options
- `lint.dummy-variable-rgx`

[F841]: https://docs.astral.sh/ruff/rules/unused-variable/
## What it does
Checks for membership tests on empty collections (such as `list`, `tuple`, `set` or `dict`).

## Why is this bad?
If the collection is always empty, the check is unnecessary, and can be removed.

## Example

```python
if 1 not in set():
```