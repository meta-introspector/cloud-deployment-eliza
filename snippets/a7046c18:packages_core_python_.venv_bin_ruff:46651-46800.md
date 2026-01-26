# a7046c18:packages_core_python_.venv_bin_ruff:46651-46800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46651-46800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
class Bar:
    __slots__ = [
        "a", "c", "e",  # a comment
        "b", "d", "f",  # a second  comment
    ]
```

Lastly, this rule's fix is marked as unsafe whenever Ruff can detect that
code elsewhere in the same file reads the `__slots__` variable in some way
and the `__slots__` variable is not assigned to a set. This is because the
order of the items in `__slots__` may have semantic significance if the
`__slots__` of a class is being iterated over, or being assigned to another
value.

In the vast majority of other cases, this rule's fix is unlikely to
cause breakage; as such, Ruff will otherwise mark this rule's fix as
safe. However, note that (although it's rare) the value of `__slots__`
could still be read by code outside of the module in which the
`__slots__` definition occurs, in which case this rule's fix could
theoretically cause breakage.
## What it does
Checks for mutable objects passed as a value argument to `dict.fromkeys`.

## Why is this bad?
All values in the dictionary created by the `dict.fromkeys` method
refer to the same instance of the provided object. If that object is
modified, all values are modified, which can lead to unexpected behavior.
For example, if the empty list (`[]`) is provided as the default value,
all values in the dictionary will use the same list; as such, appending to
any one entry will append to all entries.

Instead, use a comprehension to generate a dictionary with distinct
instances of the default value.

## Example
```python
cities = dict.fromkeys(["UK", "Poland"], [])
cities["UK"].append("London")
cities["Poland"].append("Poznan")
print(cities)  # {'UK': ['London', 'Poznan'], 'Poland': ['London', 'Poznan']}
```

Use instead:
```python
cities = {country: [] for country in ["UK", "Poland"]}
cities["UK"].append("London")
cities["Poland"].append("Poznan")
print(cities)  # {'UK': ['London'], 'Poland': ['Poznan']}
```

## Fix safety
This rule's fix is marked as unsafe, as the edit will change the behavior of
the program by using a distinct object for every value in the dictionary,
rather than a shared mutable instance. In some cases, programs may rely on
the previous behavior.

## References
- [Python documentation: `dict.fromkeys`](https://docs.python.org/3/library/stdtypes.html#dict.fromkeys)
## What it does
Checks for incorrect usages of `default_factory` as a keyword argument when
initializing a `defaultdict`.

## Why is this bad?
The `defaultdict` constructor accepts a callable as its first argument.
For example, it's common to initialize a `defaultdict` with `int` or `list`
via `defaultdict(int)` or `defaultdict(list)`, to create a dictionary that
returns `0` or `[]` respectively when a key is missing.

The default factory _must_ be provided as a positional argument, as all
keyword arguments to `defaultdict` are interpreted as initial entries in
the dictionary. For example, `defaultdict(foo=1, bar=2)` will create a
dictionary with `{"foo": 1, "bar": 2}` as its initial entries.

As such, `defaultdict(default_factory=list)` will create a dictionary with
`{"default_factory": list}` as its initial entry, instead of a dictionary
that returns `[]` when a key is missing. Specifying a `default_factory`
keyword argument is almost always a mistake, and one that type checkers
can't reliably detect.

## Fix safety
This rule's fix is marked as unsafe, as converting `default_factory` from a
keyword to a positional argument will change the behavior of the code, even
if the keyword argument was used erroneously.

## Example
```python
defaultdict(default_factory=int)
defaultdict(default_factory=list)
```

Use instead:
```python
defaultdict(int)
defaultdict(list)
```
## What it does
Searches for strings that look like they were meant to be f-strings, but are missing an `f` prefix.

## Why is this bad?
Expressions inside curly braces are only evaluated if the string has an `f` prefix.

## Details

There are many possible string literals which are not meant to be f-strings
despite containing f-string-like syntax. As such, this lint ignores all strings
where one of the following conditions applies:

1. The string is a standalone expression. For example, the rule ignores all docstrings.
2. The string is part of a function call with argument names that match at least one variable
   (for example: `format("Message: {value}", value="Hello World")`)
3. The string (or a parent expression of the string) has a direct method call on it
   (for example: `"{value}".format(...)`)
4. The string has no `{...}` expression sections, or uses invalid f-string syntax.
5. The string references variables that are not in scope, or it doesn't capture variables at all.
6. Any format specifiers in the potential f-string are invalid.
7. The string is part of a function call that is known to expect a template string rather than an
   evaluated f-string: for example, a [`logging`][logging] call, a [`gettext`][gettext] call,
   or a [FastAPI path].

## Example

```python
name = "Sarah"
day_of_week = "Tuesday"
print("Hello {name}! It is {day_of_week} today!")
```

Use instead:
```python
name = "Sarah"
day_of_week = "Tuesday"
print(f"Hello {name}! It is {day_of_week} today!")
```

## Fix safety

This fix will always change the behavior of the program and, despite the precautions detailed
above, this may be undesired. As such the fix is always marked as unsafe.

## Options

- `lint.logger-objects`

[logging]: https://docs.python.org/3/howto/logging-cookbook.html#using-particular-formatting-styles-throughout-your-application
[gettext]: https://docs.python.org/3/library/gettext.html
[FastAPI path]: https://fastapi.tiangolo.com/tutorial/path-params/
## What it does
Checks for formatter suppression comments that are ineffective or incompatible
with Ruff's formatter.

```