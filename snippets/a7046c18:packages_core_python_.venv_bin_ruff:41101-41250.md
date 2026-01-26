# a7046c18:packages_core_python_.venv_bin_ruff:41101-41250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41101-41250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    def settings(self):
        pass


class Flake8:
    def lint(self):
        pass

    def settings(self):
        pass


class Pydocstyle:
    def lint(self):
        pass

    def settings(self):
        pass
```

## Options
- `lint.pylint.max-public-methods`
## What it does
Checks for functions or methods with too many return statements.

By default, this rule allows up to six return statements, as configured by
the [`lint.pylint.max-returns`] option.

## Why is this bad?
Functions or methods with many return statements are harder to understand
and maintain, and often indicative of complex logic.

## Example
```python
def capital(country: str) -> str | None:
    if country == "England":
        return "London"
    elif country == "France":
        return "Paris"
    elif country == "Poland":
        return "Warsaw"
    elif country == "Romania":
        return "Bucharest"
    elif country == "Spain":
        return "Madrid"
    elif country == "Thailand":
        return "Bangkok"
    else:
        return None
```

Use instead:
```python
def capital(country: str) -> str | None:
    capitals = {
        "England": "London",
        "France": "Paris",
        "Poland": "Warsaw",
        "Romania": "Bucharest",
        "Spain": "Madrid",
        "Thailand": "Bangkok",
    }
    return capitals.get(country)
```

## Options
- `lint.pylint.max-returns`
## What it does
Checks for functions or methods with too many branches, including (nested)
`if`, `elif`, and `else` branches, `for` loops, `try`-`except` clauses, and
`match` and `case` statements.

By default, this rule allows up to 12 branches. This can be configured
using the [`lint.pylint.max-branches`] option.

## Why is this bad?
Functions or methods with many branches are harder to understand
and maintain than functions or methods with fewer branches.

## Example
Given:
```python
def capital(country):
    if country == "Australia":
        return "Canberra"
    elif country == "Brazil":
        return "Brasilia"
    elif country == "Canada":
        return "Ottawa"
    elif country == "England":
        return "London"
    elif country == "France":
        return "Paris"
    elif country == "Germany":
        return "Berlin"
    elif country == "Poland":
        return "Warsaw"
    elif country == "Romania":
        return "Bucharest"
    elif country == "Spain":
        return "Madrid"
    elif country == "Thailand":
        return "Bangkok"
    elif country == "Turkey":
        return "Ankara"
    elif country == "United States":
        return "Washington"
    else:
        return "Unknown"  # 13th branch
```

Use instead:
```python
def capital(country):
    capitals = {
        "Australia": "Canberra",
        "Brazil": "Brasilia",
        "Canada": "Ottawa",
        "England": "London",
        "France": "Paris",
        "Germany": "Berlin",
        "Poland": "Warsaw",
        "Romania": "Bucharest",
        "Spain": "Madrid",
        "Thailand": "Bangkok",
        "Turkey": "Ankara",
        "United States": "Washington",
    }
    city = capitals.get(country, "Unknown")
    return city
```

Given:
```python
def grades_to_average_number(grades):
    numbers = []
    for grade in grades:  # 1st branch
        if len(grade) not in {1, 2}:
            raise ValueError(f"Invalid grade: {grade}")

        if len(grade) == 2 and grade[1] not in {"+", "-"}:
            raise ValueError(f"Invalid grade: {grade}")

        letter = grade[0]

        if letter in {"F", "E"}:
            number = 0.0
        elif letter == "D":
            number = 1.0
```