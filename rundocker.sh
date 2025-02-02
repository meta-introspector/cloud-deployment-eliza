#!/bin/bash
# FIXME move this and related files into the user data via templates and compression
# this is the install script 
#  install_script = "/opt/agent/rundocker.sh"
# called on boot.
echo using "${AGENT_NAME}" as agent name base for keys
export AGENT_NAME 
#pwd
#ls -latr
#. ./.env # for secrets
set -e # stop  on any error
export WORKSOURCE="/opt/agent"

echo for now install helper tools
snap install aws-cli --classic
apt install -y jq
apt install -y lsof strace nmap
#apt install -y emacs-nox

if ! id -u agent > /dev/null 2>&1; then
    adduser --disabled-password --gecos "" agent --home "/home/agent"  || echo ignore
else
  echo "User agent already exists, ignoring..."
fi

git config --global --add safe.directory "/opt/agent"
cd "/opt/agent/" || exit 1 # "we need agent"
#git log -1 
mkdir -p "/home/agent"
mkdir -p "/var/agent/logs"
chown -R agent:agent "/var/agent/" "/home/agent" "/opt/agent"
mkdir -p "/var/run/agent/secrets/"

bash ./get_secrets.sh

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
