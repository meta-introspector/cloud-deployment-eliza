# a7046c18:README.md:151-221

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** README.md:151-221
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Use elizaOS agents directly in your applications without the CLI or web interface.

```bash
git clone https://github.com/elizaos/eliza.git
cd eliza/examples

# Interactive chat
OPENAI_API_KEY=your_key bun run standalone-cli-chat.ts

# Basic message processing
OPENAI_API_KEY=your_key bun run standalone.ts
```

## 🏛️ Architecture Overview

Eliza is a monorepo that contains all the packages needed to run the entire platform.

```
/
├── packages/
│   ├── server/         # Core backend server (Express.js)
│   ├── client/         # Frontend web interface (React)
│   ├── cli/            # Command-line tool for managing projects
│   ├── core/           # Shared utilities and functions
│   ├── app/            # Cross-platform desktop app (Tauri)
│   ├── plugin-bootstrap/ # Core communication and event handling plugin
│   ├── plugin-sql/     # Database integration (Postgres, PGLite)
│   └── ...             # Other plugins and project starters
└── ...
```

- **`@elizaos/server`**: The Express.js backend that runs your agents and exposes the API.
- **`@elizaos/client`**: The React-based web UI for managing and interacting with your agents.
- **`@elizaos/cli`**: The central tool for scaffolding, running, and managing your projects.
- **`@elizaos/plugin-bootstrap`**: The mandatory core plugin that handles message processing and basic agent actions.

## 🤝 How to Contribute

We welcome contributions from the community! Please read our `CONTRIBUTING.md` guide to get started.

- **Report a Bug**: Open an issue using the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template.
- **Request a Feature**: Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template.
- **Submit a Pull Request**: Please open an issue first to discuss your proposed changes.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🎓 Citation

If you use Eliza in your research, please cite our paper:

```bibtex
@article{walters2025eliza,
  title={Eliza: A Web3 friendly AI Agent Operating System},
  author={Walters, Shaw and Gao, Sam and Nerd, Shakker and Da, Feng and Williams, Warren and Meng, Ting-Chien and Han, Hunter and He, Frank and Zhang, Allen and Wu, Ming and others},
  journal={arXiv preprint arXiv:2501.06781},
  year={2025}
}
```

## Contributors

<a href="https://github.com/elizaos/eliza/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=elizaos/eliza" alt="Eliza project contributors" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=elizaos/eliza&type=Date)](https://star-history.com/#elizaos/eliza&Date)
```