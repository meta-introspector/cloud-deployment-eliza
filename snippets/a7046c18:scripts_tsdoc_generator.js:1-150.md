# a7046c18:scripts_tsdoc_generator.js:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_generator.js:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import dotenv from "dotenv";
import ts from "typescript";

dotenv.config();

// Define __dirname for ES modules
const __dirname = new URL(".", import.meta.url).pathname;

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const _prompt = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// Configuration
const CACHE_DIR = path.join(__dirname, "tsdoc_cache");
const COMMENTS_DIR = path.join(__dirname, "tsdoc_comments");
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_ENDPOINT = "https://api.anthropic.com/v1/messages";

if (!ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set");
  process.exit(1);
}

// Ensure cache and comments directories exist
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

if (!fs.existsSync(COMMENTS_DIR)) {
  fs.mkdirSync(COMMENTS_DIR, { recursive: true });
}

// Function to call Claude API
async function callClaude(content, _context) {
  try {
    const response = await fetch(CLAUDE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return null;
  }
}

// Find all packages in the packages directory
async function findPackages() {
  try {
    const packagesDir = path.join(__dirname, "../packages");
    if (!fs.existsSync(packagesDir)) {
      console.error("Error: packages directory not found");
      process.exit(1);
    }

    const packages = fs
      .readdirSync(packagesDir)
      .filter((item) => {
        const itemPath = path.join(packagesDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .map((pkg) => path.join(packagesDir, pkg));

    console.log(`Found ${packages.length} packages`);
    return packages;
  } catch (error) {
    console.error("Error finding packages:", error);
    process.exit(1);
  }
}

// Find src directories in a package
function findSrcDirs(packagePath) {
  try {
    const result = [];
    const dirs = [packagePath];

    while (dirs.length > 0) {
      const currentDir = dirs.pop();
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          if (item === "src") {
            result.push(itemPath);
          } else if (
            !item.startsWith(".") &&
            item !== "node_modules" &&
            item !== "dist"
          ) {
            dirs.push(itemPath);
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error(`Error finding src directories in ${packagePath}:`, error);
    return [];
  }
}

// Find all TypeScript files in src directories
async function findTypeScriptFiles(packagePath) {
  try {
    const srcDirs = findSrcDirs(packagePath);
    let tsFiles = [];

    for (const srcDir of srcDirs) {
      const files = await findTsFilesInDir(srcDir, packagePath);
      tsFiles = tsFiles.concat(files);
    }

    return tsFiles;
  } catch (error) {
    console.error(`Error finding TypeScript files in ${packagePath}:`, error);
    return [];
  }
}

```