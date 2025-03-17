#set +x  # turn off logging
export AGENT_IMAGE=h4ckermike/elizaos-eliza:feature-arm64_fastembed
export TOKENIZER_IMAGE=h4ckermike/arm64-tokenizers:feature-arm64

# sets the parameter
#aws ssm put-parameter     --name "agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_password"  --value "${TWITTER_PASSWORD}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_email"  --value "${TWITTER_EMAIL}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_username"  --value "${TWITTER_USERNAME}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_endpoint"  --value "${OPENAI_API_BASE}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_model"  --value "${LLMMODEL}" --type String
aws ssm put-parameter     --name "tine_agent_groq_key"  --value "${GROQ_API_KEY}" --type String

aws ssm put-parameter     --name "tine_agent_agent_image"  --value "${AGENT_IMAGE}" --type String
# aws ssm put-parameter     --name "tine_agent_agent_image"  --value "${AGENT_IMAGE}" --type String --region us-east-1 --overwrite
aws ssm put-parameter     --name "tine_agent_tokenizer_image"  --value "${TOKENIZER_IMAGE}" --type String
#aws ssm put-parameter     --name "tine_agent_tokenizer_image"  --value "${TOKENIZER_IMAGE}" --type String --region us-east-1 --overwrite




aws ssm put-parameter  --name "tine_agent_2_agent_image"  --value "h4ckermike/elizaos-eliza:feb10" --type String
aws ssm put-parameter  --name "tine_agent_2_docker_username"  --value "${DOCKER_USERNAME}" --type String
aws ssm put-parameter  --name "tine_agent_2_docker_password"  --value "${DOCKER_PASSWORD}" --type String


# aws ssm put-parameter  --name "tine_agent_2_docker_username"  --value "${DOCKER_USERNAME}" --type String --profile solfunmeme_dev
