# 2ebec399:findforks-rs_Cargo.lock:1051-1200

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:1051-1200
**Novelty Score:** 47.51
**Concepts:** 

```
[[package]]
name = "serde"
version = "1.0.228"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9a8e94ea7f378bd32cbbd37198a4a91436180c5bb472411e48b5ec2e2124ae9e"
dependencies = [
 "serde_core",
 "serde_derive",
]

[[package]]
name = "serde_core"
version = "1.0.228"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "41d385c7d4ca58e59fc732af25c3983b67ac852c1a25000afe1175de458b67ad"
dependencies = [
 "serde_derive",
]

[[package]]
name = "serde_derive"
version = "1.0.228"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d540f220d3187173da220f885ab66608367b6574e925011a9353e4badda91d79"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

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
name = "serde_path_to_error"
version = "0.1.20"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "10a9ff822e371bb5403e391ecd83e182e0e77ba7f6fe0160b795797109d1b457"
dependencies = [
 "itoa",
 "serde",
 "serde_core",
]

[[package]]
name = "serde_urlencoded"
version = "0.7.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d3491c14715ca2294c4d6a88f15e84739788c1d030eed8c110436aafdaa2f3fd"
dependencies = [
 "form_urlencoded",
 "itoa",
 "ryu",
 "serde",
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
name = "simple_asn1"
version = "0.6.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "297f631f50729c8c99b84667867963997ec0b50f32b2a7dbcab828ef0541e8bb"
dependencies = [
 "num-bigint",
 "num-traits",
 "thiserror",
 "time",
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
name = "snafu"
version = "0.8.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6e84b3f4eacbf3a1ce05eac6763b4d629d60cbc94d632e4092c54ade71f1e1a2"
dependencies = [
 "snafu-derive",
]

[[package]]
name = "snafu-derive"
version = "0.8.9"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c1c97747dbf44bb1ca44a561ece23508e99cb592e862f22222dcf42f51d1e451"
dependencies = [
 "heck",
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "socket2"
version = "0.6.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "86f4aa3ad99f2088c990dfa82d367e19cb29268ed67c574d10d0a4bfe71f07e0"
dependencies = [
 "libc",
 "windows-sys 0.60.2",
]

[[package]]
name = "stable_deref_trait"
version = "1.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6ce2be8dc25455e1f91df71bfa12ad37d7af1092ae736f3a6cd0e37bc7810596"

[[package]]
name = "strsim"
version = "0.11.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7da8b5736845d9f2fcb837ea5d9e2628564b3b043a70948a3f0b778838c5fb4f"

[[package]]
```