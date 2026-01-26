# a7046c18:scripts_tsdoc_applier.js:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_applier.js:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Define __dirname for ES modules
const __dirname = new URL(".", import.meta.url).pathname;

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Configuration
const COMMENTS_DIR = path.join(__dirname, "tsdoc_comments");

// Get node name for various node types
function getNodeName(node) {
  if (
    ts.isPropertyDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isVariableDeclaration(node)
  ) {
    return node.name ? node.name.text : "anonymous";
  }
  return "unknown";
}

// Check if a node already has JSDoc comments
function hasJSDocComment(node, sourceFile) {
  const jsDocComments = ts.getJSDocCommentRanges(node, sourceFile.text);
  return jsDocComments && jsDocComments.length > 0;
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

// Recursively find TypeScript files in a directory
async function findTsFilesInDir(dir, packageRoot) {
  try {
    const result = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        if (
          !item.startsWith(".") &&
          item !== "node_modules" &&
          item !== "dist"
        ) {
          const subFiles = await findTsFilesInDir(itemPath, packageRoot);
          result.push(...subFiles);
        }
      } else if (
        item.endsWith(".ts") &&
        !item.endsWith(".d.ts") &&
        !item.endsWith(".test.ts")
      ) {
        // Create relative path from package root
        const relativePath = path.relative(packageRoot, itemPath);
        result.push({
          path: itemPath,
          packageRoot,
          relativePath,
        });
      }
```