# a7046c18:scripts_async-optimizer.js:2401-2550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/async-optimizer.js:2401-2550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          file: relativeFilePath,
          regexAnalysis: true,
        });
      }
    }

    return result;
  } catch (error) {
    return {
      file: filePath,
      functions: [],
      success: false,
      error: error.message,
    };
  }
}

// Add getStageCachePath function
function getStageCachePath(stage) {
  const stageCachePaths = {
    parse: PARSE_CACHE_PATH,
    PARSE: PARSE_CACHE_PATH,
    ai: AI_CACHE_PATH,
    AI: AI_CACHE_PATH,
    final: FINAL_CACHE_PATH,
    FINAL: FINAL_CACHE_PATH,
  };

  const cachePath = stageCachePaths[stage];
  if (!cachePath) {
    console.warn(`Warning: Unknown stage "${stage}", using default cache path`);
    return PARSE_CACHE_PATH; // Default to parse cache path
  }

  return cachePath;
}

// Modify the main function to use both AST and regex analysis
async function main() {
  const _packagesDir = path.join(__dirname, "..", "packages");

  // Initialize cache if needed
  await initializeCache();

  // Parse command line arguments
  const cmdArgs = minimist(process.argv.slice(2), {
    boolean: [
      "analyze",
      "ai",
      "with-ai",
      "force-ai",
      "verbose",
      "regex-only",
      "force-parse",
      "skip-regex",
    ],
    string: ["file"],
  });

  // Set verbose mode if specified
  VERBOSE = cmdArgs.verbose || false;

  if (cmdArgs.analyze) {
    console.log("Starting analysis...");

    // Change let to const since it's assigned only once
    const parseResults = await (async () => {
      // Check if a specific file was provided
      if (
        cmdArgs.file &&
        (cmdArgs.file.endsWith(".js") ||
          cmdArgs.file.endsWith(".ts") ||
          cmdArgs.file.endsWith(".tsx"))
      ) {
        const filePath = path.resolve(process.cwd(), cmdArgs.file);
        console.log(`Analyzing specific file: ${filePath}`);

        // Try AST analysis first, unless regex-only is specified
        const astAnalysisResults = { functions: [], success: false };
        if (!cmdArgs["regex-only"]) {
          try {
            logVerbose("Attempting AST analysis...");
            Object.assign(
              astAnalysisResults,
              await extractAsyncFunctions(filePath),
            );
          } catch (error) {
            console.warn(
              `Warning: AST analysis failed for ${filePath}: ${error.message}`,
            );
            astAnalysisResults.error = error.message;
          }
        }

        // If AST analysis found no functions or didn't complete successfully, try regex analysis
        const regexAnalysisResults = { functions: [] };
        if (
          cmdArgs["regex-only"] ||
          astAnalysisResults.functions.length === 0 ||
          !astAnalysisResults.success
        ) {
          logVerbose("Using regex analysis...");
          Object.assign(regexAnalysisResults, await analyzeWithRegex(filePath));
        }

        // Combine results (AST takes precedence for the same function names)
        const astFunctionNames = new Set(
          astAnalysisResults.functions.map((f) => f.name),
        );
        const combinedFunctions = [
          ...astAnalysisResults.functions,
          ...regexAnalysisResults.functions.filter(
            (f) => !astFunctionNames.has(f.name),
          ),
        ];

        return {
          files: [filePath],
          functions: combinedFunctions,
          success: astAnalysisResults.success || regexAnalysisResults.success,
        };
      }

      // Process packages directory
      if (existsSync(PARSE_CACHE_PATH) && !cmdArgs["force-parse"]) {
        const result = await loadStageResults("parse");
        console.log("Found existing parse results, using cached data");
        return result;
      }

      // Get the packages directory
      const packagesDir = path.resolve(process.cwd(), "packages");

      if (!existsSync(packagesDir)) {
        console.error(`Packages directory not found: ${packagesDir}`);
        return { files: [], functions: [], success: false };
      }

      console.log(`Analyzing packages in: ${packagesDir}`);
      const result = await parseAllPackages(packagesDir);
      await saveStageResults("parse", result);
      return result;
    })();

    // Change this check to allow the script to continue with available results
    if (!parseResults) {
      console.error("Error during analysis: Parse results are undefined");
      return;
    }

```