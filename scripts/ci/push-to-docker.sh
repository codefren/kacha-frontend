set -e

if [[ -n "$CI_REGISTRY_USER" ]]; then
    echo "Setting Google Cloud Container Registry login auth"
        mkdir $HOME/.docker
        echo "$DOCKER_AUTH_CONFIG" > "$HOME/.docker/config.json"
    echo ""
fi

echo "Building Dockerfile-based application..."

docker build \
    --build-arg HTTP_PROXY="$HTTP_PROXY" \
    --build-arg http_proxy="$http_proxy" \
    --build-arg HTTPS_PROXY="$HTTPS_PROXY" \
    --build-arg https_proxy="$https_proxy" \
    --build-arg FTP_PROXY="$FTP_PROXY" \
    --build-arg ftp_proxy="$ftp_proxy" \
    --build-arg NO_PROXY="$NO_PROXY" \
    --build-arg no_proxy="$no_proxy" \
    -t "$CI_REGISTRY_PATH/$1/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA" -f Dockerfile ../..

echo "Pushing to GitLab Container Registry..."
docker push "$CI_REGISTRY_PATH/$1/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA"
echo ""