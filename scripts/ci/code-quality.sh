set -e 

docker run --env SOURCE_CODE="$PWD" \
    --volume "$PWD":/code \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    "registry.gitlab.com/gitlab-org/security-products/codequality:latest" /code