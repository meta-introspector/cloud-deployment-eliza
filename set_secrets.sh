#set +x  # turn off logging
export AGENT_IMAGE=h4ckermike/arm64-tokenizers:feature-arm64
export TOKENIZER_IMAGE=h4ckermike/elizaos-eliza:feature-arm64_fastembed

# sets the parameter
#aws ssm put-parameter     --name "agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_password"  --value "${Blood0523}" --type String 
aws ssm put-parameter --overwrite --name "tine_agent_twitter_email"  --value "${7817101326}" --type String
aws ssm put-parameter --overwrite --name "tine_agent_twitter_username"  --value "${@batsy235}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_key"  --value "${OPENAI_API_KEY}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_endpoint"  --value "${OPENAI_API_BASE}" --type String
#aws ssm put-parameter     --name "tine_agent_openai_model"  --value "${LLMMODEL}" --type String
aws ssm put-parameter     --name "tine_agent_groq_key"  --value "${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}" --type String

aws ssm put-parameter     --name "tine_agent_agent_image"  --value "${h4ckermike/elizaos-eliza:feature-arm64_fastembed}" --type String
aws ssm put-parameter     --name "tine_agent_tokenizer_image"  --value "${h4ckermike/arm64-tokenizers:feature-arm64}" --type String

