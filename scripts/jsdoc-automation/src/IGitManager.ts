
import type { PrModeFileChange, Repository } from "./types/index.js";

export interface CreatePullRequestOptions {
    title: string;
    body: string;
    head: string;
    base: string;
    labels?: string[];
    reviewers?: string[];
}
/**
 * Manages operations related to interacting with a Git repository using the GitHub API.
 */
// Helper interface definitions
interface CommitFileChange {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
}

interface CommitInfo {
  commit: {
      hash: string;
      date: string;
      message: string;
      author: {
          name: string;
          email: string;
      };
  };
  files: CommitFileChange[];
}

export interface IGitManager {
   
    getFilesInPullRequest(
        pullNumber: number
    ): Promise<PrModeFileChange[]> ;
    
      createBranch(
branchName: string,
        baseBranch: string
    ): Promise<void> ;

    
      commitFile(
        branchName: string,
        filePath: string,
        content: string,
        message: string
    ): Promise<void> ;

      createPullRequest(
        options: CreatePullRequestOptions
    ): Promise<void> ;
}
