aws ssm start-session --target i-06a744b2cf12e2356 --document-name AWS-StartPortForwardingSession  --parameters '{"portNumber": ["22"], "localPortNumber": ["2222"]}'
