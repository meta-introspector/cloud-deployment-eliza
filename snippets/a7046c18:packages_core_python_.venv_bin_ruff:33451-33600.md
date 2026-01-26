# a7046c18:packages_core_python_.venv_bin_ruff:33451-33600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33451-33600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Fix safety
The fix does not perform any type analysis and, as such, may suggest an
incorrect fix if the object in question does not duck-type as a mapping
(e.g., if it is missing a `.keys()` or `.values()` method, or if those
methods behave differently than they do on standard mapping types).
## What it does
Checks for uses of except handling via `try`-`except` within `for` and
`while` loops.

## Why is this bad?
Exception handling via `try`-`except` blocks incurs some performance
overhead, regardless of whether an exception is raised.

To optimize your code, two techniques are possible:
1. Refactor your code to put the entire loop into the `try`-`except` block,
   rather than wrapping each iteration in a separate `try`-`except` block.
2. Use "Look Before You Leap" idioms that attempt to avoid exceptions
   being raised in the first place, avoiding the need to use `try`-`except`
   blocks in the first place.

This rule is only enforced for Python versions prior to 3.11, which
introduced "zero-cost" exception handling. However, note that even on
Python 3.11 and newer, refactoring your code to avoid exception handling in
tight loops can provide a significant speedup in some cases, as zero-cost
exception handling is only zero-cost in the "happy path" where no exception
is raised in the `try`-`except` block.

As with all `perflint` rules, this is only intended as a
micro-optimization. In many cases, it will have a negligible impact on
performance.

## Example
```python
string_numbers: list[str] = ["1", "2", "three", "4", "5"]

# `try`/`except` that could be moved out of the loop:
int_numbers: list[int] = []
for num in string_numbers:
    try:
        int_numbers.append(int(num))
    except ValueError as e:
        print(f"Couldn't convert to integer: {e}")
        break

# `try`/`except` used when "look before you leap" idioms could be used:
number_names: dict[int, str] = {1: "one", 3: "three", 4: "four"}
for number in range(5):
    try:
        name = number_names[number]
    except KeyError:
        continue
    else:
        print(f"The name of {number} is {name}")
```

Use instead:
```python
string_numbers: list[str] = ["1", "2", "three", "4", "5"]

int_numbers: list[int] = []
try:
    for num in string_numbers:
        int_numbers.append(int(num))
except ValueError as e:
    print(f"Couldn't convert to integer: {e}")

number_names: dict[int, str] = {1: "one", 3: "three", 4: "four"}
for number in range(5):
    name = number_names.get(number)
    if name is not None:
        print(f"The name of {number} is {name}")
```

## Options
- `target-version`
## What it does
Checks for `for` loops that can be replaced by a list comprehension.

## Why is this bad?
When creating a transformed list from an existing list using a for-loop,
prefer a list comprehension. List comprehensions are more readable and
more performant.

Using the below as an example, the list comprehension is ~10% faster on
Python 3.11, and ~25% faster on Python 3.10.

Note that, as with all `perflint` rules, this is only intended as a
micro-optimization, and will have a negligible impact on performance in
most cases.

## Example
```python
original = list(range(10000))
filtered = []
for i in original:
    if i % 2:
        filtered.append(i)
```

Use instead:
```python
original = list(range(10000))
filtered = [x for x in original if x % 2]
```

If you're appending to an existing list, use the `extend` method instead:
```python
original = list(range(10000))
filtered.extend(x for x in original if x % 2)
```
## What it does
Checks for `for` loops that can be replaced by a making a copy of a list.

## Why is this bad?
When creating a copy of an existing list using a for-loop, prefer
`list` or `list.copy` instead. Making a direct copy is more readable and
more performant.

Using the below as an example, the `list`-based copy is ~2x faster on
Python 3.11.

Note that, as with all `perflint` rules, this is only intended as a
micro-optimization, and will have a negligible impact on performance in
most cases.

## Example
```python
original = list(range(10000))
filtered = []
for i in original:
    filtered.append(i)
```

Use instead:
```python
original = list(range(10000))
filtered = list(original)
```
## What it does
Checks for `for` loops that can be replaced by a dictionary comprehension.

## Why is this bad?
When creating or extending a dictionary in a for-loop, prefer a dictionary
comprehension. Comprehensions are more readable and more performant.

For example, when comparing `{x: x for x in list(range(1000))}` to the `for`
loop version, the comprehension is ~10% faster on Python 3.11.

Note that, as with all `perflint` rules, this is only intended as a
micro-optimization, and will have a negligible impact on performance in
```