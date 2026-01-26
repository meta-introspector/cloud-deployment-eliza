# a7046c18:packages_core_python_.venv_bin_ruff:19351-19500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19351-19500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for instances where URL open functions are used with unexpected schemes.

## Why is this bad?
Some URL open functions allow the use of `file:` or custom schemes (for use
instead of `http:` or `https:`). An attacker may be able to use these
schemes to access or modify unauthorized resources, and cause unexpected
behavior.

To mitigate this risk, audit all uses of URL open functions and ensure that
only permitted schemes are used (e.g., allowing `http:` and `https:`, and
disallowing `file:` and `ftp:`).

In [preview], this rule will also flag references to URL open functions.

## Example
```python
from urllib.request import urlopen

url = input("Enter a URL: ")

with urlopen(url) as response:
    ...
```

Use instead:
```python
from urllib.request import urlopen

url = input("Enter a URL: ")

if not url.startswith(("http:", "https:")):
    raise ValueError("URL must start with 'http:' or 'https:'")

with urlopen(url) as response:
    ...
```

## References
- [Python documentation: `urlopen`](https://docs.python.org/3/library/urllib.request.html#urllib.request.urlopen)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of cryptographically weak pseudo-random number generators.

## Why is this bad?
Cryptographically weak pseudo-random number generators are insecure, as they
are easily predictable. This can allow an attacker to guess the generated
numbers and compromise the security of the system.

Instead, use a cryptographically secure pseudo-random number generator
(such as using the [`secrets` module](https://docs.python.org/3/library/secrets.html))
when generating random numbers for security purposes.

In [preview], this rule will also flag references to these generators.

## Example
```python
import random

random.randrange(10)
```

Use instead:
```python
import secrets

secrets.randbelow(10)
```

## References
- [Python documentation: `random` — Generate pseudo-random numbers](https://docs.python.org/3/library/random.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for the use of Telnet-related functions.

## Why is this bad?
Telnet is considered insecure because it does not encrypt data sent over
the connection and is vulnerable to numerous attacks.

Instead, consider using a more secure protocol such as SSH.

In [preview], this rule will also flag references to Telnet-related functions.

## References
- [Python documentation: `telnetlib` — Telnet client](https://docs.python.org/3/library/telnetlib.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of insecure XML parsers.

## Why is this bad?
Many XML parsers are vulnerable to XML attacks (such as entity expansion),
which cause excessive memory and CPU usage by exploiting recursion. An
attacker could use such methods to access unauthorized resources.

Consider using the `defusedxml` package when parsing untrusted XML data,
to protect against XML attacks.

In [preview], this rule will also flag references to insecure XML parsers.

## Example
```python
from xml.etree.cElementTree import parse

tree = parse("untrusted.xml")  # Vulnerable to XML attacks.
```

Use instead:
```python
from defusedxml.cElementTree import parse

tree = parse("untrusted.xml")
```

## References
- [Python documentation: `xml` — XML processing modules](https://docs.python.org/3/library/xml.html)
- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)
- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of insecure XML parsers.

## Why is this bad?
Many XML parsers are vulnerable to XML attacks (such as entity expansion),
which cause excessive memory and CPU usage by exploiting recursion. An
attacker could use such methods to access unauthorized resources.

Consider using the `defusedxml` package when parsing untrusted XML data,
to protect against XML attacks.

In [preview], this rule will also flag references to insecure XML parsers.

## Example
```python
from xml.etree.ElementTree import parse

tree = parse("untrusted.xml")  # Vulnerable to XML attacks.
```

Use instead:
```python
from defusedxml.ElementTree import parse

tree = parse("untrusted.xml")
```

```