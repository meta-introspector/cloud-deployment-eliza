# a7046c18:scripts_async-optimizer.js:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/async-optimizer.js:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

// Improved AST analysis with better error handling
function analyzeASTForParallelization(node, sourceCode) {
  if (!node) return [];

  const parallelOps = [];
  const awaitExpressions = [];
  const visited = new WeakSet();

  // Refined blacklisted terms that prevent parallelization
  const BLACKLISTED_TERMS = ["transaction", "lock", "mutex", "semaphore"];

  // Helper to check if operation contains blacklisted terms
  function containsBlacklistedTerm(code) {
    return BLACKLISTED_TERMS.some((term) =>
      code.toLowerCase().includes(term.toLowerCase()),
    );
  }

  // Helper to check if nodes are in different branches
  function areInDifferentBranches(node1, node2) {
    let parent1 = node1;
    const parent2 = node2;

    // Safety check
    if (!parent1 || !parent2) return false;

    try {
      while (parent1) {
        if (parent1.type === "IfStatement" || parent1.type === "SwitchCase") {
          const branch1Parent = parent1;
          let temp = parent2;
          while (temp) {
            if (temp === branch1Parent) {
              return true; // Found common control flow parent
            }
            temp = temp.parent;
          }
        }
        parent1 = parent1.parent;
      }
    } catch (_error) {
      // If any error occurs during branch analysis, assume they might be in different branches
      return true;
    }
    return false;
  }

  // Find all await expressions and Promise.all usage with improved safety
  function collectNodes(node) {
    if (!node || visited.has(node)) return;
    visited.add(node);

    try {
      if (node.type === "AwaitExpression") {
        // Ensure node has a range before proceeding
        if (
          node.range &&
          node.range.length === 2 &&
          typeof node.range[0] === "number" &&
          typeof node.range[1] === "number"
        ) {
          // Skip if the await expression contains blacklisted terms
          const awaitCode = sourceCode.slice(node.range[0], node.range[1]);
          if (!containsBlacklistedTerm(awaitCode)) {
            awaitExpressions.push(node);
          }
        }
      }
    } catch (_error) {
      // Skip this node if there's an error
      console.warn("Warning: Error analyzing await expression");
    }

    // Safely traverse children
    for (const key in node) {
      if (node[key] && typeof node[key] === "object" && key !== "parent") {
        try {
          const child = node[key];
          if (child) {
            child.parent = node;
            collectNodes(child);
          }
        } catch (_error) {
          // Skip problematic child nodes
        }
      }
    }
  }

  try {
    collectNodes(node);
  } catch (_error) {
    console.warn("Warning: Error collecting nodes for analysis");
    return [];
  }

  // Group consecutive await expressions that could be parallelized
  let currentGroup = [];

  try {
    for (let i = 0; i < awaitExpressions.length; i++) {
      const awaitExpr = awaitExpressions[i];

      // Validate await expression has required properties
      if (!awaitExpr || !awaitExpr.argument || !awaitExpr.argument.range) {
        continue;
      }

      // Find the parent statement or declaration
      let parent = awaitExpr;
      let foundParent = false;
      while (parent && !foundParent) {
        if (
          parent.type === "VariableDeclaration" ||
          parent.type === "ExpressionStatement" ||
          parent.type === "ReturnStatement"
        ) {
          foundParent = true;
        } else {
          parent = parent.parent;
        }
      }

      if (!parent) continue;

      if (currentGroup.length === 0) {
        currentGroup.push({ await: awaitExpr, parent });
        continue;
      }

      const lastExpr = currentGroup[currentGroup.length - 1];

      // Skip if either has invalid properties
      if (
        !lastExpr.await ||
        !lastExpr.parent ||
        !lastExpr.await.argument ||
        !lastExpr.await.argument.range
      ) {
        currentGroup = [{ await: awaitExpr, parent }];
        continue;
      }

      // Check for dependencies between awaits with less restrictive criteria
      const hasComplexDeps = hasComplexDependencies(
        lastExpr.parent,
        parent,
        lastExpr.await,
```