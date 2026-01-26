# 6231b5a9:packages_app_package.json:1-31

**Commit:** 6231b5a9342b8a787b1eb43b757d096edc1d7577
**Author:** github-actions[bot]
**Date:** Wed Jan 7 10:47:26 2026 +0000
**File:** packages/app/package.json:1-31
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/app",
  "version": "1.7.1-alpha.10",
  "type": "module",
  "scripts": {
    "start": "tauri dev",
    "build": "tsc && vite build",
    "test": "bun test src/__tests__",
    "build:tauri": "tauri build",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src",
    "lint": "eslint src/ && prettier --write ./src",
    "lint:check": "eslint src/"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@elizaos/config": "workspace:*",
    "@tauri-apps/cli": "^2.6.2",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^5.1.1",
    "prettier": "^3.7.4",
    "typescript": "^5.9.3",
    "vite": "^7.2.6"
  },
  "gitHead": "b165ad83e5f7a21bc1edbd83374ca087e3cd6b33"
}
```