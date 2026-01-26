# 5e8c73c1:packages_cli_src_utils_github.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { logger } from '@elizaos/core';
import { existsSync } from 'node:fs';
import { bunExecSimple, bunExec } from './bun-exec.js';
import { UserEnvironment } from './user-environment';
import * as clack from '@clack/prompts';

const GITHUB_API_URL = 'https://api.github.com';

interface GitHubUserResponse {
  login: string;
  id?: number;
  avatar_url?: string;
  name?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

interface GitHubRepoResponse {
  full_name: string;
  id?: number;
  html_url?: string;
  [key: string]: string | number | boolean | undefined;
}

interface GitHubBranchResponse {
  object: {
    sha: string;
    type?: string;
    url?: string;
  };
  ref?: string;
  url?: string;
  [key: string]:
    | string
    | number
    | boolean
    | { sha: string; type?: string; url?: string }
    | undefined;
}

interface GitHubFileResponse {
  content: string;
  sha: string;
  size?: number;
  encoding?: string;
  name?: string;
  path?: string;
  [key: string]: string | number | boolean | undefined;
}

interface GitHubPullRequestResponse {
  html_url: string;
  id?: number;
  number?: number;
  state?: string;
  title?: string;
  [key: string]: string | number | boolean | undefined;
}

interface GitHubBlobResponse {
  sha: string;
  size?: number;
  url?: string;
  [key: string]: string | number | boolean | undefined;
}

interface GitHubTreeResponse {
  sha: string;
  url?: string;
  tree?: Array<{
    path?: string;
    mode?: string;
    type?: string;
    sha?: string;
  }>;
  [key: string]:
    | string
    | number
    | boolean
    | Array<{ path?: string; mode?: string; type?: string; sha?: string }>
    | undefined;
}

interface GitHubCommitResponse {
  sha: string;
  url?: string;
  author?: {
    name?: string;
    email?: string;
    date?: string;
  };
  message?: string;
  [key: string]:
    | string
    | number
    | boolean
    | { name?: string; email?: string; date?: string }
    | undefined;
}

/**
 * Validate a GitHub token with the API
 */
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.status === 200) {
      const userData = (await response.json()) as GitHubUserResponse;
      logger.success({ src: 'cli', util: 'github', username: userData.login }, 'Authenticated');
      return true;
    }

    return false;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Failed to validate GitHub token'
    );
    return false;
  }
}

/**
 * Check if a fork exists for a given repository
 */
export async function forkExists(token: string, repo: string, username: string): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${username}/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Fork a repository
```