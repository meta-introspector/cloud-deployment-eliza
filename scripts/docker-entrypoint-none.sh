#!/bin/sh
set -e

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
set -x
#if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
#apt update
#apt install -y strace

#export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
#corepack enable && corepack install --global pnpm@9.8.0

#strace -f -o /opt/agent/strace.log -s99999 node CMD ["pnpm", "start", "--characters=characters/eliza.character.json"]
#pnpm start --characters=characters/tine-test.character.json
#pnpm start --characters=$(ls -1p characters/*.json |  paste -sd,)
#fi
#exec "$@"

# in case they change the characters 
bun run build:cli

bun run start-cli
# --characters=$(ls -1p characters/*.json |  paste -sd,)
