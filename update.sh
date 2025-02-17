aws ssm update-document \
    --profile solfunmeme_dev \
    --region us-east-2 \
    --name "UpdateEliza" \
    --content "file://UpdateEliza.yaml" \
    --document-version '$LATEST'
