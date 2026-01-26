# a7046c18:packages_core_rust_Cargo.lock:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
version = "1.0.17"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "92ecc6618181def0457392ccd0ee51198e065e016d1d527a7ac1b6dc7c1f09d2"

[[package]]
name = "js-sys"
version = "0.3.83"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "464a3709c7f55f1f721e5389aa6ea4e3bc6aba669353300af094b29ffbdde1d8"
dependencies = [
 "once_cell",
 "wasm-bindgen",
]

[[package]]
name = "lazy_static"
version = "1.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bbd2bcb4c963f2ddae06a2efc7e9f3591312473c50c6685e1f298068316e66fe"
dependencies = [
 "spin",
]

[[package]]
name = "libc"
version = "0.2.180"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bcc35a38544a891a5f7c865aca548a982ccb3b8650a5b06d0fd33a10283c56fc"

[[package]]
name = "libm"
version = "0.2.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f9fbbcab51052fe104eb5e5d351cf728d30a5be1fe14d9be8a3b097481fb97de"

[[package]]
name = "libredox"
version = "0.1.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3d0b95e02c851351f877147b7deea7b1afb1df71b63aa5f8270716e0c5720616"
dependencies = [
 "bitflags",
 "libc",
 "redox_syscall 0.7.0",
]

[[package]]
name = "libsqlite3-sys"
version = "0.27.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cf4e226dcd58b4be396f7bd3c20da8fdee2911400705297ba7d2d7cc2c30f716"
dependencies = [
 "cc",
 "pkg-config",
 "vcpkg",
]

[[package]]
name = "linux-raw-sys"
version = "0.11.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "df1d3c3b53da64cf5760482273a98e575c651a67eec7f77df96b5b642de8f039"

[[package]]
name = "litemap"
version = "0.8.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6373607a59f0be73a39b6fe456b8192fcc3585f602af20751600e974dd455e77"

[[package]]
name = "lock_api"
version = "0.4.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "224399e74b87b5f3557511d98dff8b14089b3dadafcab6bb93eab67d3aace965"
dependencies = [
 "scopeguard",
]

[[package]]
name = "log"
version = "0.4.29"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5e5032e24019045c762d3c0f28f5b6b8bbf38563a65908389bf7978758920897"

[[package]]
name = "md-5"
version = "0.10.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d89e7ee0cfbedfc4da3340218492196241d89eefb6dab27de5df917a6d2e78cf"
dependencies = [
 "cfg-if",
 "digest",
]

[[package]]
name = "memchr"
version = "2.7.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f52b00d39961fc5b2736ea853c9cc86238e165017a493d1d5c8eac6bdc4cc273"

[[package]]
name = "minimal-lexical"
version = "0.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "68354c5c6bd36d73ff3feceb05efa59b6acb7626617f4962be322a825e61f79a"

[[package]]
name = "mio"
version = "1.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a69bcab0ad47271a0234d9422b131806bf3968021e5dc9328caf2d4cd58557fc"
dependencies = [
 "libc",
 "wasi",
 "windows-sys 0.61.2",
]

[[package]]
name = "nom"
version = "7.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d273983c5a657a70a3e8f2a01329822f3b8c8172b73826411a55751e404a0a4a"
dependencies = [
 "memchr",
 "minimal-lexical",
]

[[package]]
name = "nu-ansi-term"
version = "0.50.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7957b9740744892f114936ab4a57b3f487491bbeafaf8083688b16841a4240e5"
dependencies = [
 "windows-sys 0.61.2",
]

[[package]]
name = "num-bigint-dig"
version = "0.8.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e661dda6640fad38e827a6d4a310ff4763082116fe217f279885c97f511bb0b7"
dependencies = [
 "lazy_static",
 "libm",
 "num-integer",
 "num-iter",
 "num-traits",
 "rand",
 "smallvec",
 "zeroize",
```