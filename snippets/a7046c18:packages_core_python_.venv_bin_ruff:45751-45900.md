# a7046c18:packages_core_python_.venv_bin_ruff:45751-45900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45751-45900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```


class UppercaseDict(UserDict):
    def __setitem__(self, key, value):
        super().__setitem__(key.upper(), value)


d = UppercaseDict({"a": 1, "b": 2})  # Uses __setitem__
print(d)  # {'A': 1, 'B': 2}
```

## Fix safety
This fix is marked as unsafe because `isinstance()` checks for `dict`,
`list`, and `str` types will fail when using the corresponding User class.
If you need to pass custom `dict` or `list` objects to code you don't
control, ignore this check. If you do control the code, consider using
the following type checks instead:

* `dict` -> `collections.abc.MutableMapping`
* `list` -> `collections.abc.MutableSequence`
* `str` -> No such conversion exists

## References

- [Python documentation: `collections`](https://docs.python.org/3/library/collections.html)
## What it does
Checks for uses of `sorted()` to retrieve the minimum or maximum value in
a sequence.

## Why is this bad?
Using `sorted()` to compute the minimum or maximum value in a sequence is
inefficient and less readable than using `min()` or `max()` directly.

## Example
```python
nums = [3, 1, 4, 1, 5]
lowest = sorted(nums)[0]
highest = sorted(nums)[-1]
highest = sorted(nums, reverse=True)[0]
```

Use instead:
```python
nums = [3, 1, 4, 1, 5]
lowest = min(nums)
highest = max(nums)
```

## Fix safety
In some cases, migrating to `min` or `max` can lead to a change in behavior,
notably when breaking ties.

As an example, `sorted(data, key=itemgetter(0), reverse=True)[0]` will return
the _last_ "minimum" element in the list, if there are multiple elements with
the same key. However, `min(data, key=itemgetter(0))` will return the _first_
"minimum" element in the list in the same scenario.

As such, this rule's fix is marked as unsafe.

## References
- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)
- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)
## What it does
Checks for ambiguous Unicode characters in strings.

## Why is this bad?
Some Unicode characters are visually similar to ASCII characters, but have
different code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)
is visually similar, but not identical, to the ASCII character `A`.

The use of ambiguous Unicode characters can confuse readers, cause subtle
bugs, and even make malicious code look harmless.

In [preview], this rule will also flag Unicode characters that are
confusable with other, non-preferred Unicode characters. For example, the
spec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.

You can omit characters from being flagged as ambiguous via the
[`lint.allowed-confusables`] setting.

## Example
```python
print("Ηello, world!")  # "Η" is the Greek eta (`U+0397`).
```

Use instead:
```python
print("Hello, world!")  # "H" is the Latin capital H (`U+0048`).
```

## Options
- `lint.allowed-confusables`

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for ambiguous Unicode characters in docstrings.

## Why is this bad?
Some Unicode characters are visually similar to ASCII characters, but have
different code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)
is visually similar, but not identical, to the ASCII character `A`.

The use of ambiguous Unicode characters can confuse readers, cause subtle
bugs, and even make malicious code look harmless.

In [preview], this rule will also flag Unicode characters that are
confusable with other, non-preferred Unicode characters. For example, the
spec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.

You can omit characters from being flagged as ambiguous via the
[`lint.allowed-confusables`] setting.

## Example
```python
"""A lovely docstring (with a `U+FF09` parenthesis）."""
```

Use instead:
```python
"""A lovely docstring (with no strange parentheses)."""
```

## Options
- `lint.allowed-confusables`

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for ambiguous Unicode characters in comments.

## Why is this bad?
Some Unicode characters are visually similar to ASCII characters, but have
different code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)
is visually similar, but not identical, to the ASCII character `A`.

The use of ambiguous Unicode characters can confuse readers, cause subtle
bugs, and even make malicious code look harmless.

In [preview], this rule will also flag Unicode characters that are
confusable with other, non-preferred Unicode characters. For example, the
spec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.

You can omit characters from being flagged as ambiguous via the
[`lint.allowed-confusables`] setting.

## Example
```python
foo()  # nоqa  # "о" is Cyrillic (`U+043E`)
```

Use instead:
```