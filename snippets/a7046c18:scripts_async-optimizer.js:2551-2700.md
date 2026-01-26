# a7046c18:scripts_async-optimizer.js:2551-2700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/async-optimizer.js:2551-2700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Continue even if success is false, using what we have
    console.log(
      `Found ${parseResults.functions ? parseResults.functions.length : 0} functions via AST/regex analysis`,
    );

    // Use regex analysis for files where AST analysis failed or found no functions
    if (
      !cmdArgs["skip-regex"] &&
      parseResults.files &&
      parseResults.files.length > 0
    ) {
      const filesToReanalyze = parseResults.files.filter((file) => {
        // Add null check before filtering functions
        if (!parseResults.functions || !Array.isArray(parseResults.functions)) {
          return true; // If functions array doesn't exist, reanalyze this file
        }
        const functionsInFile = parseResults.functions.filter(
          (fn) => fn.file === file,
        );
        return functionsInFile.length === 0;
      });

      if (filesToReanalyze.length > 0) {
        logVerbose(
          `Reanalyzing ${filesToReanalyze.length} files with regex approach...`,
        );

        for (const file of filesToReanalyze) {
          const regexResults = await analyzeWithRegex(file);
          if (regexResults.success && regexResults.functions.length > 0) {
            // Initialize functions array if it doesn't exist
            if (!parseResults.functions) {
              parseResults.functions = [];
            }
            parseResults.functions.push(...regexResults.functions);
          }
        }
      }
    }

    // Continue with the AI analysis if available
    const analysisResults = await (async () => {
      if (cmdArgs.ai || cmdArgs["with-ai"]) {
        try {
          if (existsSync(AI_CACHE_PATH) && !cmdArgs["force-ai"]) {
            const result = await loadStageResults("ai");
            console.log(
              "Found existing AI analysis results, using cached data",
            );
            return result;
          }

          console.log("Starting AI analysis with Claude...");
          const result = await analyzeWithAI(parseResults);
          await saveStageResults("ai", result);
          return result;
        } catch (error) {
          console.error("Error in AI analysis stage:", error);
          return {
            results: {},
            parallelizableFunctions: new Set(),
            errors: [error],
          };
        }
      }

      // If no AI analysis, create results structure with parallelizable functions
      const result = {
        results: {},
        parallelizableFunctions: new Set(),
        errors: [],
      };

      // Ensure parseResults.functions exists before iterating
      if (parseResults && parseResults.functions && Array.isArray(parseResults.functions)) {
        // Add all functions with regex-identified parallelization opportunities
        parseResults.functions.forEach((fn) => {
          if (fn.canBeParallelized) {
            result.parallelizableFunctions.add(fn.name);
            result.results[fn.name] = {
              canBeParallelized: true,
              isParallelizable: true,
              parallelizableOperations: fn.parallelizableOperations || [],
              optimizedCode: fn.optimizedCode || fn.body,
              originalCode: fn.body,
              sourceInfo: {
                name: fn.name,
                filePath: fn.file,
                relativePath: fn.relativePath || fn.file,
                code: fn.body,
              },
            };
          } else {
            result.results[fn.name] = {
              canBeParallelized: false,
              originalCode: fn.body,
            };
          }
        });
      }

      return result;
    })();

    // Generate the final report
    try {
      console.log("Generating optimization report...");
      const reportPath = path.resolve(
        process.cwd(),
        "scripts/optimization-report.md",
      );
      const report = await generateMarkdownReport(analysisResults);

      // Use fsPromises.writeFile
      await fsPromises.writeFile(reportPath, report);
      console.log(`Report saved to: ${reportPath}`);
    } catch (error) {
      console.error("Error generating report:", error);
    }

    // Summary
    console.log("\nAnalysis Summary:");
    console.log(
      `- Files processed: ${(parseResults && parseResults.files) ? parseResults.files.length : 0}`,
    );
    console.log(
      `- Async functions found: ${(parseResults && parseResults.functions) ? parseResults.functions.length : 0}`,
    );
    console.log(
      `- Potentially parallelizable functions: ${(analysisResults && analysisResults.parallelizableFunctions) ? analysisResults.parallelizableFunctions.size : 0}`,
    );
    console.log(
      `- Errors encountered: ${(analysisResults && analysisResults.errors) ? analysisResults.errors.length : 0}`,
    );

    // Debug: Log the structure of analysisResults
    console.log("\nDebug: analysisResults structure:");
    console.log(
      "- parallelizableFunctions:",
      analysisResults.parallelizableFunctions,
    );
    console.log("- results keys:", Object.keys(analysisResults.results));
    if (Object.keys(analysisResults.results).length > 0) {
      const sampleKey = Object.keys(analysisResults.results)[0];
      console.log(
        `- Sample result (${sampleKey}):`,
        analysisResults.results[sampleKey],
      );
    }

```