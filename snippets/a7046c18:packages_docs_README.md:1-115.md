# a7046c18:packages_docs_README.md:1-115

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/README.md:1-115
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# ElizaOS Documentation

Welcome to the official documentation repository for [ElizaOS](https://github.com/elizaos/elizaos) - a powerful framework for building AI agents with memory, planning, and tool use capabilities.

## 📚 About This Documentation

This repository contains the comprehensive documentation for ElizaOS, including:

- **Getting Started** - Quick setup guides and tutorials
- **Core Concepts** - Understanding agents, plugins, and the architecture
- **Deep Dive** - Advanced topics like memory systems, services, and event handling
- **REST Reference** - Complete REST API documentation for all modules
- **Examples** - Real-world implementations and patterns

## Development

### Prerequisites

- Node.js (v23 or higher)
- bun (or npm/yarn)

### Local Development Setup

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview the documentation changes locally:

```bash
bun install -g mint
```

### Running Locally

Navigate to the root of your documentation (where `docs.json` is located) and run:

```bash
mint dev
```

This will start a local development server at `http://localhost:3000` where you can preview your changes in real-time.

### Project Structure

```
docs/
├── rest-reference/      # REST API documentation
├── core-concepts/      # Core concepts and architecture
├── deep-dive/         # Advanced topics
├── images/            # Documentation images
├── logo/              # Logo assets
├── snippets/          # Reusable code snippets
├── docs.json          # Mintlify configuration
├── index.mdx          # Landing page
├── quickstart.mdx     # Quick start guide
└── development.mdx    # Development guide
```

## 📝 Contributing to Documentation

We welcome contributions to improve the ElizaOS documentation! Here's how you can help:

1. **Fork** this repository
2. **Create** a new branch for your changes
3. **Make** your documentation improvements
4. **Test** locally using `mint dev`
5. **Submit** a pull request

### Documentation Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Follow the existing structure and formatting
- Test all code snippets
- Add images/diagrams for complex concepts

## Publishing Changes

Changes are automatically deployed when merged to the main branch. The documentation is hosted using Mintlify's infrastructure.

### Deployment Process

1. Install the Mintlify GitHub App on your repository
2. Push changes to your default branch
3. Changes will be automatically deployed to production

Find the installation link in your [Mintlify dashboard](https://dashboard.mintlify.com).

## 🔧 Troubleshooting

### Common Issues

- **Dev environment not running**
  - Run `mint update` to ensure you have the latest version of the CLI
  - Check that you're in the correct directory with `docs.json`

- **Page loads as 404**
  - Ensure you're running the command in a folder containing `docs.json`
  - Check that your page is properly listed in the navigation

- **Changes not reflecting**
  - Clear your browser cache
  - Restart the development server
  - Check for syntax errors in your MDX files

## 📖 Learn More

- [ElizaOS GitHub Repository](https://github.com/elizaos/elizaos)
- [Mintlify Documentation](https://mintlify.com/docs)
- [MDX Documentation](https://mdxjs.com/)

## 📄 License

This documentation is part of the ElizaOS project. Please refer to the main repository for license information.

---

Built with ❤️ using [Mintlify](https://mintlify.com)
```