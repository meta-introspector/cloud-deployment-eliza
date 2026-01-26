# a7046c18:packages_core_python_.venv_bin_ruff:19651-19800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19651-19800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Consider using the `defusedxml` package when parsing untrusted XML data,
to protect against XML attacks.

In [preview], this rule will also flag references to insecure XML parsers.

## Example
```python
from xml.dom.pulldom import parse

content = parse("untrusted.xml")
```

Use instead:
```python
from defusedxml.pulldom import parse

content = parse("untrusted.xml")
```

## References
- [Python documentation: `xml` — XML processing modules](https://docs.python.org/3/library/xml.html)
- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)
- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)

[preview]: https://docs.astral.sh/ruff/preview/
## Removed

This rule was removed as the `lxml` library has been modified to address
known vulnerabilities and unsafe defaults. As such, the `defusedxml`
library is no longer necessary, `defusedxml` has [deprecated] its `lxml`
module.

## What it does
Checks for uses of insecure XML parsers.

## Why is this bad?
Many XML parsers are vulnerable to XML attacks (such as entity expansion),
which cause excessive memory and CPU usage by exploiting recursion. An
attacker could use such methods to access unauthorized resources.

In [preview], this rule will also flag references to insecure XML parsers.

## Example
```python
from lxml import etree

content = etree.parse("untrusted.xml")
```

## References
- [PyPI: `lxml`](https://pypi.org/project/lxml/)
- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)

[preview]: https://docs.astral.sh/ruff/preview/
[deprecated]: https://pypi.org/project/defusedxml/0.8.0rc2/#defusedxml-lxml
## What it does
Checks for the use of FTP-related functions.

## Why is this bad?
FTP is considered insecure as it does not encrypt data sent over the
connection and is thus vulnerable to numerous attacks.

Instead, consider using FTPS (which secures FTP using SSL/TLS) or SFTP.

In [preview], this rule will also flag references to FTP-related functions.

## References
- [Python documentation: `ftplib` — FTP protocol client](https://docs.python.org/3/library/ftplib.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of `ssl._create_unverified_context`.

## Why is this bad?
[PEP 476] enabled certificate and hostname validation by default in Python
standard library HTTP clients. Previously, Python did not validate
certificates by default, which could allow an attacker to perform a "man in
the middle" attack by intercepting and modifying traffic between client and
server.

To support legacy environments, `ssl._create_unverified_context` reverts to
the previous behavior that does perform verification. Otherwise, use
`ssl.create_default_context` to create a secure context.

In [preview], this rule will also flag references to `ssl._create_unverified_context`.

## Example
```python
import ssl

context = ssl._create_unverified_context()
```

Use instead:
```python
import ssl

context = ssl.create_default_context()
```

## References
- [PEP 476 – Enabling certificate verification by default for stdlib http clients: Opting out](https://peps.python.org/pep-0476/#opting-out)
- [Python documentation: `ssl` — TLS/SSL wrapper for socket objects](https://docs.python.org/3/library/ssl.html)

[PEP 476]: https://peps.python.org/pep-0476/
[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of weak or broken cryptographic hash functions in
`hashlib` and `crypt` libraries.

## Why is this bad?
Weak or broken cryptographic hash functions may be susceptible to
collision attacks (where two different inputs produce the same hash) or
pre-image attacks (where an attacker can find an input that produces a
given hash). This can lead to security vulnerabilities in applications
that rely on these hash functions.

Avoid using weak or broken cryptographic hash functions in security
contexts. Instead, use a known secure hash function such as SHA256.

Note: This rule targets the following weak algorithm names in `hashlib`:
`md4`, `md5`, `sha`, and `sha1`. It also flags uses of `crypt.crypt` and
`crypt.mksalt` when configured with `METHOD_CRYPT`, `METHOD_MD5`, or
`METHOD_BLOWFISH`.

It does not attempt to lint OpenSSL- or platform-specific aliases and OIDs
(for example: `"sha-1"`, `"ssl3-sha1"`, `"ssl3-md5"`, or
`"1.3.14.3.2.26"`), nor variations with trailing spaces, as the set of
accepted aliases depends on the underlying OpenSSL version and varies across
platforms and Python builds.

## Example
```python
import hashlib


def certificate_is_valid(certificate: bytes, known_hash: str) -> bool:
    hash = hashlib.md5(certificate).hexdigest()
    return hash == known_hash
```

Use instead:
```python
import hashlib


def certificate_is_valid(certificate: bytes, known_hash: str) -> bool:
```