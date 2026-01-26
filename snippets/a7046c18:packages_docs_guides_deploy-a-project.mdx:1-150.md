# a7046c18:packages_docs_guides_deploy-a-project.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/deploy-a-project.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Deploy a Project'
description: 'From localhost to production in 5 minutes'
---

**Your agent works locally. Now what?** Getting it live shouldn't require a DevOps degree.

<Tip>
  **Video Tutorial**: [**Deploying Your Agent to a TEE**](https://www.youtube.com/watch?v=paoryBje404&list=PLrjBjP4nU8ehOgKAa0-XddHzE0KK0nNvS&index=7)
</Tip>

## Eliza Cloud

**Two commands. That's it.**

```bash
elizaos login
elizaos deploy --project-name my-agent
```

No Dockerfile to write. No cloud console. No load balancer config. No CI/CD pipeline.

You get a production URL in ~5 minutes, with automatic HTTPS, health monitoring, and zero-downtime updates built in.

Beyond deployment: on-chain agent discovery (ERC-8004), crypto payments (X402), and a marketplace to publish and monetize your agents.

<Card title="Get Started with Eliza Cloud" icon="rocket" href="/guides/deploy-to-cloud">
  Full guide: auth, custom resources, logs, troubleshooting
</Card>

---

## Other Options

Need more control? Here's how Eliza Cloud compares:

| | Eliza Cloud | Railway/Render | Self-Hosted |
|---|:---:|:---:|:---:|
| **Setup time** | 5 min | 15-30 min | 1-2 hours |
| **Commands to deploy** | 2 | 10+ steps | 20+ steps |
| **Docker knowledge** | Not needed | Basic | Required |
| **Server management** | None | None | All on you |
| **Scaling** | Automatic | Automatic | Manual |
| **elizaOS optimized** | ✅ | ❌ | ❌ |

<Note>
**For Advanced Users:** If you're experienced with server administration and networking, you can deploy elizaOS like any Node.js application using your preferred infrastructure setup. The sections below are for developers looking for guided deployment paths.
</Note>

---

## Option 1: Managed Cloud

The easiest deployment method, best for rapid prototyping. These platforms handle all of the complicated stuff automatically. This is a good option if you:

- are a beginner, 
- don't know how to use Docker/VPS services (and don't want to learn)
- aren't expecting a huge amount of traffic, 
- have a relatively simple agent, or 
- are price insensitive

<Note>
**Cost Reality Check:** A simple agent might cost ~$20 dollars per month, but as you scale up, the costs can quickly balloon. For this reason, it's smart to set spending threshholds and closely monitor resource usage. 
</Note>

### Pros & Cons

| ✅ Pros | ❌ Cons |
|---------|---------|
| **Zero server management** - No Linux, Docker, or infrastructure knowledge needed | **Variable costs** - Pricing based on usage (CPU, RAM, bandwidth, requests) |
| **Deploy in minutes** - Push to GitHub, connect your repo, and you're live | **Can get expensive** - Heavy traffic or processing can push bills really high |
| **Automatic everything** - SSL certificates, scaling, updates, backups | **Less control** - Limited customization of infrastructure |
| **Great developer experience** - Built-in logs, metrics, rollbacks | **Vendor lock-in** - Harder to migrate to other platforms |
| **Free tiers** - Most platforms offer generous free plans to start | **Resource limits** - May not handle very high-performance requirements |

Here are our top managed service recommendations:

### Railway (Recommended)

[Railway website](https://railway.com?referralCode=-rye7A) | [Railway docs](https://docs.railway.app)

Railway is a solid, preferred option. They offer a free Trial plan with $5 of credits which is more than enough to test out. It also re-deploys everytime you push a change to Github, which is convenient. Here's the steps from project creation => deployment:

<Steps>
  <Step title="Create your project">
    ```bash Terminal
    elizaos create my-agent --type project
    cd my-agent
    ```
  </Step>

  <Step title="Push to GitHub repo">
    Create a GitHub repository and push your code. Choose one approach:
    
    **Option A: Public Repository (Recommended)**
    - Create a PUBLIC GitHub repository
    - Keep `.env` in your `.gitignore` (stays secure)
    - You'll add environment variables in Railway dashboard (Step 5)
    
    **Option B: Private Repository** 
    - Create a PRIVATE GitHub repository
    - Remove `.env` from your `.gitignore` 
    - Commit your `.env` file (secure since repo is private)
    - ✅ **Skip Step 5** - Railway will use your committed .env file
    
    <Note>
    Both approaches work well. Public repos are more common for open-source projects, while private repos let you skip the environment variables step.
    </Note>
  </Step>

  <Step title="Sign up for Railway">
    1. Go to [railway.com](https://railway.com)
    2. Click **"Sign in"** and sign up with your GitHub account
    
    <img src="/images/railway-auth.png" alt="Railway GitHub OAuth login screen" />
  </Step>

  <Step title="Deploy new project">
    1. Click **"Deploy New Project"**
    2. Select **"GitHub Repo"**
    3. Select your project's GitHub repository from the list
    
    <img src="/images/railway-new-proj.png" alt="Railway new project selection screen" />
    
    <Warning>
    If you used Option A (Public Repository) and Railway starts auto-deploying immediately, **stop the deployment** - we need to add environment variables first! If you used Option B (Private Repository), you can let it deploy.
    </Warning>
  </Step>

  <Step title="Add environment variables">
    **Skip this step if you used Option B (Private Repository) - your .env file is already committed!**
    
    For Option A (Public Repository), add your environment variables in Railway:
    
    1. Click on your service → **Variables** tab

    <img src="/images/railway-env.png" alt="Railway environment variables interface" />

    2. Add the variables your project needs:
    
    ```bash env
    # If your project has a frontend/web UI
    ELIZA_UI_ENABLE=true
    
    # If using Postgres (recommended for production)
    POSTGRES_URL=your_postgres_connection_string
    
    # Everything else in your .env
    OPENAI_API_KEY=your_openai_key
    DISCORD_APPLICATION_ID=your_app_id
```