# a7046c18:packages_plugin-sql_rust_Cargo.lock:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[[package]]
name = "serde_json"
version = "1.0.149"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "83fc039473c5595ace860d8c4fafa220ff474b3fc6bfdb4293327f1a37e94d86"
dependencies = [
 "itoa",
 "memchr",
 "serde",
 "serde_core",
 "zmij",
]

[[package]]
name = "sha1"
version = "0.10.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e3bf829a2d51ab4a5ddf1352d8470c140cadc8301b2ae1789db023f01cedd6ba"
dependencies = [
 "cfg-if",
 "cpufeatures",
 "digest",
]

[[package]]
name = "sha1_smol"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bbfa15b3dddfee50a0fff136974b3e1bde555604ba463834a7eb7deb6417705d"

[[package]]
name = "sha2"
version = "0.10.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a7507d819769d01a365ab707794a4084392c824f54a7a6a7862f8c3d0892b283"
dependencies = [
 "cfg-if",
 "cpufeatures",
 "digest",
]

[[package]]
name = "shlex"
version = "1.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0fda2ff0d084019ba4d7c6f371c95d8fd75ce3524c3cb8fb653a3023f6323e64"

[[package]]
name = "signal-hook-registry"
version = "1.4.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c4db69cba1110affc0e9f7bcd48bbf87b3f4fc7c61fc9155afd4c469eb3d6c1b"
dependencies = [
 "errno",
 "libc",
]

[[package]]
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
 "chrono",
 "crc",
 "crossbeam-queue",
 "either",
 "event-listener",
 "futures-channel",
 "futures-core",
 "futures-intrusive",
 "futures-io",
```