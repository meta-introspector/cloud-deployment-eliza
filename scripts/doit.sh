#!/bin/bash
#amazing the amount of work we need to do
nvm use 23
pnpm clean
pnpm install --no-frozen-lockfile
pnpm build


pushd packages/adapter-sqlite
pnpm rebuild
popd 


pushd scripts/jsdoc-automation
pnpm install --no-frozen-lockfile
pnpm build

pushd node_modules/.pnpm/better-sqlite3@11.8.1/node_modules/better-sqlite3/
pnpm rebuild

popd
popd
