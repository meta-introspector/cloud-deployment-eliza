# a7046c18:scripts_tsdoc_generator.js:601-622

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/tsdoc_generator.js:601-622
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    console.log("\n=== Comment Extraction and Generation Complete ===");
    console.log(`Total files processed: ${stats.totalFiles}`);
    console.log(`Total nodes found: ${stats.totalNodes}`);
    console.log(`Nodes with existing comments: ${stats.nodesWithComments}`);
    console.log(`Nodes without comments: ${stats.nodesWithoutComments}`);
    console.log(`Comments generated: ${stats.generatedComments}`);

    console.log("\nTo apply these comments to your source files, run:");
    console.log("node tsdoc_applier.js");

    rl.close();
  } catch (error) {
    console.error("Error in main function:", error);
    rl.close();
    process.exit(1);
  }
}

// Export functions for use in other modules
export { findPackages, findTypeScriptFiles, processTypeScriptFile, readReadme };

main();
```