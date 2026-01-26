# 61d977c5:packages_app_package.json:1-31

**Commit:** 61d977c5b5e49fbb6784afe3b937fe03f14ec53f
**Author:** github-actions[bot]
**Date:** Sat Dec 20 05:10:13 2025 +0000
**File:** packages/app/package.json:1-31
**Novelty Score:** 21.35
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/app",
  "version": "1.7.0-beta.0",
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