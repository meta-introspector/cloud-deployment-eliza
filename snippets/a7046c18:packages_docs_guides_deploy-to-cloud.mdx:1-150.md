# a7046c18:packages_docs_guides_deploy-to-cloud.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/deploy-to-cloud.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Deploy to Eliza Cloud'
description: 'Ship your agent with a single command - infrastructure and monitoring handled for you'
---

## Why Eliza Cloud?

You built an agent. Now you need it running 24/7, accessible from anywhere, with proper monitoring.

The traditional path: write a Dockerfile, configure cloud infrastructure, set up load balancing, create CI/CD pipelines, manage SSL certificates, configure health checks...

**With Eliza Cloud: two commands.**

```bash
elizaos login
elizaos deploy --project-name my-agent
```

That's not a simplified example. That's the entire deployment process.

<CardGroup cols={3}>
  <Card title="5 minutes" icon="clock">
    From code to production URL
  </Card>
  <Card title="Zero config" icon="wand-magic-sparkles">
    No infrastructure setup needed
  </Card>
  <Card title="Built for elizaOS" icon="microchip">
    Optimized for agent workloads
  </Card>
</CardGroup>

Beyond deployment: on-chain agent discovery (ERC-8004), crypto payments (X402), and a marketplace to publish and monetize your agents.

---

## Quick Start

<Steps>
  <Step title="Sign up">
    Create your account at [elizacloud.ai](https://elizacloud.ai)
  </Step>
  <Step title="Login from CLI">
    ```bash
    elizaos login
    ```
    Opens your browser for auth. Your API key is saved automatically.
  </Step>
  <Step title="Deploy">
    ```bash
    elizaos deploy --project-name my-agent
    ```
    First deploy: ~5 min. Updates: ~2 min.
  </Step>
</Steps>

<Tip>
**That's it.** You now have a production agent at `https://{userId}-{project-name}.containers.elizacloud.ai`
</Tip>

---

## What You Get

Every deployment includes:

<CardGroup cols={2}>
  <Card title="Dedicated EC2 Instance" icon="server">
    Your own t4g.small ARM server, not shared resources
  </Card>
  <Card title="HTTPS by Default" icon="lock">
    SSL certificates handled automatically
  </Card>
  <Card title="Health Monitoring" icon="heart-pulse">
    24/7 checks with automatic alerting
  </Card>
  <Card title="Zero-Downtime Updates" icon="rotate">
    Push updates without interruption
  </Card>
  <Card title="Persistent URL" icon="link">
    Same URL across all deployments
  </Card>
  <Card title="Real-time Logs" icon="terminal">
    `elizaos containers logs --follow`
  </Card>
</CardGroup>

Under the hood, the CLI builds your Docker image, pushes it to AWS ECR, and deploys to a dedicated EC2 instance with load balancing configured.

## Customize Your Deployment

The defaults work for most agents. When you need more control:

### Add Environment Variables

```bash
elizaos deploy \
  --project-name my-agent \
  --env "OPENAI_API_KEY=sk-xxx" \
  --env "DATABASE_URL=postgresql://..."
```

### Scale Resources

```bash
elizaos deploy \
  --project-name my-agent \
  --cpu 512 \
  --memory 1024 \
  --desired-count 2  # Multiple instances
```

| Option | Default | Description |
|--------|---------|-------------|
| `--cpu` | 1792 | CPU units (1792 = 1.75 vCPU) |
| `--memory` | 1792 | Memory in MB (1792 = 1.75 GiB) |
| `--desired-count` | 1 | Number of container instances |
| `--port` | 3000 | Container port |

### Update Your Agent

Same command, zero downtime:

```bash
elizaos deploy --project-name my-agent
```

The CLI detects it's an update and rolls out changes without interruption.

---

## Managing Deployments

### View Your Agents

```bash
elizaos containers list
```

### Check Logs

```bash
# Real-time logs
elizaos containers logs --follow

# Last 200 lines
elizaos containers logs --tail 200
```

### Remove a Deployment
```