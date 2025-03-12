import { promises as fs } from "fs";
import * as path from "path";
import type { Configuration } from "./Configuration.js";

export interface FileChange {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    contents_url?: string;
}

/**
 * DirectoryTraversal class for traversing through directories and files.
 * @class DirectoryTraversal
 */
export class DirectoryTraversal {
    /**
     * Directories that should always be excluded from scanning,
     * regardless of configuration
     */
    private static readonly FORCED_EXCLUDED_DIRS = [
        "node_modules",
        ".git",
        "dist",
        "build",
        "coverage",
        ".next",
        ".nuxt",
        ".cache",
        "tmp",
        "temp",
        ".turbo",
        ".husky",
        ".github",
        ".vscode",
        "public",
        "static",
    ];

    private fileChanges: Map<string, FileChange>;

    /**
     * Constructor for directory traversal
     * @param {Configuration} config - Configuration object containing paths and exclusions
     * @param {FileChange[]} [changes=[]] - Array of file changes from git diff
     */
    constructor(
        private config: Configuration,
        changes: FileChange[] = []
    ) {
        this.fileChanges = new Map(changes.map(change => [change.filename, change]));
    }

    /**
     * Gets the absolute path for a file
     */
    public getAbsolutePath(filePath: string): string {
        return this.config.toAbsolutePath(filePath);
    }

    /**
     * Gets the repository-relative path for a file
     */
    public getRelativePath(filePath: string): string {
        return this.config.toRelativePath(filePath);
    }

    /**
     * Gets the file change information for a given file
     * @param {string} filePath - The path to the file
     * @returns {FileChange | undefined} The file change information if available
     */
    public getFileChange(filePath: string): FileChange | undefined {
        const relativePath = this.getRelativePath(filePath);
        return this.fileChanges.get(relativePath);
    }

    /**
     * Traverses the directory based on file changes from git diff.
     * If changes are detected, processes only changed files.
     * Otherwise, scans all files in the root directory for TypeScript files.
     *
     * @returns An array of string containing the files to process.
     */
    public traverse(): string[] {
        if (this.fileChanges.size > 0) {
            console.log("Detected Changes:", Array.from(this.fileChanges.values()));

            // Changes are already relative to repo root, filter and convert to absolute paths
            const files = Array.from(this.fileChanges.entries())
                .filter(([file, change]: [string, FileChange]) => {
                    // Skip deleted files
                    if (change.status === 'deleted') {
                        return false;
                    }

                    // Convert file (repo-relative) to absolute path
                    const absolutePath = this.config.toAbsolutePath(file);

                    // // Check if the file is within our target directory
                    // const isInTargetDir = absolutePath.startsWith(
                    //     this.config.absolutePath
                    // );

                    // return (
                    //     isInTargetDir &&
                    //     fs.existsSync(absolutePath) &&
                    //     !this.isExcluded(absolutePath) &&
                    //     path.extname(file) === ".ts"
                    // );
                })
                .map(([file]) => this.config.toAbsolutePath(file));

            console.log("Files to process:", files);
            return files;
        } else {
            console.log(
                "No Changes Detected, Scanning all files in root directory"
            );
            const typeScriptFiles: string[] = [];

            const traverseDirectory = (currentDirectory: string) => {
                // const files = fs.readdirSync(currentDirectory);

                // files.forEach((file) => {
                //     const filePath = path.join(currentDirectory, file);
                //     const stats = fs.statSync(filePath);

                //     if (stats.isDirectory()) {
                //         if (!this.isExcluded(filePath)) {
                //             traverseDirectory(filePath);
                //         }
                //     } else if (stats.isFile() && !this.isExcluded(filePath)) {
                //         if (path.extname(file) === ".ts") {
                //             typeScriptFiles.push(filePath);
                //         }
                //     }
                // });
            };

            traverseDirectory(this.config.absolutePath);
            return typeScriptFiles;
        }
    }

    /**
     * Check if a file path is excluded based on the excluded directories and files
     */
    private isExcluded(absolutePath: string): boolean {
        // Get path relative to the target directory for exclusion checking
        const relativeToTarget = path.relative(
            this.config.absolutePath,
            absolutePath
        );

        // First check forced excluded directories - these are always excluded
        const isInForcedExcludedDir =
            DirectoryTraversal.FORCED_EXCLUDED_DIRS.some(
                (dir) =>
                    absolutePath.includes(`${path.sep}${dir}${path.sep}`) ||
                    absolutePath.includes(`${path.sep}${dir}`) ||
                    absolutePath.startsWith(`${dir}${path.sep}`)
            );

        if (isInForcedExcludedDir) {
            return true;
        }

        // Check if path is in excluded directory
        const isExcludedDir = this.config.excludedDirectories.some(
            (dir) => relativeToTarget.split(path.sep)[0] === dir
        );

        // Check if file is excluded
        const isExcludedFile = this.config.excludedFiles.some(
            (file) => path.basename(absolutePath) === file
        );

        return isExcludedDir || isExcludedFile;
    }
}
