
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
aws ssm start-session --target i-06a744b2cf12e2356 --document-name AWS-StartPortForwardingSession  --parameters '{"portNumber": ["3000"], "localPortNumber": ["9301"]}'aws ssm start-session --target i-06a744b2cf12e2356 --document-name AWS-StartPortForwardingSession  --parameters '{"portNumber": ["3000"], "localPortNumber": ["9301"]}'
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
export OPENAI_API_BASE='https://integrate.api.nvidia.com/v1/chat/completions'
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
```
