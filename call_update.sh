aws ssm send-command \
    --profile solfunmeme_dev \
    --region us-east-2 \
    --document-name "UpdateEliza" \
    --document-version "\$LATEST" \
    --targets '[{"Key":"InstanceIds","Values":["i-0b0e822632e0bef20"]}]' \
    --parameters '{"ImageParameterName":["tine_agent_4_agent_image"],"CharacterParameterName":["tine-agent-config-1"],"ContainerMemory":["1512"]}' \
    --timeout-seconds 600 \
    --max-concurrency "50" \
    --max-errors "0"
