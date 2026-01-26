# a7046c18:packages_plugin-sql_rust_Cargo.lock:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
name = "diff"
version = "0.1.13"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "56254986775e3233ffa9c4d7d3faaf6d36a2c09d30b20687e9f88bc8bafc16c8"

[[package]]
name = "digest"
version = "0.10.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9ed9a281f7bc9b7576e61468ba615a66a5c8cfdff42420a70aa82701a3b1e292"
dependencies = [
 "block-buffer",
 "const-oid",
 "crypto-common",
 "subtle",
]

[[package]]
name = "displaydoc"
version = "0.2.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "97369cbbc041bc366949bc74d34658d6cda5621039731c6310521892a3a20ae0"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "dotenvy"
version = "0.15.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1aaf95b3e5c8f23aa320147307562d361db0ae0d51242340f558153b4eb2439b"

[[package]]
name = "either"
version = "1.15.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "48c757948c5ede0e46177b7add2e67155f70e33c07fea8284df6576da70b3719"
dependencies = [
 "serde",
]

[[package]]
name = "elizaos-core"
version = "2.0.0"
dependencies = [
 "anyhow",
 "async-trait",
 "console_error_panic_hook",
 "futures",
 "getrandom 0.2.16",
 "handlebars",
 "js-sys",
 "lazy_static",
 "regex",
 "serde",
 "serde_json",
 "sqlx",
 "thiserror 2.0.17",
 "tokio",
 "tracing",
 "uuid",
 "wasm-bindgen",
 "wasm-bindgen-futures",
 "web-sys",
]

[[package]]
name = "elizaos-plugin-sql"
version = "2.0.0"
dependencies = [
 "anyhow",
 "async-trait",
 "chrono",
 "console_error_panic_hook",
 "elizaos-core",
 "futures",
 "getrandom 0.2.16",
 "js-sys",
 "pretty_assertions",
 "serde",
 "serde_json",
 "sqlx",
 "thiserror 2.0.17",
 "tokio",
 "tracing",
 "uuid",
 "wasm-bindgen",
 "wasm-bindgen-futures",
 "web-sys",
]

[[package]]
name = "equivalent"
version = "1.0.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "877a4ace8713b0bcf2a4e7eec82529c029f1d0619886d18145fea96c3ffe5c0f"

[[package]]
name = "errno"
version = "0.3.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "39cab71617ae0d63f51a36d69f866391735b51691dbda63cf6f96d042b63efeb"
dependencies = [
 "libc",
 "windows-sys 0.61.2",
]

[[package]]
name = "etcetera"
version = "0.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "136d1b5283a1ab77bd9257427ffd09d8667ced0570b6f938942bc7568ed5b943"
dependencies = [
 "cfg-if",
 "home",
 "windows-sys 0.48.0",
]

[[package]]
name = "event-listener"
version = "2.5.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "0206175f82b8d6bf6652ff7d71a1e27fd2e4efde587fd368662814d6ec1d9ce0"

[[package]]
name = "fastrand"
version = "2.3.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "37909eebbb50d72f9059c3b6d82c0463f2ff062c9e95845c43a6c9c0355411be"

[[package]]
name = "find-msvc-tools"
version = "0.1.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f449e6c6c08c865631d4890cfacf252b3d396c9bcc83adb6623cdb02a8336c41"

[[package]]
name = "flume"
version = "0.11.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "da0e4dd2a88388a1f4ccc7c9ce104604dab68d9f408dc34cd45823d5a9069095"
dependencies = [
 "futures-core",
 "futures-sink",
 "spin",
]

[[package]]
```