# a7046c18:packages_docs_guides_publish-a-plugin.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/publish-a-plugin.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Publish a Plugin'
description: 'Publish your elizaOS plugin to the elizaOS registry'
---

<Tip>
  **Video Tutorial**: [**Create + Publish Your Own Plugin**](https://www.youtube.com/watch?v=3wVxXMwSzX4&list=PLrjBjP4nU8ehOgKAa0-XddHzE0KK0nNvS&index=6)
</Tip>

<Note>
This guide assumes you have a working plugin. If you need to create one first, see [Create a Plugin](/guides/create-a-plugin)
</Note>

Once you've built and tested your plugin locally, you'll want to publish it so others can discover and use it. You'll need an npm account and GitHub account for authentication.

---

## Step 1: Prepare for Publishing

### Navigate to your plugin

Start from your working plugin directory. If you followed the [Create a Plugin](/guides/create-a-plugin) guide:

```bash Terminal
cd plugin-fal-ai
```

### Verify plugin requirements

Your plugin needs these key elements for registry acceptance:

**Required files:**
```
plugin-fal-ai/
├── src/
│   └── index.ts         # Your plugin code
├── images/              # Registry assets 
│   ├── logo.jpg        # 400x400px, max 500KB
│   └── banner.jpg      # 1280x640px, max 1MB  
├── package.json         # Plugin metadata
├── README.md           # Documentation
└── dist/               # Built files (from `bun run build`)
```

**What the publish command validates:**
- `name` starts with `plugin-` (auto-added by CLI if missing)
- Custom `description` (not the default generated placeholder)
- Required images in `images/` directory

<Steps>
  <Step title="Add required images">
    Create an `images/` directory if it doesn't exist:
    
    ```bash Terminal
    mkdir -p images
    ```
    
    Add these two custom images for your plugin's branding on the registry:
    - **`logo.jpg`** - 400x400px square logo (max 500KB)
    - **`banner.jpg`** - 1280x640px banner (max 1MB)
    
    <Tip>
    Use high-quality images that represent your plugin's functionality clearly. The logo will appear in plugin listings at various sizes.
    </Tip>
  </Step>

  <Step title="Update package.json description">
    Replace the default generated description with something descriptive:
    
    ```json package.json
    {
      "name": "plugin-fal-ai",
      "version": "1.0.0",
      "description": "ElizaOS plugin for fal-ai", // [!code --]
      "description": "Generate videos from text using fal.ai MiniMax Hailuo-02 model", // [!code ++]
      "keywords": ["plugin", "elizaos"]
    }
    ```
  </Step>

  <Step title="Build your plugin">
    Ensure your plugin is built and ready:
    
    ```bash Terminal
    bun run build
    ```
    
    This creates the `dist/` folder that npm will publish.
  </Step>
</Steps>

---

## Step 2: Check authentication

Make sure you're logged into both npm and GitHub:

### Check npm login

<Steps>
  <Step title="Check current npm login">
    ```bash Terminal
    npm whoami
    ```
    
    If you see your username, you're already logged in. If you see an error, continue to the next step.
  </Step>

  <Step title="Login to npm (if needed)">
    ```bash Terminal
    npm login
    ```
    
    Follow the prompts to enter your:
    - Username
    - Password  
    - Email address
    - One-time password (if 2FA is enabled)
  </Step>
</Steps>

### Check GitHub authentication

```bash Terminal
gh auth status
```

If you see your GitHub username, you're logged in. If you see an error or "not logged in":

```bash Terminal
gh auth login
```

<Note>
If `gh` command is not found, you'll need to install GitHub CLI from [cli.github.com](https://cli.github.com) or the publish command will prompt you to create a token manually.
</Note>


---

## Step 3: Test Publishing (Dry Run)

Before actually publishing, test the entire process to catch any issues.

### Run publish test

```bash Terminal
elizaos publish --test
```

```