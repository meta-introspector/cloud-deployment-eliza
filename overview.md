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
##### Agent_assumed_name
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

## agent frameworks
* Eliza
  branch git/repo
* Swarms
* Promptbook
* etc
  
### Implementation of customer needs into agent framework
#### Character file for eliza
##### branch on git/repo
##### url on some server
##### variable in parameter store
##### other fancy char db


