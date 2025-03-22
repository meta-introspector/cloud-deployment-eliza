
#
bash ./get_secrets.sh

docker kill agent-docker.service || echo skip
docker rm --force agent-docker.service || echo skip

export CORE_AGENT_IMAGE=h4ckermike/elizaos-eliza:feature-arm64_fastembed
export TOKENIZERS_IMAGE=h4ckermike/arm64-tokenizers:feature-arm64
# AUDIO
# video
# more
/usr/bin/docker pull $TOKENIZERS_IMAGE
/usr/bin/docker pull $CORE_AGENT_IMAGE

# intialize the volume as side effect
docker run -v tokenizer:/node_modules/tokenizers/  $TOKENIZERS_IMAGE
#docker cp characters/eliza.character.json agent-docker.service:/app/agent/characters/eliza.character.json
#docker commit agent-docker.service groq

# now bind it in
/usr/bin/docker run -d -p 3000:3000  \
		-v tokenizer:/app/node_modules/@anush008/tokenizers/ -v tokenizer:/app/node_modules/fastembed/node_modules/.pnpm/@anush008+tokenizers@https+++codeload.github.com+meta-introspector+arm64-tokenizers+tar.gz+98_s2457qj3pe4ojcbckddasgzfvu/node_modules/@anush008/ \
		--mount type=bind,source=/opt/agent,target=/opt/agent \
		--mount type=bind,source=/opt/agent/characters/,target=/app/characters/ \		
		--env-file /var/run/agent/secrets/env \
		--rm \
		--name "agent-docker.service" \
		--entrypoint /opt/agent/scripts/docker-entrypoint-strace2.sh $DOCKERIMAGE

