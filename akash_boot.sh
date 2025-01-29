#to run this
# curl https://raw.githubusercontent.com/meta-introspector/cloud-deployment-eliza/refs/heads/feature/akash_docker/akash_boot.sh | bash

# akash runs like this>
#bash -c "curl https://raw.githubusercontent.com/meta-introspector/cloud-deployment-eliza/refs/heads/feature/akash_docker/akash_boot.sh  | bash"

cd /app

pnpm start:debug --characters=./characters/eliza.character.json
