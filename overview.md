From humans for humans 

# Human 
## Biometrics

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

## Boot scripts
### git report/branch - cloudformation
### modify to load variables from parameter store, to allow customization. 
given the agent assumed name, if you have permission read the secrets and use those to load additional data.

## Docker image
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



