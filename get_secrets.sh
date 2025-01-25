# we are using parameters prefixed by tine_ for multiple 
## TURN OFF LOGGING
set +x

#fixme move to environment
export AGENT_NAME="tine_agent"

echo "" > "/var/run/agent/secrets/env" # blank the file

declare -A params=(
#  b ["OPENAI_KEY"]="${AGENT_NAME}_openai_key"
#   ["XAI_MODEL"]="${AGENT_NAME}_openai_model"
#   ["XAI_L_MODEL"]="${AGENT_NAME}_large_openai_model"
#   ["XAI_M_MODEL"]="${AGENT_NAME}_medium_openai_model"
#   ["OPENAI_API_URL"]="${AGENT_NAME}_openai_endpoint"
    ["GROQ_API_KEY"]="${AGENT_NAME}_groq_key"
    ["TWITTER_PASSWORD"]="${AGENT_NAME}_twitter_password"
    ["TWITTER_EMAIL"]="${AGENT_NAME}_twitter_email"
    ["TWITTER_USERNAME"]="${AGENT_NAME}_twitter_username"
)

for key in "${!params[@]}"; do
    value=$(aws ssm get-parameter --name "${params[$key]}" | jq .Parameter.Value -r)
    echo "$key=\"${value}\"" >> "/var/run/agent/secrets/env"
done

# append these constant values to the env 
declare -A params_const=(
    ["VERBOSE"]="TRUE"
    ["NODE_ENV"]="development"
)
for key in "${!params_const[@]}"; do
    value="${params_const[$key]}"
    echo "$key=\"$value\"" >> "/var/run/agent/secrets/env"
done

    
set -x
## TURN ON LOGGING
