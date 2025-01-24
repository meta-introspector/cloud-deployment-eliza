
* Whats the scenario 

Homelab:
Windows pc - linux server - aws instance
mobile phone - 

on Road : moblile phone talking to api server 

** aws tg4.small arm64 instance running on private account, firewall
skinny eliza docker
solana 
akash 
no voice/video plugin

** stages 
*** build the dao
**** x
*** run the dao
*** rebuild the new dao

* forward ports for ssh and eliza to local pc

# lets forward ssh to 2222
```
aws ssm start-session --target i-06a744b2cf12e2356 --document-name AWS-StartPortForwardingSession  --parameters '{"portNumber": ["22"], "localPortNumber": ["2222"]}'
```

# lets forward port 3000 on server to our local 9301 to talk to eliza
```
aws ssm start-session --target i-06a744b2cf12e2356 --document-name AWS-StartPortForwardingSession  --parameters '{"portNumber": ["3000"], "localPortNumber": ["9301"]}'

```

# now lets connect the agent  on what appears to be local host 9031
```
cd ~/eliza-starter/
export SERVER_NAME=localhost:9301
nvm use 23
pnpm start 
```

```
ssh ubuntu@localhost -p 2222
sudo su -
cd /opt/agent

asciinema rec server.txt
tail -f strace.log | grep -i TINE
asciinema upload server.txt
```

Record cinema
```
asciinema rec server.ac
```

```
aws ssm start-session --target i-06a744b2cf12e2356 
```

# next configure our access to llm api 

We will use the free tier LLM Model
https://build.nvidia.com/tiiuae/falcon3-7b-instruct

set env variables
```
export LLMMODEL="tiiuae/falcon3-7b-instruct"
export OPENAI_API_BASE='https://integrate.api.nvidia.com/v1/'
```
The secret 
```
export OPENAI_API_KEY='i can't believe it's not butter!'
```
Will be set via 
```
source ~/projects/nvidia/api
```

Now lets put this into aws and overwrite the old key 
```
aws ssm put-parameter     --name "agent_openai_key"  --value "${OPENAI_API_KEY}" --type String --overwrite
aws ssm put-parameter     --name "tine_agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
aws ssm put-parameter     --name "tine_agent_openai_endpoint"  --value "${OPENAI_API_BASE}" --type String
aws ssm put-parameter     --name "tine_agent_openai_model"  --value "${LLMMODEL}" --type String

aws ssm put-parameter     --name "tine_agent_groq_key"  --value "${GROQ_API_KEY}" --type String
```

Check key without exposing.
grep GROQ /var/run/agent/secrets/env | cut -b1-14


Make sure you dont put chat/completions in the url
to overwrite :
`aws ssm put-parameter     --name "tine_agent_openai_endpoint"  --value "${OPENAI_API_BASE}" --type String --overwrite`


Now to fetch the results :

/zos ```like this example
OPENAI_KEY=$(aws ssm get-parameter     --name "agent_openai_key" | jq .Parameter.Value -r )
pull these into 
aws ssm put-parameter     --name "tine_agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
aws ssm put-parameter     --name "tine_agent_openai_endpoint"  --value "${OPENAI_API_BASE}" --type String
aws ssm put-parameter     --name "tine_agent_openai_model"  --value "${LLMMODEL}" --type String
```
->

``
export OPENAI_API_KEY=$(aws ssm get-parameter --name "tine_agent_openai_key" | jq .Parameter.Value -r)
export OPENAI_API_BASE=$(aws ssm get-parameter --name "tine_agent_openai_endpoint" | jq .Parameter.Value -r)
export LLMMODEL=$(aws ssm get-parameter --name "tine_agent_openai_model" | jq .Parameter.Value -r)
```

OPENAI_API_KEY=sk-* # OpenAI API key, starting with sk-

now we add this to our agent manually and test

restart tunnels as before and connect via 
```
ssh ubuntu@localhost -p 2222
```

We will append the secrets to the env here :
/var/run/agent/secrets/env

adapt the eliza config to use environment, for now 

## setting the openai model 
https://elizaos.github.io/eliza/docs/quickstart/
`XAI_MODEL=gpt-4o-mini or gpt-4o`

The pattern for loading new variables into the eliza env is here
```
set +x
XAI_MODEL=$(aws ssm get-parameter     --name "tine_agent_openai_model" | jq .Parameter.Value -r )
export XAI_MODEL
echo "XAI_MODEL=${XAI_MODEL}" >> "/var/run/agent/secrets/env"
set -x
```

This goes into the file `rundocker.sh` so that we can just execute it on boot


## setting the openai endpoint
``
endpoint: settings.OPENAI_API_URL || "https://api.openai.com/v1",
```
set +x
OPENAI_API_URL=$(aws ssm get-parameter     --name "tine_agent_openai_endpoint" | jq .Parameter.Value -r )
export OPENAI_API_URL
echo "OPENAI_API_URL=${OPENAI_API_URL}" >> "/var/run/agent/secrets/env"
set -x




first we login and pull our changes from the localhost to the server:
```
aws ssm start-session --target i-06a744b2cf12e2356 
sudo su -
cd /opt/agent/
/opt/agent
git fetch --all
git fetch --all
From https://github.com/meta-introspector/cloud-deployment-eliza
   af5f0b8e..8d56ff49  origin_feature/arm64_fastembed -> origin/origin_feature/arm64_fastembed
```

now we will restart the server 
`bash ./rundocker.sh` is the normal bootscript
`bash ./runlocaldocker2.sh`


