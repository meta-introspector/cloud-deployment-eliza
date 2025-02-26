#!/bin/bash
# in bash count down from 42 to 1
INPUT_PULL_NUMBER=40
while [ $INPUT_PULL_NUMBER -gt 0 ]
do
    echo $INPUT_PULL_NUMBER
    ((INPUT_PULL_NUMBER--))
    export INPUT_PULL_NUMBER
    pnpm run ts
done