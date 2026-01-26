# 2ebec399:findforks-rs_src_main.rs:151-257

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/src/main.rs:151-257
**Novelty Score:** 47.51
**Concepts:** 

```

    Ok(forks)
}

fn setup_remote(remote: &str, repository_url: &str) -> Result<()> {
    println!("{}: {}", remote, repository_url);
    
    let output = Command::new("git")
        .args(["remote", "add", remote, repository_url])
        .output()
        .context("Failed to add git remote")?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        if !stderr.contains("already exists") {
            eprintln!("Warning: {}", stderr);
        }
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    // Get the remote URL
    let repo_url = get_remote_url(&args.remote)
        .context("Failed to get remote URL")?;

    println!("Repository URL: {}", repo_url);

    // Parse the URL
    let repo_info = parse_git_remote_url(&repo_url)
        .context("Failed to parse repository URL")?;

    println!("Finding forks for {}/{}", repo_info.username, repo_info.project);

    // Get GitHub token (try gh CLI first, then env var, then CLI arg)
    let token = args.token
        .or_else(get_github_token);

    if token.is_some() {
        println!("Using authenticated GitHub API");
    } else {
        println!("Warning: No GitHub token found. Rate limits will be lower.");
        println!("Tip: Run 'gh auth login' or set GITHUB_TOKEN environment variable");
    }

    // Initialize octocrab
    let octocrab = if let Some(token) = token {
        Octocrab::builder()
            .personal_token(token)
            .build()?
    } else {
        Octocrab::builder().build()?
    };

    // Find all forks
    let forks = find_forks(&octocrab, &repo_info.username, &repo_info.project)
        .await
        .context("Failed to find forks")?;

    println!("Found {} forks", forks.len());

    let fork_count = forks.len();

    // Add each fork as a remote
    for (remote_name, repository_url) in forks {
        if let Err(e) = setup_remote(&remote_name, &repository_url) {
            eprintln!("Failed to add remote {}: {}", remote_name, e);
        }
    }

    println!("Done! Added {} remotes", fork_count);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_ssh_url() {
        let url = "git@github.com:elizaos/eliza.git";
        let info = parse_git_remote_url(url).unwrap();
        assert_eq!(info.username, "elizaos");
        assert_eq!(info.project, "eliza");
    }

    #[test]
    fn test_parse_https_url() {
        let url = "https://github.com/elizaos/eliza.git";
        let info = parse_git_remote_url(url).unwrap();
        assert_eq!(info.username, "elizaos");
        assert_eq!(info.project, "eliza");
    }

    #[test]
    fn test_parse_https_url_no_git() {
        let url = "https://github.com/elizaos/eliza";
        let info = parse_git_remote_url(url).unwrap();
        assert_eq!(info.username, "elizaos");
        assert_eq!(info.project, "eliza");
    }
}
```