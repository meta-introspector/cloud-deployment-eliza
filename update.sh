aws ssm update-document \

    --name "UpdateEliza" \
    --content "file://UpdateEliza.yaml" \
    --document-version '$LATEST'
