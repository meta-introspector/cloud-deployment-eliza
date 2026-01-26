# a7046c18:packages_core_python_.venv_bin_ruff:23101-23250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23101-23250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for `dict()` calls that take unnecessary dict literals or dict
comprehensions as arguments.

## Why is this bad?
It's unnecessary to wrap a dict literal or comprehension within a `dict()`
call, since the literal or comprehension syntax already returns a
dictionary.

## Example
```python
dict({})
dict({"a": 1})
```

Use instead:
```python
{}
{"a": 1}
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary list or set comprehensions passed to builtin functions that take an iterable.

Set comprehensions are only a violation in the case where the builtin function does not care about
duplication of elements in the passed iterable.

## Why is this bad?
Many builtin functions (this rule currently covers `any` and `all` in stable, along with `min`,
`max`, and `sum` in [preview]) accept any iterable, including a generator. Constructing a
temporary list via list comprehension is unnecessary and wastes memory for large iterables.

`any` and `all` can also short-circuit iteration, saving a lot of time. The unnecessary
comprehension forces a full iteration of the input iterable, giving up the benefits of
short-circuiting. For example, compare the performance of `all` with a list comprehension
against that of a generator in a case where an early short-circuit is possible (almost 40x
faster):

```console
In [1]: %timeit all([i for i in range(1000)])
8.14 µs ± 25.4 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)

In [2]: %timeit all(i for i in range(1000))
212 ns ± 0.892 ns per loop (mean ± std. dev. of 7 runs, 1,000,000 loops each)
```

This performance improvement is due to short-circuiting. If the entire iterable has to be
traversed, the comprehension version may even be a bit faster: list allocation overhead is not
necessarily greater than generator overhead.

Applying this rule simplifies the code and will usually save memory, but in the absence of
short-circuiting it may not improve performance. (It may even slightly regress performance,
though the difference will usually be small.)

## Example
```python
any([x.id for x in bar])
all([x.id for x in bar])
sum([x.val for x in bar])
min([x.val for x in bar])
max([x.val for x in bar])
```

Use instead:
```python
any(x.id for x in bar)
all(x.id for x in bar)
sum(x.val for x in bar)
min(x.val for x in bar)
max(x.val for x in bar)
```

## Fix safety
This rule's fix is marked as unsafe, as it can change the behavior of the code if the iteration
has side effects (due to laziness and short-circuiting). The fix may also drop comments when
rewriting some comprehensions.

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for unnecessary dict comprehension when creating a dictionary from
an iterable.

## Why is this bad?
It's unnecessary to use a dict comprehension to build a dictionary from
an iterable when the value is static.

Prefer `dict.fromkeys(iterable)` over `{value: None for value in iterable}`,
as `dict.fromkeys` is more readable and efficient.

## Example
```python
{a: None for a in iterable}
{a: 1 for a in iterable}
```

Use instead:
```python
dict.fromkeys(iterable)
dict.fromkeys(iterable, 1)
```

## Fix safety
This rule's fix is marked as unsafe if there's comments inside the dict comprehension,
as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
{  # comment 1
    a:  # comment 2
    None  # comment 3
    for a in iterable  # comment 4
}
```

## References
- [Python documentation: `dict.fromkeys`](https://docs.python.org/3/library/stdtypes.html#dict.fromkeys)
## What it does
Checks for the absence of copyright notices within Python files.

Note that this check only searches within the first 4096 bytes of the file.

## Why is this bad?
In some codebases, it's common to have a license header at the top of every
file. This rule ensures that the license header is present.

## Options
- `lint.flake8-copyright.author`
- `lint.flake8-copyright.min-file-size`
- `lint.flake8-copyright.notice-rgx`
## What it does
Checks for `datetime` instantiations that do not specify a timezone.

## Why is this bad?
`datetime` objects are "naive" by default, in that they do not include
timezone information. "Naive" objects are easy to understand, but ignore
some aspects of reality, which can lead to subtle bugs. Timezone-aware
`datetime` objects are preferred, as they represent a specific moment in
time, unlike "naive" objects.

By providing a non-`None` value for `tzinfo`, a `datetime` can be made
timezone-aware.

## Example
```python
```