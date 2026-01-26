# a7046c18:scripts_async-optimizer.js:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/async-optimizer.js:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      console.log(`Skipping package: ${pkg}`);
      continue;
    }

    const srcDir = path.join(packagesDir, pkg, "src");
    try {
      await fsPromises.access(srcDir);
      const files = await findFiles(srcDir);
      sourceFiles.push(...files);
    } catch (_error) {}
  }

  return sourceFiles;
}

async function findFiles(dir) {
  const files = [];
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await findFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function extractAsyncFunctions(filePath) {
  try {
    const sourceCode = await fsPromises.readFile(filePath, "utf8");
    let ast;

    try {
      // Enhanced parsing configuration for TypeScript
      const parserOptions = {
        ecmaVersion: 2022,
        sourceType: "module",
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        allowSuperOutsideMethod: true,
        allowUndeclaredExports: true,
        plugins: [],
      };

      // Add appropriate plugins based on file extension
      if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
        parserOptions.plugins.push("typescript");
        if (filePath.endsWith(".tsx")) {
          parserOptions.plugins.push("jsx");
        }
      } else if (filePath.endsWith(".jsx")) {
        parserOptions.plugins.push("jsx");
      }

      ast = parse(sourceCode, parserOptions);
    } catch (error) {
      // Log the error but continue processing other files
      console.warn(`Warning: Failed to parse ${filePath}: ${error.message}`);
      return {
        functions: [],
        success: false,
        error: error.message,
      };
    }

    const asyncFunctions = [];
    const visited = new WeakSet();

    function visit(node) {
      if (!node || visited.has(node)) return;
      visited.add(node);

      try {
        if (
          (node.type === "FunctionDeclaration" ||
            node.type === "FunctionExpression" ||
            node.type === "ArrowFunctionExpression") &&
          node.async
        ) {
          // Skip if range information is invalid
          if (
            !node.range ||
            node.range.length !== 2 ||
            node.range[0] === undefined ||
            node.range[1] === undefined
          ) {
            console.warn(
              `Warning: Invalid range information for function in ${filePath}`,
            );
            return;
          }

          const code = sourceCode.slice(node.range[0], node.range[1]);
          const name = (node.id && node.id.name) || "anonymous";

          // Analyze the function body for potential parallel operations
          const parallelOps = node.body
            ? analyzeASTForParallelization(node.body, sourceCode)
            : [];

          asyncFunctions.push({
            name,
            code,
            filePath,
            range: node.range,
            loc: node.loc,
            astAnalysis: {
              isParallelizable: parallelOps.length > 0,
              parallelizableOperations: parallelOps,
            },
          });
        }
      } catch (error) {
        // If a specific node processing fails, log and continue
        console.warn(
          `Warning: Error processing async function in ${filePath}: ${error.message}`,
        );
      }

      // Traverse child nodes safely
      for (const key in node) {
        if (node[key] && typeof node[key] === "object" && key !== "parent") {
          try {
            visit(node[key]);
          } catch (error) {
            // Skip problematic nodes
            console.warn(
              `Warning: Error traversing node ${key} in ${filePath}: ${error.message}`,
            );
          }
        }
      }
    }

    visit(ast);
    return asyncFunctions;
  } catch (error) {
    console.warn(`Error processing ${filePath}: ${error.message}`);
    return {
      functions: [],
      success: false,
      error: error.message,
    };
  }
```