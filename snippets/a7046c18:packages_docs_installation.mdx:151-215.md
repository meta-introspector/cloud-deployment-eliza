# a7046c18:packages_docs_installation.mdx:151-215

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/installation.mdx:151-215
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ```bash Git Bash
    bun install -g @elizaos/cli
    ```
    
    **Common Windows-specific issues:**
    - If `node` command not found: Node wasn't added to PATH correctly, restart Git Bash
    - If scripts fail: Make sure you're using Git Bash, not PowerShell or CMD
    - If permission errors: Run Git Bash as Administrator when installing global packages
  </Accordion>

  <Accordion icon="wrench" title="CLI Installation Issues">
    **If elizaOS CLI fails to install:**
    - Clear Bun cache: `bun pm cache rm`
    - Try reinstalling: `bun i -g @elizaos/cli`
    
    **If "command not found" after installation:**
    - The CLI may not be in your PATH. Add Bun's global bin directory to PATH:
    ```bash Terminal
    # Add to ~/.bashrc or ~/.zshrc
    export PATH="$HOME/.bun/bin:$PATH"
    ```
    - Then restart your terminal or run `source ~/.bashrc` (or `~/.zshrc`)
    
    **Permission errors during global install:**
    - macOS/Linux: Use `sudo bun i -g @elizaos/cli`
    - Windows: Run Git Bash as Administrator
  </Accordion>

  <Accordion icon="gear" title="CLI Version Conflicts/Mismatches">
    **If `elizaos --version` shows an older version despite installing a newer one:**
    
    This usually happens when elizaOS CLI was installed with different package managers (npm, pnpm, bun), creating version conflicts.
    
    **Solution - Clean install with bun only:**
    ```bash Terminal
    # Remove from all package managers
    bun remove -g @elizaos/cli
    npm uninstall -g @elizaos/cli
    pnpm remove -g @elizaos/cli
    
    # Verify removal
    which elizaos
    # Should return nothing or "not found"
    
    # Fresh install with bun only
    bun i -g @elizaos/cli
    
    # Verify correct version
    elizaos --version
    ```
    
    **If you get a PATH warning:**
    ```bash Terminal
    # Add bun's global bin to your PATH
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
    # or for zsh
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
    
    # Reload your shell configuration
    source ~/.bashrc  # or source ~/.zshrc
    ```
    
    **Important:** Always use bun for elizaOS CLI installation to avoid conflicts. Don't mix package managers.
  </Accordion>
</AccordionGroup>
```