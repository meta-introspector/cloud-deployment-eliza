# e3c74f7f:packages_app_package.json:1-31

**Commit:** e3c74f7f969f2541b1dfbd8bbd410b0c28b0c992
**Author:** github-actions[bot]
**Date:** Fri Dec 19 01:03:22 2025 +0000
**File:** packages/app/package.json:1-31
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/app",
  "version": "1.6.6-alpha.7",
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