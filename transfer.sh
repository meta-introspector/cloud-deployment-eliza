aws ecr get-login-password --region region | docker login --username AWS --password-stdin 767503528736.dkr.ecr.us-east-2.amazonaws.com
docker pull 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feb10
docker tag 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feb10 h4ckermike/elizaos-eliza:feb10
docker push h4ckermike/elizaos-eliza:feb10
