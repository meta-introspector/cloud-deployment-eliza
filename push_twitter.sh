
export TWITTER_EMAIL TWITTER_PASSWORD TWITTER_USER

aws ssm put-parameter     --name "tine_agent_twitter_password"  --value "${TWITTER_PASSWORD}" --type String
aws ssm put-parameter     --name "tine_agent_twitter_email"  --value "${TWITTER_EMAIL}" --type String
aws ssm put-parameter     --name "tine_agent_twitter_username"  --value "${TWITTER_USERNAME}" --type String
