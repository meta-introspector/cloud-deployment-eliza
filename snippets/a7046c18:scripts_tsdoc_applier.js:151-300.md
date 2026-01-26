# a7046c18:scripts_tsdoc_applier.js:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_applier.js:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }

    return result;
  } catch (error) {
    console.error(`Error finding TypeScript files in ${dir}:`, error);
    return [];
  }
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

// Apply comments back to the original files
async function applyCommentsToFiles(packagePath, options = {}) {
  const { dryRun = false, verbose = false, maxConcurrent = 10 } = options;

  try {
    const tsFiles = await findTypeScriptFiles(packagePath);

    // Use a queue-based approach for parallel processing
    const queue = [...tsFiles];
    const activePromises = new Map(); // Use Map to keep track of file -> promise
    const updatedFiles = [];
    let completed = 0;

    // Function to process a single file
    const processFile = async (tsFile) => {
      const commentsFilePath = getCommentsFilePath(tsFile);

      if (!fs.existsSync(commentsFilePath)) {
        if (verbose) {
          console.log(`No comments file found for ${tsFile.path}, skipping`);
        }
        return null;
      }

      const comments = JSON.parse(fs.readFileSync(commentsFilePath, "utf8"));
      const fileContent = fs.readFileSync(tsFile.path, "utf8");

      // Create a program for this file
      const program = ts.createProgram([tsFile.path], {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
      });

      const sourceFile = program.getSourceFile(tsFile.path);

      // Collect nodes and their positions
      const nodes = [];

      function visit(node) {
        if (
          ts.isClassDeclaration(node) ||
          ts.isFunctionDeclaration(node) ||
          ts.isMethodDeclaration(node) ||
          ts.isPropertyDeclaration(node) ||
          ts.isInterfaceDeclaration(node) ||
          ts.isTypeAliasDeclaration(node)
        ) {
          const name = getNodeName(node);
          if (comments[name] && !hasJSDocComment(node, sourceFile)) {
            nodes.push({
              name,
              position: node.getStart(sourceFile),
              comment: comments[name].comment,
            });
          }
        }

        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach((declaration) => {
            const name = getNodeName(declaration);
            if (comments[name] && !hasJSDocComment(declaration, sourceFile)) {
              nodes.push({
                name,
                position: declaration.getStart(sourceFile),
                comment: comments[name].comment,
              });
            }
          });
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      // Sort nodes by position in descending order to avoid position shifts
      nodes.sort((a, b) => b.position - a.position);

      // Apply comments
      let updatedContent = fileContent;
      let changed = false;

      for (const node of nodes) {
        // Add the comment at the node position
        updatedContent =
          updatedContent.substring(0, node.position) +
          `${node.comment}\n` +
          updatedContent.substring(node.position);
        changed = true;
      }

      if (changed) {
        // Count lines before and after
        const originalLines = fileContent.split("\n").length;
        const updatedLines = updatedContent.split("\n").length;

        // Verify that we haven't lost any content
        if (updatedLines >= originalLines) {
          if (!dryRun) {
            fs.writeFileSync(tsFile.path, updatedContent);
          }

          const result = {
            path: tsFile.path,
            originalLines,
            updatedLines,
            addedComments: nodes.length,
          };

          console.log(
            `${dryRun ? "[DRY RUN] Would update" : "Updated"} ${tsFile.path} with ${nodes.length} comments`,
          );
          return result;
        } else {
          console.error(
            `Error: Updated file has fewer lines than original. Skipping: ${tsFile.path}`,
          );
          return null;
        }
      } else if (verbose) {
        console.log(`No changes to make for ${tsFile.path}`);
        return null;
```