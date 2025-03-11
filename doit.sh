
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

popd
