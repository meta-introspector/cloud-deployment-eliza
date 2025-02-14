#!/bin/bash
# we are using parameters prefixed by ${AGENT_NAME}_, eg. "tine_agent_7_"
## TURN OFF LOGGING
echo using "${AGENT_NAME}" as agent name base for keys
set +x

# This script expects AGENT_NAME to be set to something like "tine_agent"

mkdir -p "/var/run/agent/secrets/"
echo "" > "/var/run/agent/secrets/env" # blank the file

# Fetch all variables with the prefix and name them the same as the variable minus agent name underscore
for key in $(aws ssm describe-parameters --query 'Parameters[?starts_with(Name, `'"${AGENT_NAME}"'_`)].Name' --output text); do
    value=$(aws ssm get-parameter --name "$key" | jq .Parameter.Value -r)
    var_name=$(echo "$key" | sed "s/^${AGENT_NAME}_//")
    echo "$var_name=${value}" >> "/var/run/agent/secrets/env"
done

# append these constant values to the env 
declare -A params_const=(
    ["VERBOSE"]="TRUE"
    ["NODE_ENV"]="development"
)
for key in "${!params_const[@]}"; do
    value="${params_const[$key]}"
    echo "$key=$value" >> "/var/run/agent/secrets/env"
done

set -x
## TURN ON LOGGING
