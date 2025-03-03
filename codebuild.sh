
aws codebuild start-build --region us-east-2 \
    --project-name github-runner-codebuild-eliza-build \
    --source-version $(git rev-parse --abbrev-ref HEAD) \
    --source-type-override GITHUB \
    --source-location-override https://github.com/meta-introspector/cloud-deployment-eliza.git \
    --git-clone-depth 1 \
    --git-submodules-config fetchSubmodules=true
