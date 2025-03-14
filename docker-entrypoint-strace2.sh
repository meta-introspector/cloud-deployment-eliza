#!/bin/sh
set -e

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
set -x
#if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
apt update
apt install -y strace

#export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
#corepack enable && corepack install --global pnpm@9.8.0


#strace -f -o /opt/agent/strace.log -s99999 node CMD ["pnpm", "start", "--characters=characters/eliza.character.json"]
strace -f -o /opt/agent/strace.log -s99999 bun start 
#pnpm start:debug --characters=$(ls -1p characters/*.json |  paste -sd,)
#fi
#exec "$@"
