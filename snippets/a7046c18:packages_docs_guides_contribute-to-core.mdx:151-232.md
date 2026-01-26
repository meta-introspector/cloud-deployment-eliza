# a7046c18:packages_docs_guides_contribute-to-core.mdx:151-232

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/contribute-to-core.mdx:151-232
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- **Plugin repositories:** Target `1.x` branch (or check the default branch)

**Create a detailed pull request** with:
- Clear description of what the PR does
- Link to the related issue (`Fixes #123`)
- List of specific changes made
- Check that CI/GitHub Actions are passing
- Screenshots if there are UI changes

### Collaborate During Review

- Respond to code review comments promptly
- Make requested changes in additional commits
- Be open to feedback and iteration

### Code Quality Standards

**What we look for:**
- Bug fixes with clear reproduction steps
- Performance improvements with benchmarks  
- Documentation improvements and corrections
- Test coverage improvements
- Security fixes

**Technical requirements:**
- **TypeScript**: All code must be properly typed
- **Testing**: New features require tests, bug fixes should include regression tests
- **Documentation**: Update relevant documentation for any user-facing changes
- **Linting**: Code must pass all linting checks
- **Commit Messages**: Use clear, descriptive commit messages

---

## Step 3: Get Connected

### Join Discord for Development

Connect with core developers and other contributors:

**[Join elizaOS Discord](https://discord.gg/ai16z)**

Key channels for contributors:
- **💬 #coders** - Development discussions and questions
- **💻 #tech-support** - Help others troubleshoot and get help yourself

### Communicate Before Major Work

For significant contributions:

1. **Post in 💬 #coders** about your planned contribution
2. **Share your approach** before implementing large features
3. **Ask questions** - the community is helpful and welcoming

<Tip>
Core developers are active in Discord and can provide guidance on whether your planned contribution aligns with project goals.
</Tip>

### Build Community Connections

- Participate in discussions and help answer questions
- Share your progress and learn from others
- Connect with the core devs & other community contributors
- Stay updated on project direction and roadmap

---

## See Also

<CardGroup cols={2}>
  <Card title="Create a Plugin" icon="puzzle-piece" href="/guides/create-a-plugin">
    Build your own plugins to contribute to the ecosystem
  </Card>
  <Card title="CLI Reference" icon="terminal" href="/cli-reference/overview">
    Master the development tools for efficient contribution
  </Card>
  <Card title="Test a Project" icon="flask" href="/guides/test-a-project">
    Learn comprehensive testing strategies for your contributions
  </Card>
  <Card title="Join Discord" icon="users" href="https://discord.gg/ai16z">
    Connect with core developers and the contributor community
  </Card>
</CardGroup>
```