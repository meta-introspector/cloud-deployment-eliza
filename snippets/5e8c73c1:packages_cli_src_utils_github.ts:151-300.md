# 5e8c73c1:packages_cli_src_utils_github.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 */
export async function forkRepository(
  token: string,
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/forks`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.status === 202) {
      const forkData = (await response.json()) as GitHubRepoResponse;
      logger.success(
        { src: 'cli', util: 'github', owner, repo, forkName: forkData.full_name },
        'Forked repository'
      );
      return forkData.full_name;
    }

    logger.error(
      { src: 'cli', util: 'github', statusText: response.statusText },
      'Failed to fork repository'
    );
    return null;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Failed to fork repository'
    );
    return null;
  }
}

/**
 * Check if a branch exists in a repository
 */
export async function branchExists(
  token: string,
  owner: string,
  repo: string,
  branch: string
): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/branches/${branch}`, {
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
 * Create a new branch in a repository
 */
export async function createBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  baseBranch = 'main'
): Promise<boolean> {
  try {
    // Get the SHA of the base branch
    let baseResponse = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // If the requested base branch doesn't exist, try to find an alternative branch
    if (baseResponse.status !== 200) {
      logger.warn(
        { src: 'cli', util: 'github', baseBranch },
        'Base branch not found, checking for alternative branches'
      );

      // List available branches
      const branchesResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/branches`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (branchesResponse.status === 200) {
        const branches = (await branchesResponse.json()) as Array<{ name: string }>;
        if (branches && branches.length > 0) {
          // Use the first available branch as base
          const alternativeBranch = branches[0].name;
          logger.info(
            { src: 'cli', util: 'github', alternativeBranch },
            'Using alternative branch as base'
          );

          // Try again with the alternative branch
          baseResponse = await fetch(
            `${GITHUB_API_URL}/repos/${owner}/${repo}/git/ref/heads/${alternativeBranch}`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
        } else {
          // No branches found, could be a fresh fork - create initial empty commit and branch
          logger.info(
            { src: 'cli', util: 'github' },
            'No branches found in repository, creating initial commit'
          );

          // Create a blob for empty README
          const blobResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/blobs`, {
            method: 'POST',
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: '# Repository initialized by Eliza CLI',
              encoding: 'utf-8',
            }),
          });

          if (blobResponse.status !== 201) {
            logger.error({ src: 'cli', util: 'github' }, 'Failed to create initial blob');
            return false;
          }

          const blobData = (await blobResponse.json()) as GitHubBlobResponse;
          const blobSha = blobData.sha;

          // Create a tree with the README
          const treeResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/trees`, {
            method: 'POST',
```