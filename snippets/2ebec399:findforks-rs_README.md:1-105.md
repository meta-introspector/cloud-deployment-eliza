# 2ebec399:findforks-rs_README.md:1-105

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/README.md:1-105
**Novelty Score:** 47.51
**Concepts:** 

```
# findforks-rs

Rust implementation of findforks using octocrab for GitHub API access.

## Features

- ✅ Strong typing with Rust
- ✅ Async/await with tokio
- ✅ GitHub API v3 via octocrab
- ✅ Automatic pagination
- ✅ Rate limiting protection
- ✅ SSH and HTTPS URL parsing
- ✅ Error handling with anyhow
- ✅ CLI with clap

## Installation

```bash
cargo build --release
```

## Usage

```bash
# Use default remote (origin) with gh CLI token
./target/release/findforks

# Specify a different remote
./target/release/findforks --remote upstream

# Token priority (in order):
# 1. --token flag
# 2. gh auth token (from gh CLI)
# 3. GITHUB_TOKEN environment variable

# Setup gh CLI authentication
gh auth login

# Or use environment variable
export GITHUB_TOKEN=your_token_here
./target/release/findforks

# Or pass token directly
./target/release/findforks --token your_token_here
```

## Comparison with Python Version

| Feature | Python | Rust |
|---------|--------|------|
| Type Safety | ❌ | ✅ |
| Async | ❌ | ✅ |
| Error Handling | Basic | Comprehensive |
| Rate Limiting | Manual sleep | Built-in |
| Pagination | Manual | Automatic |
| Performance | Slower | Faster |
| Dependencies | urllib | octocrab |

## API

### Types

```rust
struct RepoInfo {
    username: String,
    project: String,
}

struct Fork {
    owner: Owner,
    ssh_url: String,
    clone_url: String,
}
```

### Functions

- `parse_git_remote_url(url: &str) -> Result<RepoInfo>` - Parse git remote URL
- `get_remote_url(remote: &str) -> Result<String>` - Get URL from git remote
- `find_forks(octocrab, username, project) -> Result<Vec<(String, String)>>` - Find all forks
- `setup_remote(remote, url) -> Result<()>` - Add git remote

## Testing

```bash
cargo test
```

## Example

```bash
$ cd /path/to/repo
$ findforks-rs --remote origin
Repository URL: https://github.com/elizaos/eliza.git
Finding forks for elizaos/eliza
Found 3024 forks
user1: git@github.com:user1/eliza.git
user2: git@github.com:user2/eliza.git
...
Done! Added 3024 remotes
```

## License

MIT
```