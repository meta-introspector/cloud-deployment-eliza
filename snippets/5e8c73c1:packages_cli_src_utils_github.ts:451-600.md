# 5e8c73c1:packages_cli_src_utils_github.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    if (response.status === 200) {
      const data = (await response.json()) as GitHubFileResponse;
      // GitHub API returns content as base64
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create or update a file in a repository
 */
export async function updateFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch = 'main'
): Promise<boolean> {
  try {
    // Check if file already exists
    const existingContent = await getFileContent(token, owner, repo, path, branch);
    // GitHub API behavior: PUT works more reliably than POST for creating files
    // in directories that may not exist yet, so we always use PUT
    const method = 'PUT';

    // Get the SHA if the file exists
    let sha: string | undefined;
    if (existingContent !== null) {
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 200) {
        const data = (await response.json()) as GitHubFileResponse;
        sha = data.sha;
      }
    }

    // Full URL for debugging
    const fileUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;
    logger.info({ src: 'cli', util: 'github', fileUrl }, 'Updating file');

    // Full request body for debugging
    const requestBody = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha,
    };
    logger.info({ src: 'cli', util: 'github', method, branch, hasSha: !!sha }, 'Request details');

    // Update or create the file
    const response = await fetch(fileUrl, {
      method,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200 || response.status === 201) {
      logger.success(
        { src: 'cli', util: 'github' },
        existingContent !== null ? 'File updated' : 'File created'
      );
      return true;
    }

    // Log the full error response for debugging
    const errorBody = await response.text();
    logger.error(
      { src: 'cli', util: 'github', status: response.status, statusText: response.statusText },
      'Failed to update file'
    );
    logger.error({ src: 'cli', util: 'github', errorBody }, 'Response body');

    // Check for common GitHub API errors
    if (response.status === 404) {
      logger.error(
        { src: 'cli', util: 'github', owner, repo, path },
        'Repository or path not found'
      );
      // Try to check if the repo exists
      const repoCheck = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (repoCheck.status === 404) {
        logger.error(
          { src: 'cli', util: 'github', owner, repo },
          'Repository does not exist or is not accessible'
        );
      } else {
        logger.info(
          { src: 'cli', util: 'github' },
          'Repository exists, but path is likely invalid'
        );
      }
    }

    return false;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Error updating file'
    );
    return false;
  }
}

/**
 * Create a pull request
 */
export async function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base = 'main'
): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
```