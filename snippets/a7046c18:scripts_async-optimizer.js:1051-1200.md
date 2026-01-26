# a7046c18:scripts_async-optimizer.js:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/async-optimizer.js:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  // Only consider assignments complex if they involve function calls that aren't simple
  const hasComplexAssignment =
    startNode.type === "VariableDeclaration" &&
    startNode.declarations.some(
      (decl) =>
        decl.init &&
        decl.init.type === "CallExpression" &&
        decl.init.callee &&
        decl.init.callee.type !== "MemberExpression",
    );

  // Simplify control flow detection - only consider certain patterns as disruptive
  const hasComplexControlFlow =
    /\b(if|for|while|switch)\s*\([^)]*\).*\{[^}]*await/.test(inBetweenCode);

  // Only consider method calls that might have observable side effects
  const potentiallyUnsafePatterns = [
    "write",
    "delete",
    "remove",
    "update",
    "create",
    "insert",
    "save",
    "modify",
  ];

  const hasPotentiallyUnsafeCalls =
    potentiallyUnsafePatterns.some((pattern) =>
      inBetweenCode.toLowerCase().includes(pattern),
    ) &&
    inBetweenCode.includes("(") &&
    !inBetweenCode.includes("Promise.all");

  return (
    hasDependency ||
    hasComplexAssignment ||
    hasComplexControlFlow ||
    hasPotentiallyUnsafeCalls
  );
}

async function applyOptimizationToFile(filePath, functionInfo, optimizedCode) {
  try {
    // Validate inputs
    if (!filePath || !functionInfo || !optimizedCode) {
      throw new Error("Missing required parameters for optimization");
    }

    // Read the source file
    let sourceCode;
    try {
      sourceCode = await fsPromises.readFile(filePath, "utf8");
    } catch (error) {
      throw new Error(
        `Failed to read source file ${filePath}: ${error.message}`,
      );
    }

    let start = 0;
    let end = sourceCode.length;

    // Try to use range information if it exists and is valid
    if (
      functionInfo.range &&
      Array.isArray(functionInfo.range) &&
      functionInfo.range.length === 2
    ) {
      const [rangeStart, rangeEnd] = functionInfo.range;

      // Validate range bounds
      if (
        rangeStart >= 0 &&
        rangeEnd <= sourceCode.length &&
        rangeStart < rangeEnd
      ) {
        start = rangeStart;
        end = rangeEnd;
      } else {
        logVerbose(
          `Warning: Range [${rangeStart}, ${rangeEnd}] is out of bounds for file of length ${sourceCode.length}`,
        );
        // We'll find the function by content below
      }
    } else {
      logVerbose(
        `Range information missing or invalid for ${functionInfo.name}. Will attempt to find by content.`,
      );
    }

    // Verify the original code matches at the specified range
    const originalRangeCode = sourceCode.slice(start, end);
    let matchFound = originalRangeCode.trim() === functionInfo.code.trim();

    // If the range doesn't match the expected code, try to find the function in the file
    if (!matchFound) {
      logVerbose(
        `Original code at range does not match function info for ${functionInfo.name}. Searching for function...`,
      );

      // Escape special regex characters in function code
      const escapedFunctionCode = functionInfo.code
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+"); // Allow for whitespace differences

      // Create a regex pattern that can match the function even with whitespace differences
      const functionPattern = new RegExp(escapedFunctionCode, "g");
      const match = functionPattern.exec(sourceCode);

      if (match) {
        start = match.index;
        end = start + match[0].length;
        matchFound = true;
        logVerbose(
          `Found function ${functionInfo.name} at position ${start}-${end}`,
        );
      } else {
        // Try to find by function name if the exact code doesn't match
        const namePattern = new RegExp(
          `(async\\s+function\\s+${functionInfo.name}\\s*\\(|${functionInfo.name}\\s*:\\s*async\\s+function\\s*\\(|${functionInfo.name}\\s*=\\s*async\\s*\\()`,
          "g",
        );
        const nameMatch = namePattern.exec(sourceCode);

        if (nameMatch) {
          // Found the function declaration, now try to find the matching closing brace
          let openBraces = 0;
          let inString = false;
          let stringChar = "";
          let pos = nameMatch.index;

          while (pos < sourceCode.length) {
            if (!inString) {
              if (sourceCode[pos] === "{") {
                openBraces++;
              } else if (sourceCode[pos] === "}") {
                openBraces--;
                if (openBraces === 0) {
                  // We've found the end of the function
                  end = pos + 1;
                  start = nameMatch.index;
                  matchFound = true;
                  logVerbose(
                    `Found function ${functionInfo.name} by name at position ${start}-${end}`,
                  );
                  break;
                }
              } else if (
                sourceCode[pos] === '"' ||
                sourceCode[pos] === "'" ||
```