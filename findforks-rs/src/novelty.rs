use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::process::Command;
use regex::Regex;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileChanges {
    pub files_added: usize,
    pub files_modified: usize,
    pub files_deleted: usize,
    pub lines_added: usize,
    pub lines_deleted: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitNovelty {
    pub commit_hash: String,
    pub author: String,
    pub date: String,
    pub message: String,
    pub novelty_score: f64,
    pub concepts: Vec<String>,
    pub file_changes: FileChanges,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NoveltyReport {
    pub total_commits: usize,
    pub novel_commits: Vec<CommitNovelty>,
    pub concept_frequency: HashMap<String, usize>,
}

pub struct NoveltyAnalyzer {
    seen_concepts: HashMap<String, usize>,
    concept_patterns: Vec<(Regex, String, f64)>,
}

impl NoveltyAnalyzer {
    pub fn new() -> Self {
        let patterns = vec![
            (r"\.rs$", "rust", 2.0),
            (r"\.py$", "python", 1.5),
            (r"\.go$", "go", 2.0),
            (r"\.ts$|\.tsx$", "typescript", 1.5),
            (r"async|await|tokio", "rust-async", 2.5),
            (r"tensorflow|pytorch|keras", "ml-framework", 3.0),
            (r"solidity|web3|blockchain", "blockchain", 2.5),
            (r"llm|gpt|claude|openai", "llm-integration", 3.0),
            (r"rag|retrieval|embedding", "rag-system", 3.5),
            (r"agent|autonomous", "agent-system", 3.0),
            (r"plugin|extension", "plugin-system", 2.5),
            (r"event|pubsub|message", "event-driven", 2.5),
            (r"postgres|postgresql", "postgres", 2.0),
            (r"sqlite|pglite", "embedded-db", 2.0),
            (r"docker|kubernetes", "containerization", 2.0),
            (r"terraform|cloudformation", "iac", 2.0),
            (r"react|vue|svelte", "frontend-framework", 1.5),
            (r"test|spec|jest", "testing", 1.0),
            (r"auth|jwt|oauth", "authentication", 2.0),
            (r"security|crypto|encrypt", "security", 2.0),
            (r"prompt|template", "prompt-engineering", 2.5),
            (r"cache|redis|memcache", "cache", 1.5),
            (r"microservice|grpc", "microservices", 2.0),
            (r"orchestrat|workflow", "orchestration", 2.5),
            (r"performance|optimize", "performance", 1.5),
            (r"documentation|readme", "documentation", 1.0),
        ];

        Self {
            seen_concepts: HashMap::new(),
            concept_patterns: patterns
                .into_iter()
                .map(|(p, n, w)| (Regex::new(p).unwrap(), n.to_string(), w))
                .collect(),
        }
    }

    pub fn analyze_branch(&mut self, branch: &str, limit: usize) -> Result<NoveltyReport> {
        let output = Command::new("git")
            .args(["log", branch, "--format=%H|%an|%ad|%s", &format!("-{}", limit)])
            .output()?;

        let commits_str = String::from_utf8_lossy(&output.stdout);
        let mut novel_commits = Vec::new();
        let mut concept_freq = HashMap::new();

        for line in commits_str.lines() {
            let parts: Vec<&str> = line.split('|').collect();
            if parts.len() < 4 {
                continue;
            }

            let hash = parts[0];
            let author = parts[1];
            let date = parts[2];
            let message = parts[3];

            let file_changes = self.get_file_changes(hash)?;
            let concepts = self.extract_concepts(hash)?;
            let score = self.calculate_novelty(&concepts, &file_changes);

            for concept in &concepts {
                *concept_freq.entry(concept.clone()).or_insert(0) += 1;
            }

            novel_commits.push(CommitNovelty {
                commit_hash: hash.to_string(),
                author: author.to_string(),
                date: date.to_string(),
                message: message.to_string(),
                novelty_score: score,
                concepts,
                file_changes,
            });
        }

        novel_commits.sort_by(|a, b| b.novelty_score.partial_cmp(&a.novelty_score).unwrap());

        Ok(NoveltyReport {
            total_commits: novel_commits.len(),
            novel_commits,
            concept_frequency: concept_freq,
        })
    }

    fn get_file_changes(&self, commit: &str) -> Result<FileChanges> {
        let output = Command::new("git")
            .args(["show", "--numstat", "--format=", commit])
            .output()?;

        let stats = String::from_utf8_lossy(&output.stdout);
        let mut added = 0;
        let mut modified = 0;
        let mut deleted = 0;
        let mut lines_added = 0;
        let mut lines_deleted = 0;

        for line in stats.lines() {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 3 {
                if parts[0] == "-" || parts[1] == "-" {
                    continue;
                }
                if let (Ok(add), Ok(del)) = (parts[0].parse::<usize>(), parts[1].parse::<usize>()) {
                    lines_added += add;
                    lines_deleted += del;
                    if add > 0 && del == 0 {
                        added += 1;
                    } else if add == 0 && del > 0 {
                        deleted += 1;
                    } else {
                        modified += 1;
                    }
                }
            }
        }

        Ok(FileChanges {
            files_added: added,
            files_modified: modified,
            files_deleted: deleted,
            lines_added,
            lines_deleted,
        })
    }

    fn extract_concepts(&mut self, commit: &str) -> Result<Vec<String>> {
        let output = Command::new("git")
            .args(["show", "--name-only", "--format=", commit])
            .output()?;

        let files = String::from_utf8_lossy(&output.stdout);
        let mut concepts = Vec::new();

        for (pattern, name, _) in &self.concept_patterns {
            if pattern.is_match(&files) {
                concepts.push(name.clone());
            }
        }

        concepts.sort();
        concepts.dedup();
        Ok(concepts)
    }

    fn calculate_novelty(&mut self, concepts: &[String], changes: &FileChanges) -> f64 {
        let mut score = 0.0;

        for concept in concepts {
            let count = self.seen_concepts.entry(concept.clone()).or_insert(0);
            let weight = self.concept_patterns
                .iter()
                .find(|(_, n, _)| n == concept)
                .map(|(_, _, w)| *w)
                .unwrap_or(1.0);

            if *count == 0 {
                score += weight * 10.0;
            } else {
                score += 1.0;
            }
            *count += 1;
        }

        score += changes.files_added as f64 * 2.0;
        score += changes.files_modified as f64 * 1.0;
        score += changes.lines_added as f64 * 0.01;

        if changes.lines_added > 1000 {
            score *= 1.5;
        }

        score
    }
}
