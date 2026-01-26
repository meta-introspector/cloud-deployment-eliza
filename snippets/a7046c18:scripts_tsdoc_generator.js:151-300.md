# a7046c18:scripts_tsdoc_generator.js:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_generator.js:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
    }

    return result;
  } catch (error) {
    console.error(`Error finding TypeScript files in ${dir}:`, error);
    return [];
  }
}

// Read the project's README file
async function readReadme() {
  try {
    const readmePath = path.join(__dirname, "README.md");
    if (fs.existsSync(readmePath)) {
      return fs.readFileSync(readmePath, "utf8");
    } else {
      console.warn("Warning: README.md not found in root directory");
      return "";
    }
  } catch (error) {
    console.error("Error reading README:", error);
    return "";
  }
}

// Get cache file path for a TypeScript file
function getCacheFilePath(tsFile) {
  const relativePath = path.relative(
    path.join(__dirname, "../packages"),
    tsFile.packageRoot,
  );
  const cacheDir = path.join(CACHE_DIR, relativePath);

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  return path.join(cacheDir, `${path.basename(tsFile.path)}.json`);
}

// Get comments file path for a TypeScript file
function getCommentsFilePath(tsFile) {
  const relativePath = path.relative(
    path.join(__dirname, "../packages"),
    tsFile.packageRoot,
  );
  const commentsDir = path.join(
    COMMENTS_DIR,
    relativePath,
    path.dirname(tsFile.relativePath),
  );

  if (!fs.existsSync(commentsDir)) {
    fs.mkdirSync(commentsDir, { recursive: true });
  }

  return path.join(commentsDir, `${path.basename(tsFile.path)}.json`);
}

// Check if a node already has JSDoc comments
function hasJSDocComment(node, sourceFile) {
  const jsDocComments = ts.getJSDocCommentRanges(node, sourceFile.text);
  return jsDocComments && jsDocComments.length > 0;
}

// Extract existing JSDoc comments from a node
function extractJSDocComment(node, sourceFile) {
  const jsDocComments = ts.getJSDocCommentRanges(node, sourceFile.text);
  if (jsDocComments && jsDocComments.length > 0) {
    return sourceFile.text.substring(
      jsDocComments[0].pos,
      jsDocComments[0].end,
    );
  }
  return null;
}

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

// Get node kind as string
function getNodeKindString(node) {
  if (ts.isPropertyDeclaration(node)) return "property";
  if (ts.isMethodDeclaration(node)) return "method";
  if (ts.isFunctionDeclaration(node)) return "function";
  if (ts.isClassDeclaration(node)) return "class";
  if (ts.isInterfaceDeclaration(node)) return "interface";
  if (ts.isTypeAliasDeclaration(node)) return "type";
  if (ts.isVariableDeclaration(node)) return "variable";
  return "unknown";
}

// Extract relevant information about a node for documentation
function extractNodeInfo(node, sourceFile) {
  const name = getNodeName(node);
  const kind = getNodeKindString(node);
  const hasComment = hasJSDocComment(node, sourceFile);
  const existingComment = hasComment
    ? extractJSDocComment(node, sourceFile)
    : null;

  const start = node.getStart(sourceFile);
  const end = node.getEnd();
  const text = sourceFile.text.substring(start, end);

```