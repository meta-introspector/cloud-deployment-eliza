# a7046c18:packages_core_rust_Cargo.lock:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
]

[[package]]
name = "num-integer"
version = "0.1.46"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7969661fd2958a5cb096e56c8e1ad0444ac2bbcd0061bd28660485a44879858f"
dependencies = [
 "num-traits",
]

[[package]]
name = "num-iter"
version = "0.1.45"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1429034a0490724d0075ebb2bc9e875d6503c3cf69e235a8941aa757d83ef5bf"
dependencies = [
 "autocfg",
 "num-integer",
 "num-traits",
]

[[package]]
name = "num-modular"
version = "0.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "17bb261bf36fa7d83f4c294f834e91256769097b3cb505d44831e0a179ac647f"

[[package]]
name = "num-order"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "537b596b97c40fcf8056d153049eb22f481c17ebce72a513ec9286e4986d1bb6"
dependencies = [
 "num-modular",
]

[[package]]
name = "num-traits"
version = "0.2.19"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "071dfc062690e90b734c0b2273ce72ad0ffa95f0c74596bc250dcfd960262841"
dependencies = [
 "autocfg",
 "libm",
]

[[package]]
name = "once_cell"
version = "1.21.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "42f5e15c9953c5e4ccceeb2e7382a716482c34515315f7b03532b8b4e8393d2d"

[[package]]
name = "parking_lot"
version = "0.12.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "93857453250e3077bd71ff98b6a65ea6621a19bb0f559a85248955ac12c45a1a"
dependencies = [
 "lock_api",
 "parking_lot_core",
]

[[package]]
name = "parking_lot_core"
version = "0.9.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2621685985a2ebf1c516881c026032ac7deafcda1a2c9b7850dc81e3dfcb64c1"
dependencies = [
 "cfg-if",
 "libc",
 "redox_syscall 0.5.18",
 "smallvec",
 "windows-link",
]

[[package]]
name = "paste"
version = "1.0.15"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "57c0d7b74b563b49d38dae00a0c37d4d6de9b432382b2892f0574ddcae73fd0a"

[[package]]
name = "pem-rfc7468"
version = "0.7.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "88b39c9bfcfc231068454382784bb460aae594343fb030d46e9f50a645418412"
dependencies = [
 "base64ct",
]

[[package]]
name = "percent-encoding"
version = "2.3.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9b4f627cb1b25917193a259e49bdad08f671f8d9708acfd5fe0a8c1455d87220"

[[package]]
name = "pest"
version = "2.8.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2c9eb05c21a464ea704b53158d358a31e6425db2f63a1a7312268b05fe2b75f7"
dependencies = [
 "memchr",
 "ucd-trie",
]

[[package]]
name = "pest_derive"
version = "2.8.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "68f9dbced329c441fa79d80472764b1a2c7e57123553b8519b36663a2fb234ed"
dependencies = [
 "pest",
 "pest_generator",
]

[[package]]
name = "pest_generator"
version = "2.8.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3bb96d5051a78f44f43c8f712d8e810adb0ebf923fc9ed2655a7f66f63ba8ee5"
dependencies = [
 "pest",
 "pest_meta",
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "pest_meta"
version = "2.8.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "602113b5b5e8621770cfd490cfd90b9f84ab29bd2b0e49ad83eb6d186cef2365"
dependencies = [
 "pest",
 "sha2",
]

[[package]]
name = "pin-project-lite"
version = "0.2.16"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3b3cff922bd51709b605d9ead9aa71031d81447142d828eb4a6eba76fe619f9b"

[[package]]
name = "pin-utils"
version = "0.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
```