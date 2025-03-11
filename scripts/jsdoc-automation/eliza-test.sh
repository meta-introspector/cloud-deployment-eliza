#!/bin/bash
# in bash count down from 42 to 1
export GITHUB_ACCESS_TOKEN=`cat ~/.github_pat`
export OPENAI_API_KEY=`cat ~/.secrets/openrouter.sh`
export OPENAI_API_BASE="https://openrouter.ai/api/v1"
export GITHUB_REPOSITORY=eliza
export GITHUB_ACTOR=elizaos
INPUT_PULL_NUMBER=3881
#while [ $INPUT_PULL_NUMBER -gt 0 ]
#do
    echo $INPUT_PULL_NUMBER
    ((INPUT_PULL_NUMBER--))
    export INPUT_PULL_NUMBER
    pnpm run dbg
    #pnpm run ts
#done