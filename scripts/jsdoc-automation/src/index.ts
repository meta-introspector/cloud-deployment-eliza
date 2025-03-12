//const __filename = "error";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__filename);
console.log(__dirname);
import { DirectoryTraversal } from "./DirectoryTraversal.js";
import { TypeScriptParser } from "./TypeScriptParser.js";
import { JsDocAnalyzer } from "./JsDocAnalyzer.js";
import { JsDocGenerator } from "./JsDocGenerator.js";
import { DocumentationGenerator } from "./DocumentationGenerator.js";
import { Configuration } from "./Configuration.js";
import { AIService } from "./AIService/AIService.js";
//import { GitManager } from "./GitManager.js";
import { LocalGitManager } from "./LocalGitManager.js";
import { PluginDocumentationGenerator } from "./PluginDocumentationGenerator.js";

/**
 * Main function for generating documentation.
 * Uses configuration initialized from the GitHub workflow file.
 * @async
 */
async function main() {
    try {
        const configuration = new Configuration();

        console.log("owner", configuration.repository.owner);

        const gitManager = new LocalGitManager({
            owner: configuration.repository.owner,
            name: configuration.repository.name,
        });

        let prFiles: string[] = [];
        if (
            typeof configuration.repository.pullNumber === "number" &&
            !isNaN(configuration.repository.pullNumber)
        ) {
            console.log(
                "Pull Request Number: ",
                configuration.repository.pullNumber
            );
            try {
                const files = await gitManager.getFilesInPullRequest(
                    configuration.repository.pullNumber
                );
                // Log the changes for debugging
                console.log("Files changed in PR:", files.map(f => ({
                    file: f.filename,
                    changes: f.changes,
                    additions: f.additions,
                    deletions: f.deletions,
                    status: f.status
                })));
                
                try {
                    const directoryTraversal = new DirectoryTraversal(
                        configuration,
                        files
                    );
                    const typeScriptParser = new TypeScriptParser();
                    const jsDocAnalyzer = new JsDocAnalyzer(typeScriptParser);
                    const aiService = new AIService(configuration);
                    const jsDocGenerator = new JsDocGenerator(aiService);

                    const documentationGenerator = new DocumentationGenerator(
                        directoryTraversal,
                        typeScriptParser,
                        jsDocAnalyzer,
                        jsDocGenerator,
                        gitManager,
                        configuration,
                        aiService
                    );

                    const pluginDocGenerator = new PluginDocumentationGenerator(
                        aiService,
                        gitManager,
                        configuration
                    );

                    const { todoItems, envUsages } =
                        await documentationGenerator.analyzeCodebase();

                    // Generate JSDoc documentation first
                    const { documentedItems, branchName } =
                        await documentationGenerator.generate(
                            configuration.repository.pullNumber
                        );

                    // If both are true, use JSDoc branch for README
                    // If only README is true, create new branch
                    if (configuration.generateReadme) {
                        const targetBranch =
                            configuration.generateJsDoc && branchName
                                ? branchName
                                : `docs-update-readme-${Date.now()}`;

                        if (!configuration.generateJsDoc) {
                            await gitManager.createBranch(
                                targetBranch,
                                configuration.branch
                            );
                        }

                        await pluginDocGenerator.generate(
                            documentedItems,
                            targetBranch,
                            todoItems,
                            envUsages
                        );

                        // Only create PR if we're not also generating JSDoc (otherwise changes go in JSDoc PR)
                        if (!configuration.generateJsDoc) {
                            const prContent = {
                                title: "docs: Update plugin documentation",
                                body: "Updates plugin documentation with latest changes",
                            };

                            await gitManager.createPullRequest({
                                title: prContent.title,
                                body: prContent.body,
                                head: targetBranch,
                                base: configuration.branch,
                                labels: ["documentation", "automated-pr"],
                                reviewers: configuration.pullRequestReviewers || [],
                            });
                        }
                    }



                    try {
                        const typeScriptParser = new TypeScriptParser();
                        const jsDocAnalyzer = new JsDocAnalyzer(typeScriptParser);
                        const aiService = new AIService(configuration);
                        const jsDocGenerator = new JsDocGenerator(aiService);
            
                        const documentationGenerator = new DocumentationGenerator(
                            directoryTraversal,
                            typeScriptParser,
                            jsDocAnalyzer,
                            jsDocGenerator,
                            gitManager,
                            configuration,
                            aiService
                        );
            
                        const pluginDocGenerator = new PluginDocumentationGenerator(
                            aiService,
                            gitManager,
                            configuration
                        );
            
                        const { todoItems, envUsages } =
                            await documentationGenerator.analyzeCodebase();
            
                        // Generate JSDoc documentation first
                        const { documentedItems, branchName } =
                            await documentationGenerator.generate(
                                configuration.repository.pullNumber
                            );
            
                        // If both are true, use JSDoc branch for README
                        // If only README is true, create new branch
                        if (configuration.generateReadme) {
                            const targetBranch =
                                configuration.generateJsDoc && branchName
                                    ? branchName
                                    : `docs-update-readme-${Date.now()}`;
            
                            if (!configuration.generateJsDoc) {
                                await gitManager.createBranch(
                                    targetBranch,
                                    configuration.branch
                                );
                            }
            
                            await pluginDocGenerator.generate(
                                documentedItems,
                                targetBranch,
                                todoItems,
                                envUsages
                            );
            
                            // Only create PR if we're not also generating JSDoc (otherwise changes go in JSDoc PR)
                            if (!configuration.generateJsDoc) {
                                const prContent = {
                                    title: "docs: Update plugin documentation",
                                    body: "Updates plugin documentation with latest changes",
                                };
            
                                await gitManager.createPullRequest({
                                    title: prContent.title,
                                    body: prContent.body,
                                    head: targetBranch,
                                    base: configuration.branch,
                                    labels: ["documentation", "automated-pr"],
                                    reviewers: configuration.pullRequestReviewers || [],
                                });
                            }
                        }
                    } catch (error) {
                        console.error("Error during documentation generation:", {
                            message: error instanceof Error ? error.message : String(error),
                            stack: error instanceof Error ? error.stack : undefined,
                            timestamp: new Date().toISOString(),
                        });
                        process.exit(2);
                    }
                    
                } catch (error) {
                    console.error("Error during documentation generation:", {
                        error: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined,
                        timestamp: new Date().toISOString(),
                    });
                    process.exit(2);
                }
            } catch (prError) {
                console.error("Error fetching PR files:", {
                    error: prError,
                    pullNumber: configuration.repository.pullNumber,
                    repository: `${configuration.repository.owner}/${configuration.repository.name}`,
                });
                throw prError;
            }
        }

        
    } catch (error) {
        console.error("Critical error during documentation generation:", {
            error:
                error instanceof Error
                    ? {
                          name: error.name,
                          message: error.message,
                          stack: error.stack,
                      }
                    : error,
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            platform: process.platform,
        });
        process.exit(12);
    }
}

// Simple error handling for the main function
main()
// .catch((error) => {
//     console.log("ERROR");
//     console.error(
//         "Fatal error:",
//         error instanceof Error ? error.message : String(error)
//     );
//     process.exit(10);
// });


export {
    DirectoryTraversal,
    TypeScriptParser,
    JsDocAnalyzer,
    JsDocGenerator,
    DocumentationGenerator,
    Configuration,
    AIService,
    LocalGitManager,
    PluginDocumentationGenerator
};