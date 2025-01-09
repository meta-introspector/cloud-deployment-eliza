#!/bin/bash
# this is the install script 
#  install_script = "/opt/eliza/rundocker.sh"
# called on boot.
pwd
ls -latr
. ./.env # for secrets
set -e # stop  on any error
export WORKSOURCE="/opt/eliza"
snap install aws-cli --classic
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 916723593639.dkr.ecr.us-east-2.amazonaws.com
adduser --disabled-password --gecos "" eliza --home "/home/eliza"  || echo ignore
git config --global --add safe.directory "/opt/eliza"
git config --global --add safe.directory "/opt/eliza-memory"
cd "/opt/agent/" || exit 1 # "we need agent"
git log -2 --patch | head  -1000
mkdir -p "/home/agent"
mkdir -p "/var/agent/logs"
chown -R agent:agent "/var/agent/" "/home/agent" "/opt/agent"
mkdir -p "/var/run/agent/secrets/"
mkdir -p "/home/agent/.cache/huggingface/hub"

## TURN OFF LOGGING
set +x
OPENAI_KEY=$(aws ssm get-parameter     --name "agent_openai_key" | jq .Parameter.Value -r )
export OPENAI_KEY
echo "OPENAI_KEY=${OPENAI_KEY}" > "/var/run/agent/secrets/env"
echo "OPENAI_API_KEY=${OPENAI_KEY}" >> "/var/run/agent/secrets/env"
set -x
## TURN ON LOGGING

if ! grep -q "HF_HOME" "/var/run/agent/secrets/env"; then
    echo "HF_HOME=/home/agent/.cache/huggingface/hub" >> "/var/run/agent/secrets/env"
fi
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
systemctl start agent-docker || echo failed
systemctl enable agent-docker || echo failed
systemctl status agent-docker || echo oops2
