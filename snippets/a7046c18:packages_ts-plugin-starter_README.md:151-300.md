# a7046c18:packages_ts-plugin-starter_README.md:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/README.md:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- Test complete user scenarios
- Validate plugin behavior in production-like conditions

```typescript
{
  name: 'service_lifecycle_test',
  fn: async (runtime) => {
    // Get the real service
    const service = runtime.getService('starter');
    if (!service) {
      throw new Error('Service not initialized');
    }

    // Test real behavior
    await service.stop();
    // Verify cleanup happened...
  },
}
```

### Best Practices

1. **Use Component Tests for**:

   - Algorithm logic
   - Data transformations
   - Input validation
   - Error handling

2. **Use E2E Tests for**:

   - User scenarios
   - Action execution flows
   - Provider data integration
   - Service lifecycle
   - Plugin interactions

3. **Test Organization**:
   - Keep related tests together
   - Use descriptive test names
   - Include failure scenarios
   - Document complex test setups

The comprehensive E2E test documentation in `src/__tests__/e2e/README.md` provides detailed examples and patterns for writing effective tests.

## Publishing & Continuous Development

### Initial Setup

Before publishing your plugin, ensure you meet these requirements:

1. **npm Authentication**

   ```bash
   npm login
   ```

2. **GitHub Repository**

   - Create a public GitHub repository for this plugin
   - Add the 'elizaos-plugins' topic to the repository
   - Use 'main' as the default branch

3. **Required Assets**
   - Add images to the `images/` directory:
     - `logo.jpg` (400x400px square, <500KB)
     - `banner.jpg` (1280x640px, <1MB)

### Initial Publishing

```bash
# Test your plugin meets all requirements
elizaos publish --test

# Publish to npm + GitHub + registry (recommended)
elizaos publish
```

This command will:

- Publish your plugin to npm for easy installation
- Create/update your GitHub repository
- Submit your plugin to the elizaOS registry for discoverability

### Continuous Development & Updates

**Important**: After your initial publish with `elizaos publish`, all future updates should be done using standard npm and git workflows, not the elizaOS CLI.

#### Standard Update Workflow

1. **Make Changes**

   ```bash
   # Edit your plugin code
   elizaos dev  # Test locally with hot-reload
   ```

2. **Test Your Changes**

   ```bash
   # Run all tests
   elizaos test

   # Run specific test types if needed
   elizaos test component  # Component tests only
   elizaos test e2e       # E2E tests only
   ```

3. **Update Version**

   ```bash
   # Patch version (bug fixes): 1.0.0 → 1.0.1
   npm version patch

   # Minor version (new features): 1.0.1 → 1.1.0
   npm version minor

   # Major version (breaking changes): 1.1.0 → 2.0.0
   npm version major
   ```

4. **Publish to npm**

   ```bash
   npm publish
   ```

5. **Push to GitHub**
   ```bash
   git push origin main
   git push --tags  # Push version tags
   ```

#### Why Use Standard Workflows?

- **npm publish**: Directly updates your package on npm registry
- **git push**: Updates your GitHub repository with latest code
- **Automatic registry updates**: The elizaOS registry automatically syncs with npm, so no manual registry updates needed
- **Standard tooling**: Uses familiar npm/git commands that work with all development tools

### Alternative Publishing Options (Initial Only)

```bash
# Publish to npm only (skip GitHub and registry)
elizaos publish --npm

# Publish but skip registry submission
elizaos publish --skip-registry

# Generate registry files locally without publishing
```