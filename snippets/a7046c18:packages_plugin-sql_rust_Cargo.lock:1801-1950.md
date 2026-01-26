# a7046c18:packages_plugin-sql_rust_Cargo.lock:1801-1950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:1801-1950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
dependencies = [
 "tinyvec_macros",
]

[[package]]
name = "tinyvec_macros"
version = "0.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1f3ccbac311fea05f86f61904b462b55fb3df8837a366dfc601a0161d0532f20"

[[package]]
name = "tokio"
version = "1.49.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72a2903cd7736441aac9df9d7688bd0ce48edccaadf181c3b90be801e81d3d86"
dependencies = [
 "bytes",
 "libc",
 "mio",
 "parking_lot",
 "pin-project-lite",
 "signal-hook-registry",
 "socket2",
 "tokio-macros",
 "windows-sys 0.61.2",
]

[[package]]
name = "tokio-macros"
version = "2.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "af407857209536a95c8e56f8231ef2c2e2aff839b22e07a1ffcbc617e9db9fa5"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "tokio-stream"
version = "0.1.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "32da49809aab5c3bc678af03902d4ccddea2a87d028d86392a4b1560c6906c70"
dependencies = [
 "futures-core",
 "pin-project-lite",
 "tokio",
]

[[package]]
name = "tracing"
version = "0.1.44"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "63e71662fa4b2a2c3a26f570f037eb95bb1f85397f3cd8076caed2f026a6d100"
dependencies = [
 "log",
 "pin-project-lite",
 "tracing-attributes",
 "tracing-core",
]

[[package]]
name = "tracing-attributes"
version = "0.1.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7490cfa5ec963746568740651ac6781f701c9c5ea257c58e057f3ba8cf69e8da"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "tracing-core"
version = "0.1.36"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "db97caf9d906fbde555dd62fa95ddba9eecfd14cb388e4f491a66d74cd5fb79a"
dependencies = [
 "once_cell",
]

[[package]]
name = "typenum"
version = "1.19.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "562d481066bde0658276a35467c4af00bdc6ee726305698a55b86e61d7ad82bb"

[[package]]
name = "ucd-trie"
version = "0.1.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2896d95c02a80c6d6a5d6e953d479f5ddf2dfdb6a244441010e373ac0fb88971"

[[package]]
name = "unicode-bidi"
version = "0.3.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5c1cb5db39152898a79168971543b1cb5020dff7fe43c8dc468b0885f5e29df5"

[[package]]
name = "unicode-ident"
version = "1.0.22"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9312f7c4f6ff9069b165498234ce8be658059c6728633667c526e27dc2cf1df5"

[[package]]
name = "unicode-normalization"
version = "0.1.25"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5fd4f6878c9cb28d874b009da9e8d183b5abc80117c40bbd187a1fde336be6e8"
dependencies = [
 "tinyvec",
]

[[package]]
name = "unicode-properties"
version = "0.1.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7df058c713841ad818f1dc5d3fd88063241cc61f49f5fbea4b951e8cf5a8d71d"

[[package]]
name = "unicode-segmentation"
version = "1.12.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f6ccf251212114b54433ec949fd6a7841275f9ada20dddd2f29e9ceea4501493"

[[package]]
name = "unicode_categories"
version = "0.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "39ec24b3121d976906ece63c9daad25b85969647682eee313cb5779fdd69e14e"

[[package]]
name = "url"
version = "2.5.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ff67a8a4397373c3ef660812acab3268222035010ab8680ec4215f38ba3d0eed"
dependencies = [
 "form_urlencoded",
 "idna",
 "percent-encoding",
]

[[package]]
name = "urlencoding"
version = "2.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "daf8dba3b7eb870caf1ddeed7bc9d2a049f3cfdfae7cb521b087cc33ae4c49da"

[[package]]
```