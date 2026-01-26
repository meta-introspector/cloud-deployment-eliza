# a7046c18:packages_core_rust_Cargo.lock:1951-2100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:1951-2100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
name = "version_check"
version = "0.9.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0b928f33d975fc6ad9f86c8f283853ad26bdd5b10b7f1542aa2fa15e2289105a"

[[package]]
name = "wasi"
version = "0.11.1+wasi-snapshot-preview1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ccf3ec651a847eb01de73ccad15eb7d99f80485de043efb2f370cd654f4ea44b"

[[package]]
name = "wasip2"
version = "1.0.1+wasi-0.2.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0562428422c63773dad2c345a1882263bbf4d65cf3f42e90921f787ef5ad58e7"
dependencies = [
 "wit-bindgen",
]

[[package]]
name = "wasite"
version = "0.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b8dad83b4f25e74f184f64c43b150b91efe7647395b42289f38e50566d82855b"

[[package]]
name = "wasm-bindgen"
version = "0.2.106"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0d759f433fa64a2d763d1340820e46e111a7a5ab75f993d1852d70b03dbb80fd"
dependencies = [
 "cfg-if",
 "once_cell",
 "rustversion",
 "wasm-bindgen-macro",
 "wasm-bindgen-shared",
]

[[package]]
name = "wasm-bindgen-futures"
version = "0.4.56"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "836d9622d604feee9e5de25ac10e3ea5f2d65b41eac0d9ce72eb5deae707ce7c"
dependencies = [
 "cfg-if",
 "js-sys",
 "once_cell",
 "wasm-bindgen",
 "web-sys",
]

[[package]]
name = "wasm-bindgen-macro"
version = "0.2.106"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "48cb0d2638f8baedbc542ed444afc0644a29166f1595371af4fecf8ce1e7eeb3"
dependencies = [
 "quote",
 "wasm-bindgen-macro-support",
]

[[package]]
name = "wasm-bindgen-macro-support"
version = "0.2.106"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cefb59d5cd5f92d9dcf80e4683949f15ca4b511f4ac0a6e14d4e1ac60c6ecd40"
dependencies = [
 "bumpalo",
 "proc-macro2",
 "quote",
 "syn 2.0.114",
 "wasm-bindgen-shared",
]

[[package]]
name = "wasm-bindgen-shared"
version = "0.2.106"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cbc538057e648b67f72a982e708d485b2efa771e1ac05fec311f9f63e5800db4"
dependencies = [
 "unicode-ident",
]

[[package]]
name = "web-sys"
version = "0.3.83"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9b32828d774c412041098d182a8b38b16ea816958e07cf40eec2bc080ae137ac"
dependencies = [
 "js-sys",
 "wasm-bindgen",
]

[[package]]
name = "whoami"
version = "1.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5d4a4db5077702ca3015d3d02d74974948aba2ad9e12ab7df718ee64ccd7e97d"
dependencies = [
 "libredox",
 "wasite",
]

[[package]]
name = "windows-link"
version = "0.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f0805222e57f7521d6a62e36fa9163bc891acd422f971defe97d64e70d0a4fe5"

[[package]]
name = "windows-sys"
version = "0.48.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "677d2418bec65e3338edb076e806bc1ec15693c5d0104683f2efe857f61056a9"
dependencies = [
 "windows-targets 0.48.5",
]

[[package]]
name = "windows-sys"
version = "0.60.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f2f500e4d28234f72040990ec9d39e3a6b950f9f22d3dba18416c35882612bcb"
dependencies = [
 "windows-targets 0.53.5",
]

[[package]]
name = "windows-sys"
version = "0.61.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ae137229bcbd6cdf0f7b80a31df61766145077ddf49416a728b02cb3921ff3fc"
dependencies = [
 "windows-link",
]

[[package]]
name = "windows-targets"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9a2fa6e2155d7247be68c096456083145c183cbbbc2764150dda45a87197940c"
dependencies = [
 "windows_aarch64_gnullvm 0.48.5",
 "windows_aarch64_msvc 0.48.5",
 "windows_i686_gnu 0.48.5",
 "windows_i686_msvc 0.48.5",
 "windows_x86_64_gnu 0.48.5",
 "windows_x86_64_gnullvm 0.48.5",
 "windows_x86_64_msvc 0.48.5",
```