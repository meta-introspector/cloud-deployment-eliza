# 5e8c73c1:packages_cli_src_utils_github.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

    if (userResponse.status !== 200) {
      return { success: false, message: 'Failed to get authenticated user information' };
    }

    const userData = await userResponse.json();
    const username = userData.login;

    // First check if the repository already exists
    const checkResponse = await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    // If repo exists, return success
    if (checkResponse.status === 200) {
      const data = await checkResponse.json();
      logger.info(
        { src: 'cli', util: 'github', repoUrl: data.html_url },
        'Repository already exists'
      );
      return { success: true, repoUrl: data.html_url };
    }

    // If status is not 404, there might be another issue
    if (checkResponse.status !== 404) {
      const errorData = await checkResponse.json();
      return {
        success: false,
        message: `Error checking repository: ${checkResponse.status} ${checkResponse.statusText} - ${errorData.message || 'Unknown error'}`,
      };
    }

    // If we get here, repo doesn't exist on GitHub (404), so create it
    const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description,
        private: isPrivate,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        auto_init: false, // Don't initialize with README to avoid conflicts
        default_branch: 'main', // Explicitly set main as default branch
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      const repoUrl = data.html_url;

      // Wait a moment for GitHub to initialize the repository
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add topics to the repository
      if (topics.length > 0) {
        await fetch(`${GITHUB_API_URL}/repos/${data.full_name}/topics`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.mercy-preview+json', // Required for topics API
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            names: topics,
          }),
        });
      }

      logger.success({ src: 'cli', util: 'github', repoUrl }, 'Repository created');
      return { success: true, repoUrl };
    }

    const errorData = await response.json();
    return {
      success: false,
      message: `Failed to create repository: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating repository: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Push local code to GitHub repository
 */
export async function pushToGitHub(
  cwd: string,
  repoUrl: string,
  branch = 'main'
): Promise<boolean> {
  try {
    // Check if git is initialized
    const gitDirExists = existsSync(path.join(cwd, '.git'));

    // If we have a git directory, check if it has the correct remote
    let hasCorrectRemote = false;
    if (gitDirExists) {
      try {
        const { stdout: remoteUrl } = await bunExecSimple('git', ['remote', 'get-url', 'origin'], {
          cwd,
        });
        // Check if the remote URL matches our target (ignoring the token part)
        const sanitizedRepoUrl = repoUrl.replace(/https:\/\/.*?@/, 'https://');
        const sanitizedRemoteUrl = remoteUrl.replace(/https:\/\/.*?@/, 'https://');
        hasCorrectRemote = sanitizedRemoteUrl.includes(
          sanitizedRepoUrl.replace(/^https:\/\/.*?@/, '')
        );
      } catch (error) {
        // Remote doesn't exist or command failed, will set up remote later
        hasCorrectRemote = false;
      }
    }

    // If git is not initialized or remote doesn't match, start fresh
    if (!gitDirExists || !hasCorrectRemote) {
      if (gitDirExists) {
        logger.info(
          { src: 'cli', util: 'github' },
          'Existing git repository has incorrect remote, reinitializing'
        );
        await bunExec('rm', ['-rf', '.git'], { cwd });
      }

      await bunExec('git', ['init'], { cwd });
      // Explicitly create and switch to main branch
      await bunExec('git', ['checkout', '-b', 'main'], { cwd });
      logger.info({ src: 'cli', util: 'github' }, 'Git repository initialized with main branch');

      // Add remote
      await bunExec('git', ['remote', 'add', 'origin', repoUrl], { cwd });
      logger.info(
        { src: 'cli', util: 'github', remote: repoUrl.replace(/\/\/.*?@/, '//***@') },
        'Added remote'
      );
    } else {
      // Make sure we're on the main branch
      try {
        await bunExec('git', ['rev-parse', '--verify', branch], { cwd });
```