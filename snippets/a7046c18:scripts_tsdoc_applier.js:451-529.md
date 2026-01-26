# a7046c18:scripts_tsdoc_applier.js:451-529

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_applier.js:451-529
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const dryRun = applyResponse.toLowerCase() === "dry";

    if (dryRun) {
      console.log("\nRunning in DRY RUN mode - no files will be modified\n");
    }

    // Ask for concurrency level
    const concurrencyResponse = await prompt(
      "How many files to process concurrently? (default: 10): ",
    );
    const maxConcurrent = Number.parseInt(concurrencyResponse, 10) || 10;
    console.log(`Processing with ${maxConcurrent} concurrent workers\n`);

    // Find all packages
    const packages = await findPackages();

    const updatedFilesStats = {
      updatedFiles: 0,
      totalCommentsAdded: 0,
    };

    // Apply comments to files for each package
    for (const packagePath of packages) {
      console.log(
        `\nApplying comments to package: ${path.basename(packagePath)}`,
      );

      const updatedFiles = await applyCommentsToFiles(packagePath, {
        dryRun,
        verbose: false,
        maxConcurrent,
      });

      updatedFilesStats.updatedFiles += updatedFiles.length;
      updatedFilesStats.totalCommentsAdded += updatedFiles.reduce(
        (sum, file) => sum + file.addedComments,
        0,
      );

      // Display per-file stats
      for (const file of updatedFiles) {
        console.log(
          `  - ${path.basename(file.path)}: ${dryRun ? "Would add" : "Added"} ${file.addedComments} comments (${file.originalLines} → ${file.updatedLines} lines)`,
        );
      }
    }

    // Display final stats
    console.log("\n=== Final Results ===");
    console.log(
      `Files ${dryRun ? "that would be updated" : "updated"}: ${updatedFilesStats.updatedFiles}`,
    );
    console.log(
      `Total comments ${dryRun ? "that would be added" : "added"}: ${updatedFilesStats.totalCommentsAdded}`,
    );

    if (dryRun) {
      console.log("\nThis was a dry run. No files were modified.");
      console.log('Run again with "yes" to apply the changes.');
    }

    console.log("\nTSDoc application process complete!");
    rl.close();
  } catch (error) {
    console.error("Error in main function:", error);
    rl.close();
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  import("node:url").then((url) => {
    global.fileURLToPath = url.fileURLToPath;
    main();
  });
}

export { applyCommentsToFiles };
```