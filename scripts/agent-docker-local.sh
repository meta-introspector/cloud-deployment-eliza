#!/bin/bash

source ./env
/usr/bin/docker remove agent-docker.service

/usr/bin/docker run  -p 3000:3000  	\
		-v tokenizer:/app/node_modules/@anush008/tokenizers/ \
		-v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ 	\
		--mount type=bind,source=/opt/agent,target=/opt/agent 	\
		--env-file env 	\
		--name "agent-docker.service" 	\
		--entrypoint /opt/agent/scripts/docker-entrypoint-strace2.sh ${AGENT_IMAGE}

