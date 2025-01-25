#!/bin/bash
# FIXME move this and related files into the user data via templates and compression
# this is the install script 
#  install_script = "/opt/agent/rundocker.sh"
# called on boot.
pwd
ls -latr
. ./.env # for secrets
set -e # stop  on any error
export WORKSOURCE="/opt/agent"
snap install aws-cli --classic
apt install -y jq
echo for now install helper tools
apt install -y lsof strace nmap
#apt install -y emacs-nox
# FIXME another account hardcoded
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 767503528736.dkr.ecr.us-east-2.amazonaws.com


adduser --disabled-password --gecos "" agent --home "/home/agent"  || echo ignore
git config --global --add safe.directory "/opt/agent"
cd "/opt/agent/" || exit 1 # "we need agent"
#git log -1 
mkdir -p "/home/agent"
mkdir -p "/var/agent/logs"
chown -R agent:agent "/var/agent/" "/home/agent" "/opt/agent"
mkdir -p "/var/run/agent/secrets/"

# we are using parameters prefixed by tine_ for multiple 
## TURN OFF LOGGING
set +x

#fixme move to environment
export AGENT_NAME="tine_agent"

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
    echo "$key=$value" >> "/var/run/agent/secrets/env"
done

# append these constant values to the env 
declare -A params_const=(
    ["VERBOSE"]="TRUE"
    ["NODE_ENV"]="development"
)
for key in "${!params_const[@]}"; do
    value="${params[$key]}"
    echo "$key=$value" >> "/var/run/agent/secrets/env"
done

    
set -x
## TURN ON LOGGING

if ! grep -q "^HOME" "/var/run/agent/secrets/env"; then
    echo "HOME=/home/agent" >> "/var/run/agent/secrets/env"
fi
if ! grep -q "^HOME" "/var/run/agent/secrets/env"; then
    echo "WORKSPACE_DIR=\${STATE_DIRECTORY}" >> "/var/run/agent/secrets/env"
fi
cp "${WORKSOURCE}/systemd/agent-docker.service" /etc/systemd/system/agent-docker.service 
grep . -h -n /etc/systemd/system/agent-docker.service
chown -R agent:agent /var/run/agent/
chown -R agent:agent /opt/agent/
systemctl daemon-reload
#docker stop agent-docker.service || echo oops
#docker rm agent-docker.service || echo oops
systemctl start agent-docker || echo failed
systemctl enable agent-docker || echo failed
#systemctl status agent-docker || echo oops2
