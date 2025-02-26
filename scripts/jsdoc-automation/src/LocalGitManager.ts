
import type {CreatePullRequestOptions } from "./IGitManager.js"
import dotenv from "dotenv";
import * as git from "simple-git";
import type { PrModeFileChange, Repository } from "./types/index.js";

dotenv.config();

/**
 * Manages operations related to interacting with a Git repository using the GitHub API.
 */
export class LocalGitManager {
    git: git.SimpleGit;


    /**
     * Constructor for a class that initializes the Octokit instance with the provided Repository and checks if the GITHUB_ACCESS_TOKEN is set in the environment.
     * @param {Repository} repository - The repository instance to use
     * @throws {Error} Throws an error if the GITHUB_ACCESS_TOKEN is not set
     */
    constructor(public repository: Repository) {
        
        this.git = git.simpleGit();
    }

    public async getFilesInPullRequest3(
        pullNumber: number
    ): Promise<PrModeFileChange[]> {

        // git checkout branch 
        // then 
        const log = await this.git.log({
            //from: "main",
        //    to: `origin/pull/${pullNumber}/head`,
        maxCount: 100,
        });

            // resolve the following information from the current branch
        console.log(log);
        return []
// //        return data.map((file: any) => ({
//             filename: file.filename,
//             status: file.status,
//             additions: file.additions,
//             deletions: file.deletions,
//             changes: file.changes,
//             contents_url: file.contents_url,
//         }));
    }
    /**
     * Gets detailed information about the last N commits including their diffs
     * @param count The number of commits to retrieve
     * @returns Promise<Array<CommitInfo>> Array of commit information with diffs
     */
    public async getLastNCommitDiffs(count: number) {
        try {
            // Get the last N commits
            const log = await this.git.log({
                maxCount: count,
                format: {
                    hash: '%H',
                    date: '%ai',
                    message: '%s',
                    author_name: '%an',
                    author_email: '%ae'
                }
            });
    
            // For each commit, get its detailed diff information
            const commitDiffs = await Promise.all(log.all.map(async (commit) => {
                // Get the diff for this specific commit
                const diff = await this.git.diff([
                    `${commit.hash}^..${commit.hash}`,
                    '--numstat'
                ]);
    
                // Parse the diff output
                const files = diff.split('\n')
                    .filter(line => line.trim().length > 0)
                    .map(line => {
                        const [additions, deletions, filename] = line.split('\t');
                        return {
                            filename,
                            additions: parseInt(additions) || 0,
                            deletions: parseInt(deletions) || 0,
                            changes: (parseInt(additions) || 0) + (parseInt(deletions) || 0)
                        };
                    });
    
                // Get the detailed file status for this commit
                const status = await this.git.diff([
                    `${commit.hash}^..${commit.hash}`,
                    '--name-status'
                ]);
    
                // Parse the status output and merge with file information
                const fileStatuses = new Map(
                    status.split('\n')
                        .filter(line => line.trim().length > 0)
                        .map(line => {
                            const [status, filename] = line.split('\t');
                            return [filename, this.parseGitStatus(status)];
                        })
                );
    
                // Merge the diff and status information
                const filesWithStatus = files.map(file => ({
                    ...file,
                    status: fileStatuses.get(file.filename) || 'modified'
                }));
    
                return {
                    commit: {
                        hash: commit.hash,
                        date: commit.date,
                        message: commit.message,
                        author: {
                            name: commit.author_name,
                            email: commit.author_email
                        }
                    },
                    files: filesWithStatus
                };
            }));
    
            return commitDiffs;
        } catch (error) {
            console.error('Error getting commit diffs:', error);
            throw error;
        }
    }
    
    
    public async getFilesInPullRequest(
        pullNumber: number
    ): Promise<PrModeFileChange[]> {
        const commitDiffs = await this.getLastNCommitDiffs(10);
        return commitDiffs.flatMap(commit => commit.files.map(file => ({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            contents_url: '' // You might want to construct this based on your repository URL
        })));
    }
    
    public async getFilesInPullRequest2(
        pullNumber: number
    ): Promise<PrModeFileChange[]> {
        try {
            // Fetch the pull request branch
            await this.git.fetch(['origin', `pull/${pullNumber}/head:pr-${pullNumber}`]);
            
            // Checkout the PR branch
           await this.git.checkout(`pr-${pullNumber}`);
            
            // Get the base branch (usually main or master)
            const baseBranch = 'develop'; // You might want to make this configurable
            
            // Get the diff between base branch and PR branch
            const diff = await this.git.diff([`${baseBranch}...pr-${pullNumber}`, '--name-status']);
            
            // Parse the diff output
            const files = diff.split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => {
                    const [status, filename] = line.split('\t');
                    
                    return {
                        filename,
                        status: this.parseGitStatus(status),
                        additions: 0,  // Will be populated below
                        deletions: 0,  // Will be populated below
                        changes: 0,    // Will be populated below
                        contents_url: '' // You might want to construct this based on your repository URL
                    };
                });
    
            // Get detailed stats for each file
            for (const file of files) {
                const stats = await this.git.raw([
                    'diff',
                    '--numstat',
                    `${baseBranch}...pr-${pullNumber}`,
                    '--',
                    file.filename
                ]);
                
                if (stats) {
                    const [additions, deletions] = stats.split('\t');
                    file.additions = parseInt(additions) || 0;
                    file.deletions = parseInt(deletions) || 0;
                    file.changes = file.additions + file.deletions;
                }
            }
    
            // Cleanup: checkout back to original branch
            await this.git.checkout(baseBranch);
            
            return files;
        } catch (error) {
            console.error('Error getting files in pull request:', error);
            throw error;
        }
    }
    
    private parseGitStatus(status: string): string {
        const statusMap: { [key: string]: string } = {
            'A': 'added',
            'M': 'modified',
            'D': 'deleted',
            'R': 'renamed',
            'C': 'copied',
            'U': 'updated'
        };
        
        return statusMap[status.charAt(0)] || 'modified';
    }
    

    /**
     * Creates a new branch in the GitHub repository using the given branch name and base branch.
     *
     * @param {string} branchName - The name of the new branch to be created.
     * @param {string} baseBranch - The name of the branch to base the new branch off of.
     * @returns {Promise<void>} - A Promise that resolves when the branch is successfully created.
     */
    public async createBranch(
        branchName: string,
        baseBranch: string
    ): Promise<void> {
       
    }

    /**
     * Asynchronously commits a file to a repository using the GitHub API.
     *
     * @param {string} branchName - The name of the branch to commit the file to.
     * @param {string} filePath - The path of the file to commit.
     * @param {string} content - The content of the file to commit.
     * @param {string} message - The commit message.
     * @returns {Promise<void>} A promise that resolves when the file is successfully committed.
     */
    public async commitFile(
        branchName: string,
        filePath: string,
        content: string,
        message: string
    ): Promise<void> {
       
    }

    /**
     * Create a pull request using the provided options.
     * @param {CreatePullRequestOptions} options - The options for creating the pull request.
     * @returns {Promise<void>} A Promise that resolves once the pull request is successfully created.
     */
    public async createPullRequest(
        options: CreatePullRequestOptions
    ): Promise<void> {
     
    }
}
