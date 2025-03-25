From humans for humans 

# Human 

Our user is a customer who want to create an ai agent for some business purpose, to follow some regulated procedure
that is documented in some formal manner and prove compliance.

## Biometrics
The user has biometrics that are used to authenticate themselves with the system, mfa, etc.

# Cloud Account

## aws account 
### Free tier with credit card

## oracle account
### Limited free tier
### Credit check for Pay as you go

## akash account
### Crypto payments

# Finance
## bank/credit card account 
## Cypyto Wallet

# Physical context (Layer 1)

## Datacenter
### Phone
### Laptop
### Home Server
### Cloud Availability Zone Data center

## Networking
## Power
## Cooling
## Air
## Noise

# Deployment 
## AWS 
### cloudformation
#### User data scripts 

https://us-east-2.console.aws.amazon.com/ec2/home?region=us-east-2#LaunchTemplateDetails:launchTemplateId=lt-0a10ab673e21f4aae

see `echo GIT_BRANCH="feature/v2/telegram"  >> /etc/agent/env`
and `export GIT_BRANCH="feature/v2/telegram"` 

```
#!/bin/bash -xe
export AGENT_NAME="tine_agent_9"
export GIT_REPO="https://github.com/meta-introspector/cloud-deployment-eliza/" # FIXME
export GIT_BRANCH="feature/v2/telegram" # FIXME

mkdir /etc/agent/

echo AGENT_NAME="tine_agent_9" > /etc/agent/env
echo GIT_REPO="https://github.com/meta-introspector/cloud-deployment-eliza/" >> /etc/agent/env
echo GIT_BRANCH="feature/v2/telegram"  >> /etc/agent/env

export HOME=/root
apt update
apt-get install -y ec2-instance-connect git wget unzip systemd curl
apt-get install -y cloud-utils apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
apt-get update
apt-get install -y docker-ce
usermod -aG docker ubuntu
snap install amazon-ssm-agent --classic || echo oops1
snap start amazon-ssm-agent || echo oops2
if [ ! -d "/opt/agent/" ]; then
git clone "https://github.com/meta-introspector/cloud-deployment-eliza/" "/opt/agent/"
fi
cd "/opt/agent/" || exit 1
git stash
git fetch --all
git checkout --track --force "origin/feature/v2/telegram"
bash -x /opt/agent/scripts/rundocker.sh
```
##### Agent_name
##### Agent_assumed_name (Agent_Alias)
this allows reuse of agent variables. ( I guess we could have a list of alias to load from etc)
#### Terraform 

## Oracle
### Built in terraform
### Our Terraform 

# Configuration and Key management 
## Api keys
### eg openai key

## Systemd 
Installed with rundocker.sh
```
cd /opt/agent/scripts
git pull
bash ./rundocker.sh
```

## ssm parameters
### Read directly from api
### Prefixed for each agent/namespace

## env files
### Transfer to env file (stored at rest, bad)

## Vault (future)
## github secrets
### organization

# Applications
## Customer applications

## Boot scripts (user data)

Stored in the launch template, 

The branch is "feature/v2/telegram" in my example

### git report/branch - created with cloudformation

### TODO : modify to load variables from parameter store, to allow customization. 

Fixed : given the agent_alias assumed name, if you have permission read the secrets and use those to load additional data.

## AGENT_IMAGE : Docker image
### ssm parameter which docker image to load.

eg:
`tine_agent_7_AGENT_IMAGE` = `h4ckermike/elizaos-eliza:docker-2025-03-25`

## agent frameworks
* Eliza
  branch git/repo
* Swarms
* Promptbook
* etc
  
### Carry or Implementation of customer wish/needs into agent framework
Consistent and secure. 
Translates wishes into quality metrics and checks.
#### Character file for eliza
memory updates.
knowledge of your agent.
##### branch on git/repo
##### url on some server
##### variable in parameter store
##### other fancy char db

## Update agent
backup data.



