# a7046c18:packages_core_rust_Cargo.lock:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
name = "signature"
version = "2.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "77549399552de45a898a580c1b41d445bf730df867cc44e6c0233bbc4b8329de"
dependencies = [
 "digest",
 "rand_core",
]

[[package]]
name = "slab"
version = "0.4.11"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7a2ae44ef20feb57a68b23d846850f861394c2e02dc425a50098ae8c90267589"

[[package]]
name = "smallvec"
version = "1.15.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "67b1b7a3b5fe4f1376887184045fcf45c69e92af734b7aaddc05fb777b6fbd03"

[[package]]
name = "socket2"
version = "0.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "17129e116933cf371d018bb80ae557e889637989d8638274fb25622827b03881"
dependencies = [
 "libc",
 "windows-sys 0.60.2",
]

[[package]]
name = "spin"
version = "0.9.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6980e8d7511241f8acf4aebddbb1ff938df5eebe98691418c4468d0b72a96a67"
dependencies = [
 "lock_api",
]

[[package]]
name = "spki"
version = "0.7.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d91ed6c858b01f942cd56b37a94b3e0a1798290327d1236e4d9cf4eaca44d29d"
dependencies = [
 "base64ct",
 "der",
]

[[package]]
name = "sqlformat"
version = "0.2.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7bba3a93db0cc4f7bdece8bb09e77e2e785c20bfebf79eb8340ed80708048790"
dependencies = [
 "nom",
 "unicode_categories",
]

[[package]]
name = "sqlx"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c9a2ccff1a000a5a59cd33da541d9f2fdcd9e6e8229cc200565942bff36d0aaa"
dependencies = [
 "sqlx-core",
 "sqlx-macros",
 "sqlx-mysql",
 "sqlx-postgres",
 "sqlx-sqlite",
]

[[package]]
name = "sqlx-core"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "24ba59a9342a3d9bab6c56c118be528b27c9b60e490080e9711a04dccac83ef6"
dependencies = [
 "ahash",
 "atoi",
 "byteorder",
 "bytes",
 "crc",
 "crossbeam-queue",
 "either",
 "event-listener",
 "futures-channel",
 "futures-core",
 "futures-intrusive",
 "futures-io",
 "futures-util",
 "hashlink",
 "hex",
 "indexmap",
 "log",
 "memchr",
 "once_cell",
 "paste",
 "percent-encoding",
 "serde",
 "serde_json",
 "sha2",
 "smallvec",
 "sqlformat",
 "thiserror 1.0.69",
 "tokio",
 "tokio-stream",
 "tracing",
 "url",
]

[[package]]
name = "sqlx-macros"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4ea40e2345eb2faa9e1e5e326db8c34711317d2b5e08d0d5741619048a803127"
dependencies = [
 "proc-macro2",
 "quote",
 "sqlx-core",
 "sqlx-macros-core",
 "syn 1.0.109",
]

[[package]]
name = "sqlx-macros-core"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5833ef53aaa16d860e92123292f1f6a3d53c34ba8b1969f152ef1a7bb803f3c8"
dependencies = [
 "dotenvy",
 "either",
 "heck",
 "hex",
 "once_cell",
 "proc-macro2",
 "quote",
 "serde",
 "serde_json",
 "sha2",
 "sqlx-core",
 "sqlx-mysql",
 "sqlx-postgres",
 "sqlx-sqlite",
 "syn 1.0.109",
 "tempfile",
 "tokio",
 "url",
]
```