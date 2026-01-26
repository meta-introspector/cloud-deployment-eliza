# a7046c18:packages_core_python_.venv_bin_ruff:19801-19950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19801-19950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    hash = hashlib.sha256(certificate).hexdigest()
    return hash == known_hash
```

or add `usedforsecurity=False` if the hashing algorithm is not used in a security context, e.g.
as a non-cryptographic one-way compression function:
```python
import hashlib


def certificate_is_valid(certificate: bytes, known_hash: str) -> bool:
    hash = hashlib.md5(certificate, usedforsecurity=False).hexdigest()
    return hash == known_hash
```


## References
- [Python documentation: `hashlib` — Secure hashes and message digests](https://docs.python.org/3/library/hashlib.html)
- [Python documentation: `crypt` — Function to check Unix passwords](https://docs.python.org/3/library/crypt.html)
- [Python documentation: `FIPS` - FIPS compliant hashlib implementation](https://docs.python.org/3/library/hashlib.html#hashlib.algorithms_guaranteed)
- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)
- [Common Weakness Enumeration: CWE-328](https://cwe.mitre.org/data/definitions/328.html)
- [Common Weakness Enumeration: CWE-916](https://cwe.mitre.org/data/definitions/916.html)
## What it does
Checks for imports of the `telnetlib` module.

## Why is this bad?
Telnet is considered insecure. It is deprecated since version 3.11, and
was removed in version 3.13. Instead, use SSH or another encrypted
protocol.

## Example
```python
import telnetlib
```

## References
- [Python documentation: `telnetlib` - Telnet client](https://docs.python.org/3.12/library/telnetlib.html#module-telnetlib)
- [PEP 594: `telnetlib`](https://peps.python.org/pep-0594/#telnetlib)
## What it does
Checks for imports of the `ftplib` module.

## Why is this bad?
FTP is considered insecure. Instead, use SSH, SFTP, SCP, or another
encrypted protocol.

## Example
```python
import ftplib
```

## References
- [Python documentation: `ftplib` - FTP protocol client](https://docs.python.org/3/library/ftplib.html)
## What it does
Checks for imports of the `pickle`, `cPickle`, `dill`, and `shelve` modules.

## Why is this bad?
It is possible to construct malicious pickle data which will execute
arbitrary code during unpickling. Consider possible security implications
associated with these modules.

## Example
```python
import pickle
```

## References
- [Python documentation: `pickle` — Python object serialization](https://docs.python.org/3/library/pickle.html)
## What it does
Checks for imports of the `subprocess` module.

## Why is this bad?
It is possible to inject malicious commands into subprocess calls. Consider
possible security implications associated with this module.

## Example
```python
import subprocess
```
## What it does
Checks for imports of the `xml.etree.cElementTree` and `xml.etree.ElementTree` modules

## Why is this bad?
Using various methods from these modules to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is
called before parsing XML data.

## Example
```python
import xml.etree.cElementTree
```
## What it does
Checks for imports of the `xml.sax` module.

## Why is this bad?
Using various methods from these modules to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is
called before parsing XML data.

## Example
```python
import xml.sax
```
## What it does
Checks for imports of the `xml.dom.expatbuilder` module.

## Why is this bad?
Using various methods from these modules to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is
called before parsing XML data.

## Example
```python
import xml.dom.expatbuilder
```
## What it does
Checks for imports of the `xml.dom.minidom` module.

## Why is this bad?
Using various methods from these modules to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is
called before parsing XML data.

## Example
```python
import xml.dom.minidom
```
## What it does
Checks for imports of the `xml.dom.pulldom` module.

## Why is this bad?
Using various methods from these modules to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is
called before parsing XML data.

## Example
```python
import xml.dom.pulldom
```
## Removed
This rule was removed as the `lxml` library has been modified to address
known vulnerabilities and unsafe defaults. As such, the `defusedxml`
library is no longer necessary, `defusedxml` has [deprecated] its `lxml`
module.

```