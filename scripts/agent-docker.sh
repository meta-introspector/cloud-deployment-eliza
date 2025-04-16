#!/bin/bash

export $(cat /var/run/agent/secrets/env| xargs)

echo AGENT_IMAGE ${AGENT_IMAGE}
docker kill "agent-docker.service"     
docker rm 	"agent-docker.service" 
/usr/bin/docker run  -p 3000:3000  	\
		-v tokenizer:/app/node_modules/@anush008/tokenizers/ \
		-v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ 	\
		--mount type=bind,source=/opt/agent,target=/opt/agent 	\
		--env-file /var/run/agent/secrets/env 	\
		--name "agent-docker.service" 	\
		--entrypoint /opt/agent/scripts/docker-entrypoint-strace2.sh ${AGENT_IMAGE}

