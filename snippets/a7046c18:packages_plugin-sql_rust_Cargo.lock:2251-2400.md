# a7046c18:packages_plugin-sql_rust_Cargo.lock:2251-2400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:2251-2400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

[[package]]
name = "windows_x86_64_gnu"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "53d40abd2583d23e4718fddf1ebec84dbff8381c07cae67ff7768bbf19c6718e"

[[package]]
name = "windows_x86_64_gnu"
version = "0.53.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9c3842cdd74a865a8066ab39c8a7a473c0778a3f29370b5fd6b4b9aa7df4a499"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0b7b52767868a23d5bab768e390dc5f5c55825b6d30b86c844ff2dc7414044cc"

[[package]]
name = "windows_x86_64_gnullvm"
version = "0.53.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0ffa179e2d07eee8ad8f57493436566c7cc30ac536a3379fdf008f47f6bb7ae1"

[[package]]
name = "windows_x86_64_msvc"
version = "0.48.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ed94fce61571a4006852b7389a063ab983c02eb1bb37b47f8272ce92d06d9538"

[[package]]
name = "windows_x86_64_msvc"
version = "0.53.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d6bbff5f0aada427a1e5a6da5f1f98158182f26556f345ac9e04d36d0ebed650"

[[package]]
name = "wit-bindgen"
version = "0.46.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f17a85883d4e6d00e8a97c586de764dabcc06133f7f1d55dce5cdc070ad7fe59"

[[package]]
name = "writeable"
version = "0.6.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9edde0db4769d2dc68579893f2306b26c6ecfbe0ef499b013d731b7b9247e0b9"

[[package]]
name = "yansi"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cfe53a6657fd280eaa890a3bc59152892ffa3e30101319d168b781ed6529b049"

[[package]]
name = "yoke"
version = "0.8.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72d6e5c6afb84d73944e5cedb052c4680d5657337201555f9f2a16b7406d4954"
dependencies = [
 "stable_deref_trait",
 "yoke-derive",
 "zerofrom",
]

[[package]]
name = "yoke-derive"
version = "0.8.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b659052874eb698efe5b9e8cf382204678a0086ebf46982b79d6ca3182927e5d"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
 "synstructure",
]

[[package]]
name = "zerocopy"
version = "0.8.33"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "668f5168d10b9ee831de31933dc111a459c97ec93225beb307aed970d1372dfd"
dependencies = [
 "zerocopy-derive",
]

[[package]]
name = "zerocopy-derive"
version = "0.8.33"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2c7962b26b0a8685668b671ee4b54d007a67d4eaf05fda79ac0ecf41e32270f1"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "zerofrom"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "50cc42e0333e05660c3587f3bf9d0478688e15d870fab3346451ce7f8c9fbea5"
dependencies = [
 "zerofrom-derive",
]

[[package]]
name = "zerofrom-derive"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d71e5d6e06ab090c67b5e44993ec16b72dcbaabc526db883a360057678b48502"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
 "synstructure",
]

[[package]]
name = "zeroize"
version = "1.8.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b97154e67e32c85465826e8bcc1c59429aaaf107c1e4a9e53c8d8ccd5eff88d0"

[[package]]
name = "zerotrie"
version = "0.2.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2a59c17a5562d507e4b54960e8569ebee33bee890c70aa3fe7b97e85a9fd7851"
dependencies = [
 "displaydoc",
 "yoke",
 "zerofrom",
]

[[package]]
name = "zerovec"
version = "0.11.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c28719294829477f525be0186d13efa9a3c602f7ec202ca9e353d310fb9a002"
dependencies = [
 "yoke",
 "zerofrom",
 "zerovec-derive",
]

[[package]]
name = "zerovec-derive"
version = "0.11.2"
```