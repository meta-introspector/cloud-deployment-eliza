#
/usr/bin/bash -c 'docker login -u AWS -p $(aws ecr get-login-password --region us-east-2) 767503528736.dkr.ecr.us-east-2.amazonaws.com'

/usr/bin/docker pull 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed

#/usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entry-point docker-entrypoint-strace.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed pnpm start:debug --characters=characters/eliza.character.json
/usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-strace.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed pnpm start:debug --characters=characters/eliza.character.json 
