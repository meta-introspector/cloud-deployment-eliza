use anyhow::{Context, Result};
use clap::Parser;
use octocrab::Octocrab;
use serde::{Deserialize, Serialize};
use std::process::Command;
use url::Url;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Fork {
    owner: Owner,
    ssh_url: String,
    clone_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Owner {
    login: String,
}

#[derive(Debug)]
struct RepoInfo {
    username: String,
    project: String,
}

#[derive(Parser, Debug)]
#[command(author, version, about = "Find and add all forks of a GitHub repository as git remotes")]
struct Args {
    /// Which remote to use
    #[arg(short, long, default_value = "origin")]
    remote: String,

    /// GitHub token (optional, for higher rate limits)
    #[arg(short, long)]
    token: Option<String>,
}

fn parse_git_remote_url(repo_url: &str) -> Result<RepoInfo> {
    let repo_url = repo_url.trim();

    // Handle git@github.com:username/project.git
    if repo_url.starts_with("git@github.com") {
        let parts: Vec<&str> = repo_url.split(':').collect();
        if parts.len() != 2 {
            anyhow::bail!("Invalid SSH URL format");
        }
        
        let repo_parts: Vec<&str> = parts[1].split('/').collect();
        if repo_parts.len() != 2 {
            anyhow::bail!("Invalid repository path");
        }

        let username = repo_parts[0].to_string();
        let project = repo_parts[1]
            .trim_end_matches(".git")
            .to_string();

        return Ok(RepoInfo { username, project });
    }

    // Handle https://github.com/username/project.git
    if repo_url.starts_with("http") {
        let url = Url::parse(repo_url)?;
        let path_segments: Vec<&str> = url
            .path_segments()
            .context("Invalid URL path")?
            .collect();

        if path_segments.len() < 2 {
            anyhow::bail!("Invalid repository URL path");
        }

        let username = path_segments[0].to_string();
        let project = path_segments[1]
            .trim_end_matches(".git")
            .to_string();

        return Ok(RepoInfo { username, project });
    }

    anyhow::bail!("Unsupported URL format: {}", repo_url)
}

fn get_github_token() -> Option<String> {
    // Try gh CLI token first
    if let Ok(output) = Command::new("gh")
        .args(["auth", "token"])
        .output()
    {
        if output.status.success() {
            let token = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !token.is_empty() {
                return Some(token);
            }
        }
    }

    // Fall back to GITHUB_TOKEN env var
    env::var("GITHUB_TOKEN").ok()
}

fn get_remote_url(remote: &str) -> Result<String> {
    let output = Command::new("git")
        .args(["remote", "get-url", remote])
        .output()
        .context("Failed to execute git command")?;

    if !output.status.success() {
        anyhow::bail!("Git command failed: {}", String::from_utf8_lossy(&output.stderr));
    }

    Ok(String::from_utf8(output.stdout)?.trim().to_string())
}

async fn find_forks(octocrab: &Octocrab, username: &str, project: &str) -> Result<Vec<(String, String)>> {
    let mut forks = Vec::new();
    let mut page = 1u32;

    loop {
        let response = octocrab
            .repos(username, project)
            .list_forks()
            .per_page(100)
            .page(page)
            .send()
            .await?;

        if response.items.is_empty() {
            break;
        }

        for fork in response.items {
            let owner_login = fork.owner.as_ref()
                .map(|o| o.login.clone())
                .unwrap_or_default();
            let ssh_url = fork.ssh_url
                .map(|u| u.to_string())
                .unwrap_or_default();

            if !owner_login.is_empty() && !ssh_url.is_empty() {
                forks.push((owner_login, ssh_url));
            }
        }

        page += 1;
        
        // Rate limiting: sleep between requests
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    }

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
