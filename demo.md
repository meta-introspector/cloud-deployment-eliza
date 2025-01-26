
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
aws ssm put-parameter --overwrite --name "tine_agent_twitter_password"  --value "${TWITTER_PASSWORD}" --type String 
aws ssm put-parameter --overwrite --name "tine_agent_twitter_email"  --value "${TWITTER_EMAIL}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_username"  --value "${TWITTER_USERNAME}" --type String

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


docker exec -it agent-docker.service /bin/bash

NOTE: the mount of /opt/agent is not working, the files are from docker
--mount type=bind,source=/opt/agent,target=/opt/agent
this appears not to work

docker cp characters/eliza.character.json  agent-docker.service:/app/agent/characters/eliza.character.json
docker commit  agent-docker.service groq


# now to setup the twitter

1. create file in secret  `~/.secrets/tine.twitter.env`
2. source it ```
source ~/.secrets/tine.twitter.env
3. send it
bash ./push_twitter.sh
```

```


]0;root@ip-10-0-4-118: /opt/agentroot@ip-10-0-4-118:/opt/agent# history
history
    1  git pull
    2  git branch
    3  ls *.sh
    4  grep docker *.sh
    5  docker buildx build --platform=linux/arm64 -t eliza-agent:latest .
    6  exit
    7  tail -f /var/log/*
    8  systemctl restart sshd
    9  systemctl restart ssh.service 
   10  systemctl restart ssh.socket 
   11  tail -f /var/log/*
   12  exit
   13  cat ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCYh8dzILXDkDpXDJ+wUiru8EPNPETWWHHFlnVI7Uc2Bb2f/yHJL9bV0QUQ+/hN2OGeN3r4z34vf444A7oMXT8T2bnMDzXqGfrqpQ6+Xs7Cu2F6wGik+KDBsu52vhaATVLOnDegbhpQW+IikSvxe4huKOvQpF+p7Ex80B+XpBPEV23DXapjZI+FIsbYoD4Mp5qY/PmXisNCByayhBG7WBhCEtHxkvpFntkz/9bwk2kC/z2W1SIHufN5TbrxKPKWY5iguW0Mn2e/rNvxnxFZaRx224rQnRFBMSq4Oi91MNdilwDHFzkv4oVBtpUmCet84np8+DxCfzphyIpo899dRV+/f7dwb6ZY3cvBkALcWahsscuE4ypbroXQ40UPAa3gW1PirTNdMEiX+Ie/IzEDWWCJKdDv4JaGtKAPORfC7bbXnBYn5RASglOjI24w974Llyj5TXXKexjxsjF3wlSS6pNHFlFJnQzVfemcY6AqSJ0Xr8dfFbxpSYH9OFkvBhzPaec= mdupont@mdupont-G470 >> /home/ubuntu/.ssh/authorized_keys 
   14  echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCYh8dzILXDkDpXDJ+wUiru8EPNPETWWHHFlnVI7Uc2Bb2f/yHJL9bV0QUQ+/hN2OGeN3r4z34vf444A7oMXT8T2bnMDzXqGfrqpQ6+Xs7Cu2F6wGik+KDBsu52vhaATVLOnDegbhpQW+IikSvxe4huKOvQpF+p7Ex80B+XpBPEV23DXapjZI+FIsbYoD4Mp5qY/PmXisNCByayhBG7WBhCEtHxkvpFntkz/9bwk2kC/z2W1SIHufN5TbrxKPKWY5iguW0Mn2e/rNvxnxFZaRx224rQnRFBMSq4Oi91MNdilwDHFzkv4oVBtpUmCet84np8+DxCfzphyIpo899dRV+/f7dwb6ZY3cvBkALcWahsscuE4ypbroXQ40UPAa3gW1PirTNdMEiX+Ie/IzEDWWCJKdDv4JaGtKAPORfC7bbXnBYn5RASglOjI24w974Llyj5TXXKexjxsjF3wlSS6pNHFlFJnQzVfemcY6AqSJ0Xr8dfFbxpSYH9OFkvBhzPaec= mdupont@mdupont-G470 >> /home/ubuntu/.ssh/authorized_keys 
   15  cat /home/ubuntu/.ssh/authorized_keys 
   16  #cat /home/ubuntu/.ssh/authorized_keys 
   17  ls -latr
   18  cat /etc/group 
   19  exit
   20  docker os
   21  docker ps
   22  docker compose up
   23  aws q
   24  curl --proto '=https' --tlsv1.2 -sSf https://desktop-release.q.us-east-1.amazonaws.com/latest/amazon-q.deb -o amazon-q.deb
   25  dpkg -i amazon-q.deb 
   26  curl --proto '=https' --tlsv1.2 -sSf https://desktop-release.q.us-east-1.amazonaws.com/latest/amazon-q.deb -o amazon-q.deb
   27  ls -altr
   28  dpkg -i amazon-q.deb 
   29  aws codecommit
   30  aws help codecommit
   31  aws help | grep codecommit
   32  aws codecommit help
   33  aws codecommit help | grep create -i 
   34  aws codecommit create-repository tine
   35  aws codecommit create-repository --repository-name tine
   36  #aws codecommit create-repository --repository-name tine
   37  cat /home/ubuntu/.ssh/authorized_keys 
   38  asciinema
   39  sudo apt install asciinema
   40  asciinema rec server.dat
   41  asciinema --help
   42  asciinema updaload
   43  asciinema upload
   44  ls -latr
   45  asciinema upload server.dat 
   46  exit
   47  useradd -G agent ubuntu
   48  usermod -G agent ubuntu
   49  cat /etc/groups
   50  cat /etc/group
   51  cat /etc/group | grep agent
   52  mkdir /opt/git/agent
   53  mkdir -p /opt/git/agent
   54  git init /opt/git/agent/
   55  git remote add local /opt/git/agent/.git/
   56  git push local
   57  git status
   58  git commit -m 'readme' -a
   59  git push local
   60  chown ubuntu: -R /opt/git/agent/
   61  history >> hist
   62  git commit -m 'readme' -a
   63  git push
   64  git push local
   65  git config --global --add safe.directory /opt/git/agent/.git
   66  git push local
   67  exit
   68  cd
   69  cd /opt/agent/
   70  ls -astr *.sh
   71  bash ./runlocaldocker2.sh 
   72  docker ps
   73  docker kill agent-docker.service
   74  bash ./runlocaldocker2.sh 
   75  /usr/bin/docker pull 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed
   76  git branch
   77  cd /opt/agent/
   78  git branch
   79  q
   80  ls *.sh
   81  /usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
   82  /usr/bin/docker commit "agent-docker.service" "agent-docker-strace"
   83  # /usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
   84  docker ps
   85  docker ps -a
   86  #/usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
   87  /usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
   88  docker ps -a
   89  /usr/bin/docker commit "agent-docker.service" "agent-docker-strace"
   90  docker ps
   91  docker ps -a
   92  docker images --all
   93  /usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
   94  docker ps
   95  docker ps -a
   96  docker run -v tokenizer:/node_modules/tokenizers/  767503528736.dkr.ecr.us-east-2.amazonaws.com/nodemodules/tokenizer:latest 
   97  /usr/bin/docker run -p 3000:3000  -v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  
   98  ls
   99  ls -latr
  100  bash ./runlocaldocker2.sh 
  101  docker ps
  102  docker kill agent-docker.service
  103  docker ps
  104  bash ./runlocaldocker2.sh 
  105  pwd
  106  cd /opt/agent/
  107  docker-compose status
  108  docker compose status
  109  docker compose  ps
  110  ls -latr
  111  git add env.example
  112  git add docker-compose.md
  113  git commit -m 'capture' -a
  114  git push 
  115  git push local
  116  docker compose  ps
  117  cp env.example /var/run/agent/secrets/settings
  118  docker compose  ps
  119  docker compose agent-strace up
  120  docker compose up agent-strace 
  121  docker compose up tokenizer
  122  tmux attach
  123  docker ps
  124  tail -f /var/log/cloud-init-output.log 
  125  tmux
  126  cd /opt/agent/
  127  git status
  128  git add docker-compose.doc 
  129  rm amazon-q.deb 
  130  git commit -m 'work in progress' -a
  131  git push local
  132  docker ps
  133  docker inspect agent-docker-trace2.service
  134  docker inspect agent-docker-trace2.service >  agent-docker-trace2.service.inspect
  135  #docker inspect agent-docker-trace2.service >  agent-docker-trace2.service.inspect
  136  docker ps
  137  docker inspect agent-docker-trace.service >  agent-docker-trace2.service.inspect
  138  docker compose up
  139  history | grep inspect
  140  docker inspect agent-docker-trace.service >  agent-docker-trace2.service.inspect2
  141  #/usr/bin/docker run -p 3000:3000  --mount type=bind,src=tokenizer,dst=/app/node_modules/@anush008/tokenizers/ 
  142  /usr/bin/docker run -p 3000:3000  -v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  
  143  /usr/bin/docker run -p 3000:3000  -v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service2" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  
  144  #/usr/bin/docker run -p 3000:3000  -v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service2" --entrypoint /opt/agent/docker-entrypoint-strace2.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  o
  145  bash ./runlocaldocker3.sh
  146  git status
  147  git commit -m 'runlocaldocker' -a
  148  git push local
  149  git log 
  150  git push local
  151  git reflog
  152  docker ps
  153  docker inspect agent-docker.service
  154  docker inspect agent-docker.service > runninginspect.txt
  155  docker compose up
  156  docker ps
  157  docker inspect agent-docker-trace.service
  158  git reflog
  159  git checkout feature/arm64_fastembed
  160  git commit -m 'wip' -a
  161  git checkout feature/arm64_fastembed
  162  git checkout -b parking/dockercompose
  163  git checkout feature/arm64_fastembed
  164  git checkout origin/feature/arm64_fastembed
  165  git checkout -b origin_feature/arm64_fastembed
  166  git checkout  origin_feature/arm64_fastembed
  167  git checkout feature/arm64_fastembed
  168  git checkout origin_feature/arm64_fastembed
  169  history
  170  ls *.sh
  171  bash ./runlocaldocker2.sh 
  172  docker compose up tokenizer
  173  yq 
  174  apt install yq
  175  yq 
  176  yq  . docker-compose.yaml 
  177  git commit -m 'wip' -a
  178  git push
  179  git push local
  180  pwd
  181  git pull
  182  git config pull.ff only       # fast-forward only
  183  git pull
  184  git branch
  185  git fetch origin
  186  git branch --all
  187  git checkout agentgit/feature/arm64_fastembed
  188  docker compose up
  189  docker compose down
  190  docker compose up
  191  docker ps
  192  docker kill agent-docker.service
  193  docker ps
  194  docker compose up
  195  docker rm agent-docker.service
  196  docker compose up
  197  docker kill "45548840111a258740b8b6d1b0da5c44eb98ee2d5371cae0eda82c8db415d7a4"
  198  docker rm "45548840111a258740b8b6d1b0da5c44eb98ee2d5371cae0eda82c8db415d7a4"
  199  docker compose up
  200  rm strace.log 
  201  clear
  202  reset
  203  docker compose up
  204  grep tokenizer strace.log 
  205  grep tokenizer strace.log  | grep open
  206  grep tokenizer strace.log  | cut -b 0-100 | grep token
  207  grep tokenizer strace.log  | cut -b 1-100 | grep token
  208  docker compose up
  209  runlocaldocker2.sh
  210  bash ./runlocaldocker2.sh
  211  docker compose up
  212  apt install emacs-nox 
  213  eamcs
  214  emacs
  215  stty ixany
  216  stty ixoff -ixon
  217  jlljfsdfsd
  218  clear
  219  pwd
  220  tmux attach
  221  emacs
  222  fg
  223  1
  224  exit
  225  tmux attach
  226  exit
  227  tail -f strace.log | grep -i TINE
  228  exit
  229  tmux attach
  230  docker ps
  231  docker inspect agent-docker.service
  232  cd /opt/agent
  233  ls -altr
  234  asciinema rec server.ac
  235  asciicast pub server.ac
  236  asciicinema pub server.ac
  237  asciinema pub server.ac
  238  asciinema upload server.ac
  239  xit
  240  exit
  241  cd /var/log/
  242  ls -altr
  243  cd /opt/agent/
  244  pwd
  245  git fetch --all
  246  cd /opt/agent
  247  git pull
  248  git pull origin
  249  git fetch origin
  250  git fetch --all
  251  pwd
  252  bash ./rundocker.sh
  253  bash ./runlocaldocker2.sh
  254  docker ps
  255  docker stop agent-docker.service
  256  bash ./runlocaldocker2.sh
  257  clear
  258  grep OPENAI_API_URL /var/run/agent/secrets/env
  259  docker ps
  260  docker stop agent-docker.service
  261  bash ./rundocker.sh
  262  docker stop agent-docker.service
  263  bash ./rundocker.sh
  264  grep OPENAI_API_URL /var/run/agent/secrets/env
  265  grep OPENAI_API_URL rundocker.sh
  266  git branch
  267  git log --all 
  268  git checkout origin_feature/arm64_fastembed
  269  git pull
  270  q
  271  git log --all
  272  git log --all -1 --patch | grep OPEN
  273  git log --all -1 --patch | grep OPENAI | grep URL
  274  git log --all -1 --patch | grep OPEN
  275  clear
  276  grep OPENAI_API_URL rundocker.sh
  277  cd /opt/agent
  278  git pull
  279  bash ./rundocker.sh
  280  history | grep base
  281  history | grep grep
  282  grep URL /var/run/agent/secrets/env
  283  grep URL rundocker.sh
  284  bash -x ./rundocker.sh
  285  OPENAI_KEY=$(aws ssm get-parameter     --name "tine_agent_openai_key" | jq .Parameter.Value -r )
  286  export OPENAI_KEY
  287  cat "/var/run/agent/secrets/env"
  288  clear
  289  git pull
  290  bash -x ./rundocker.sh
  291  grep URL "/var/run/agent/secrets/env"
  292  history
  293  history | grep sh
  294  bash ./runlocaldocker2.sh
  295  git pull
  296  bash ./rundocker.sh
  297  docker ps
  298  docker stop agent-docker.service
  299  bash ./rundocker.sh
  300  ls *.sh
  301  bash ./runlocaldocker2.sh
  302  bash ./rundocker.sh
  303  docker ps
  304  docker stop agent-docker.service || echo oops
  305  bash ./rundocker.sh
  306  bash ./runlocaldocker2.sh
  307  docker stop agent-docker.service || echo oops
  308  docker ps
  309  docker rm agent-docker.service || echo oops
  310  docker stop agent-docker.service || echo oops
  311  docker kill agent-docker.service || echo oops
  312  docker rm agent-docker.service 
  313  docker rm --force agent-docker.service 
  314  docker ps
  315  docker stop agent-docker.service
  316  docker kill agent-docker.service
  317  docker ps
  318  bash ./runlocaldocker2.sh
  319  git fetch --all
  320  git checkout feature/tine-groq
  321  docker kill agent-docker.service || echo oops
  322  bash ./rundocker.sh ; bash ./runlocaldocker2.sh
  323  #bash ./rundocker.sh ; bash ./runlocaldocker2.sh
  324  ##bash ./rundocker.sh ; bash ./runlocaldocker2.sh
  325  history | grep 
  326  history | grep  grep
  327  grep GROK  "/var/run/agent/secrets/env"
  328  grep GROQ  "/var/run/agent/secrets/env"
  329  grep GROQ ./rundocker.sh
  330  grep GROQ ./rundocker.sh -C2
  331  git pull
  332  bash ./rundocker.sh ; bash ./runlocaldocker2.sh
  333  docker stop agent-docker.service
  334  docker kill agent-docker.service
  335  docker rm agent-docker.service
  336  grep GROQ ./rundocker.sh -C2
  337  grep GROQ /var/run/agent/secret/env
  338  grep GROQ /var/run/agent/secrets/env
  339  grep GROQ /var/run/agent/secrets/env | cut -b1-14
  340  bash ./runlocaldocker2.sh
  341  cat characters/eliza.character.json
  342  docker ps
  343  docker stop agent-docker.service
  344  git pull
  345  bash ./rundocker.sh 
  346  bash ./runlocaldocker2.sh
  347  cd characters/
  348  grep tine *
  349  cat eliza.character.json
  350  cd ..
  351  grep -r TINE-IntrospectorIsNotEliza *
  352  rm strace.log
  353  grep -r TINE-IntrospectorIsNotEliza *
  354  rm start.sh 
  355  docker ps
  356  docker stop agent-docker.service
  357  bash ./runlocaldocker2.sh
  358  grep /app/characters/eliza.character.json strace.log
  359  grep -i groq  strace.log
  360  grep -i groq  strace.log | grep provider
  361  grep -i groq  strace.log | grep model_provider
  362  grep -i groq  strace.log | grep modelprovider
  363  docker ps
  364  docker exec -it agent-docker.service /bin/bash
  365  docker inspect agent-docker.service
  366  cd characters
  367  ls -latr
  368  cat eliza.character.json
  369  docker stop agent-docker.service
  370  cp eliza.character.json tine.character.json
  371  docker exec -it agent-docker.service /bin/bash
  372  bash ./runlocaldocker2.sh
  373  cd ..
  374  bash ./runlocaldocker2.sh
  375  docker ps
  376  docker inspect agent-docker.service
  377  touch ttt
  378  #docker exec -it 
  379  docker ps
  380  docker exec -it agent-docker.service bash 
  381  docker cp characters/eliza.character.json  agent-docker.service:/app/agent/characters/eliza.character.json
  382  docker commit  agent-docker.service -t groq
  383  #docker commit  agent-docker.service -t groq
  384  docker ps
  385  docker commit  agent-docker.service groq
  386  git branch
  387  git pull
  394  docker ps
  395  docker exec -it agent-docker.service bash 
  396  command dirs
  397  git pull
  398  bash ./run_with_groq.sh
  399  docker stop agent-docker.service
  400  bash ./run_with_groq.sh
  401  docker logs -f agent-docker.service
  402  clear
  403  ls
  404  pwd
  405  cd /opt/agent
  406  git pull
  407  bash ./run_with_groq.sh 
  408  q
  409  docker stop agent-docker.sevice
  410  docker ps
  411  docker stop agent-docker.service
  412  bash ./run_with_groq.sh 
  413  ./rundocker.sh
  414  bash ./rundocker.sh
  415  export TWITTER_EMAIL="$(aws ssm get-parameter --name "tine_agent_twitter_email" | jq .Parameter.Value -r)"
  416  echo $TWITTER_EMAIL
  417  cd /opt/agent
  418  ls
  419  git pull
  420  ls
  421  bash ./rundocker.sh
  422  docker ps
  423  grep EMAIL /var/run/agent/secrets/env
  424  docker stop agent-docker.service
  425  ls *.sh
  426  bash ./run_with_groq.sh
  427  docker log agent-docker.service
  428  docker logs agent-docker.service
  429  docker logs --follow agent-docker.service
  430  docker stop agent-docker.service
  431  grep voLP851I5wXPqvUd8jChKKtJ ./strace.log > trace1.txt
  432  wc trrace1.txt
  433  wc trace1.txt
  434  cat trace1
  435  cat trace1.txt
  436  grep -C 100 voLP851I5wXPqvUd8jChKKtJ ./strace.log > trace1.txt
  437  cat trace1.txt
  438  git pull
  439  bash ./rundocker.sh
  440  git pull
  441  bash ./rundocker.sh
  442  command dirs
  443  git pull
  444  bash ./rundocker.sh
  445  docker ps
  446  ls | grep grok
  447  ls *.sh
  448  bash ./run_with_groq.sh
  449  docker rm "0a1495586986c5bd17ce4cfdfd2cf5aa85f1b18df14e6733b2970ccfcbbb41ed"
  450  docker kill "0a1495586986c5bd17ce4cfdfd2cf5aa85f1b18df14e6733b2970ccfcbbb41ed"
  451  docker ps
  452  docker rm "/agent-docker.service"
  453  docker stop "/agent-docker.service"
  454  docker kill "agent-docker.service"
  455  docker rm "agent-docker.service"
  456  docker rm "agent-docker.service" --force
  457  docker rm "/agent-docker.service" --force
  458  docker ps
  459  docker ps -a
  460  docker rm c93c6feb4984
  461  clear
  462  bash ./run_with_groq.sh
  463  docker ps
  464  docker logs --follow agent-docker.service
  465  command dirs
  466  docker ps -a
  467  docker ps 
  468  docker stop agent-docker.service
  469  grep -C 100 twitter ./strace.log > trace2.txt
  470  wc trace2
  471  wc trace2.txt
  472  set | grep TWITTER| cut -d= -f1
  473  grep twitter trace2.txt
  474  clear
  475  cat "/var/run/agent/secrets/env"
  476  git pull
  477  bash ./rundocker.sh
  478  docker ps
  479  bash ./run_with_groq.sh

  483  docker ps
  484  bash ./run_with_groq.sh
  485  docker rm agent-docker.service
  486  docker rm "/agent-docker.service"
  487  docker ps -a
  488  docker rm agent-docker.service
  489  docker rm --force agent-docker.service
  491  git pull
  492  bash ./run_with_groq.sh


```


for now, dont use any $ \ ? or such in your passsword
test it like this

get the secrets and make sure they can be read
```
bash ./get_secrets.sh
cat /var/run/agent/secrets/env
	. /var/run/agent/secrets/env
set | grep TWITTER  
```

```
  docker exec -it agent-docker.service bash 
```

```
  bash ./run_with_groq.sh
  docker ps

   docker logs -f agent-docker.service
```


