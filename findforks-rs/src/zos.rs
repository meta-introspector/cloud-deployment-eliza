use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeSnippet {
    pub id: String,
    pub commit_hash: String,
    pub file_path: String,
    pub start_line: usize,
    pub end_line: usize,
    pub content: String,
    pub novelty_score: f64,
    pub concepts: Vec<String>,
    pub author: String,
    pub date: String,
    pub first_seen: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimelineEntry {
    pub date: String,
    pub commit_hash: String,
    pub concepts: Vec<String>,
    pub snippet_count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemeTimeline {
    pub snippets: Vec<CodeSnippet>,
    pub concept_evolution: HashMap<String, Vec<String>>,
    pub timeline: Vec<TimelineEntry>,
}

pub struct ZosBranchBuilder {
    branch_name: String,
    snippets: Vec<CodeSnippet>,
    concept_map: HashMap<String, Vec<String>>,
    timeline: Vec<TimelineEntry>,
}

impl ZosBranchBuilder {
    pub fn new(branch_name: &str) -> Self {
        Self {
            branch_name: branch_name.to_string(),
            snippets: Vec::new(),
            concept_map: HashMap::new(),
            timeline: Vec::new(),
        }
    }

    pub fn extract_novel_snippets(
        &mut self,
        commit_hash: &str,
        novelty_score: f64,
        concepts: &[String],
    ) -> Result<()> {
        let output = Command::new("git")
            .args(["show", "--format=%an|%ad", commit_hash])
            .output()?;

        let info = String::from_utf8_lossy(&output.stdout);
        let first_line = info.lines().next().unwrap_or("");
        let parts: Vec<&str> = first_line.split('|').collect();
        let author = parts.get(0).unwrap_or(&"Unknown").to_string();
        let date = parts.get(1).unwrap_or(&"Unknown").to_string();

        let files_output = Command::new("git")
            .args(["show", "--name-only", "--format=", commit_hash])
            .output()?;

        let files = String::from_utf8_lossy(&files_output.stdout);

        for file in files.lines() {
            if file.is_empty() {
                continue;
            }

            let content_output = Command::new("git")
                .args(["show", &format!("{}:{}", commit_hash, file)])
                .output();

            if let Ok(output) = content_output {
                let content = String::from_utf8_lossy(&output.stdout);
                let lines: Vec<&str> = content.lines().collect();

                if lines.len() < 3 {
                    continue;
                }

                let mut start = 0;
                while start < lines.len() {
                    let end = (start + 150).min(lines.len());
                    if end - start < 3 {
                        break;
                    }

                    let snippet_content = lines[start..end].join("\n");
                    let id = format!("{}:{}:{}-{}", &commit_hash[..8], file.replace('/', "_"), start + 1, end);

                    let snippet = CodeSnippet {
                        id: id.clone(),
                        commit_hash: commit_hash.to_string(),
                        file_path: file.to_string(),
                        start_line: start + 1,
                        end_line: end,
                        content: snippet_content,
                        novelty_score,
                        concepts: concepts.to_vec(),
                        author: author.clone(),
                        date: date.clone(),
                        first_seen: date.clone(),
                    };

                    self.snippets.push(snippet);

                    for concept in concepts {
                        self.concept_map
                            .entry(concept.clone())
                            .or_insert_with(Vec::new)
                            .push(commit_hash.to_string());
                    }

                    start = end;
                }
            }
        }

        self.timeline.push(TimelineEntry {
            date: date.clone(),
            commit_hash: commit_hash.to_string(),
            concepts: concepts.to_vec(),
            snippet_count: self.snippets.len(),
        });

        Ok(())
    }

    pub fn create_zos_branch(&self) -> Result<()> {
        println!("Creating ZOS branch: {}", self.branch_name);

        Command::new("git")
            .args(["checkout", "--orphan", &self.branch_name])
            .output()?;

        Command::new("git").args(["rm", "-rf", "."]).output()?;

        fs::create_dir_all("snippets")?;
        fs::create_dir_all("concepts")?;
        fs::create_dir_all("timeline")?;

        for snippet in &self.snippets {
            let filename = format!("snippets/{}.md", snippet.id);
            let content = format!(
                "# {}\n\n**Commit:** {}\n**Author:** {}\n**Date:** {}\n**File:** {}:{}-{}\n**Novelty Score:** {:.2}\n**Concepts:** {}\n\n```\n{}\n```",
                snippet.id,
                snippet.commit_hash,
                snippet.author,
                snippet.date,
                snippet.file_path,
                snippet.start_line,
                snippet.end_line,
                snippet.novelty_score,
                snippet.concepts.join(", "),
                snippet.content
            );
            fs::write(&filename, content)?;
        }

        for (concept, commits) in &self.concept_map {
            let filename = format!("concepts/{}.md", concept);
            let content = format!(
                "# Concept: {}\n\n## Evolution\n\n{}",
                concept,
                commits.iter().map(|c| format!("- {}", c)).collect::<Vec<_>>().join("\n")
            );
            fs::write(&filename, content)?;
        }

        let timeline_data = MemeTimeline {
            snippets: self.snippets.clone(),
            concept_evolution: self.concept_map.clone(),
            timeline: self.timeline.clone(),
        };

        let timeline_json = serde_json::to_string_pretty(&timeline_data)?;
        fs::write("timeline/meme_timeline.json", timeline_json)?;

        let readme = format!(
            "# ZOS Meme Timeline\n\nThis branch catalogs {} novel code snippets across {} concepts.\n\n## Structure\n\n- `snippets/` - Individual code snippets with metadata\n- `concepts/` - Concept evolution tracking\n- `timeline/` - Chronological timeline of meme introduction\n\n## Statistics\n\n- Total Snippets: {}\n- Total Concepts: {}\n- Timeline Entries: {}",
            self.snippets.len(),
            self.concept_map.len(),
            self.snippets.len(),
            self.concept_map.len(),
            self.timeline.len()
        );
        fs::write("README.md", readme)?;

        Command::new("git").args(["add", "-A"]).output()?;
        Command::new("git")
            .args(["commit", "-m", "feat: create ZOS meme timeline catalog"])
            .output()?;

        println!("ZOS branch created successfully!");
        println!("Cataloged {} snippets across {} concepts", self.snippets.len(), self.concept_map.len());

        Ok(())
    }
}
