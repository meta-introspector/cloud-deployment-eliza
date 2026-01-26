# a7046c18:packages_core_python_.venv_bin_ruff:19501-19650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19501-19650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

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
from xml.sax.expatreader import create_parser

parser = create_parser()
```

Use instead:
```python
from defusedxml.sax import create_parser

parser = create_parser()
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
from xml.dom.expatbuilder import parse

parse("untrusted.xml")
```

Use instead:
```python
from defusedxml.expatbuilder import parse

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
from xml.sax import make_parser

make_parser()
```

Use instead:
```python
from defusedxml.sax import make_parser

make_parser()
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
from xml.dom.minidom import parse

content = parse("untrusted.xml")
```

Use instead:
```python
from defusedxml.minidom import parse

content = parse("untrusted.xml")
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
```