
#
bash ./get_secrets.sh

docker kill agent-docker.service || echo skip
docker rm --force agent-docker.service || echo skip

/usr/bin/bash -c 'docker login -u AWS -p $(aws ecr get-login-password --region us-east-2) 767503528736.dkr.ecr.us-east-2.amazonaws.com'

/usr/bin/docker pull 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed

#/usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entry-point docker-entrypoint-strace.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed pnpm start:debug --characters=characters/eliza.character.json

#~/cloud-deployment-eliza/runlocaldocker-install-script.sh
# install strace (fixme : update docker)
#/usr/bin/docker run -p 3000:3000 --mount type=bind,source=/opt/agent,target=/opt/agent --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/docker-entrypoint-none.sh 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed  /opt/agent/runlocaldocker-install-script.sh
#/usr/bin/docker commit "agent-docker.service" "agent-docker-strace"
# second step we debug with strace entrypoint
# first we create a volumee
#mount /node_modules/tokenizers/ from 767503528736.dkr.ecr.us-east-2.amazonaws.com/nodemodules/tokenizer:latest  into
#"/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/"

docker run -v tokenizer:/node_modules/tokenizers/  767503528736.dkr.ecr.us-east-2.amazonaws.com/nodemodules/tokenizer:latest 

# now bind it in
/usr/bin/docker run -d -p 3000:3000  -v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ --mount type=bind,source=/opt/agent,target=/opt/agent --mount type=bind,source=/opt/agent/characters/,target=/app/characters/ --env-file /var/run/agent/secrets/env  --rm --name "agent-docker.service" --entrypoint /opt/agent/scripts/docker-entrypoint-strace2.sh groq
#100755 >

