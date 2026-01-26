# a7046c18:packages_core_python_.venv_bin_ruff:20251-20400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20251-20400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## References
- [Common Weakness Enumeration: CWE-319](https://cwe.mitre.org/data/definitions/319.html)
## What it does
Checks for `paramiko` calls.

## Why is this bad?
`paramiko` calls allow users to execute arbitrary shell commands on a
remote machine. If the inputs to these calls are not properly sanitized,
they can be vulnerable to shell injection attacks.

## Example
```python
import paramiko

client = paramiko.SSHClient()
client.exec_command("echo $HOME")
```

## References
- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- [Paramiko documentation: `SSHClient.exec_command()`](https://docs.paramiko.org/en/stable/api/client.html#paramiko.client.SSHClient.exec_command)
## What it does
Check for method calls that initiate a subprocess with a shell.

## Why is this bad?
Starting a subprocess with a shell can allow attackers to execute arbitrary
shell commands. Consider starting the process without a shell call and
sanitize the input to mitigate the risk of shell injection.

## Example
```python
import subprocess

subprocess.run("ls -l", shell=True)
```

Use instead:
```python
import subprocess

subprocess.run(["ls", "-l"])
```

## References
- [Python documentation: `subprocess` — Subprocess management](https://docs.python.org/3/library/subprocess.html)
- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)
## What it does
Check for method calls that initiate a subprocess without a shell.

## Why is this bad?
Starting a subprocess without a shell can prevent attackers from executing
arbitrary shell commands; however, it is still error-prone. Consider
validating the input.

## Known problems
Prone to false positives as it is difficult to determine whether the
passed arguments have been validated ([#4045]).

## Example
```python
import subprocess

cmd = input("Enter a command: ").split()
subprocess.run(cmd)
```

## References
- [Python documentation: `subprocess` — Subprocess management](https://docs.python.org/3/library/subprocess.html)

[#4045]: https://github.com/astral-sh/ruff/issues/4045
## What it does
Checks for method calls that set the `shell` parameter to `true` or another
truthy value when invoking a subprocess.

## Why is this bad?
Setting the `shell` parameter to `true` or another truthy value when
invoking a subprocess can introduce security vulnerabilities, as it allows
shell metacharacters and whitespace to be passed to child processes,
potentially leading to shell injection attacks.

It is recommended to avoid using `shell=True` unless absolutely necessary
and, when used, to ensure that all inputs are properly sanitized and quoted
to prevent such vulnerabilities.

## Known problems
Prone to false positives as it is triggered on any function call with a
`shell=True` parameter.

## Example
```python
import my_custom_subprocess

user_input = input("Enter a command: ")
my_custom_subprocess.run(user_input, shell=True)
```

## References
- [Python documentation: Security Considerations](https://docs.python.org/3/library/subprocess.html#security-considerations)
## What it does
Checks for calls that start a process with a shell, providing guidance on
whether the usage is safe or not.

## Why is this bad?
Starting a process with a shell can introduce security risks, such as
code injection vulnerabilities. It's important to be aware of whether the
usage of the shell is safe or not.

This rule triggers on functions like `os.system`, `popen`, etc., which
start processes with a shell. It evaluates whether the provided command
is a literal string or an expression. If the command is a literal string,
it's considered safe. If the command is an expression, it's considered
(potentially) unsafe.

## Example
```python
import os

# Safe usage (literal string)
command = "ls -l"
os.system(command)

# Potentially unsafe usage (expression)
cmd = get_user_input()
os.system(cmd)
```

## Note
The `subprocess` module provides more powerful facilities for spawning new
processes and retrieving their results, and using that module is preferable
to using `os.system` or similar functions. Consider replacing such usages
with `subprocess.call` or related functions.

## References
- [Python documentation: `subprocess`](https://docs.python.org/3/library/subprocess.html)
## What it does
Checks for functions that start a process without a shell.

## Why is this bad?
Invoking any kind of external executable via a function call can pose
security risks if arbitrary variables are passed to the executable, or if
the input is otherwise unsanitised or unvalidated.

This rule specifically flags functions in the `os` module that spawn
subprocesses *without* the use of a shell. Note that these typically pose a
much smaller security risk than subprocesses that are started *with* a
shell, which are flagged by [`start-process-with-a-shell`][S605] (`S605`).
This gives you the option of enabling one rule while disabling the other
if you decide that the security risk from these functions is acceptable
for your use case.
```