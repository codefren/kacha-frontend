set -e

function install_dependencies() {
    apk add -U openssl curl tar gzip bash ca-certificates git
    curl -L -o /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
    curl -L -O https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk
    apk add glibc-2.28-r0.apk
    rm glibc-2.28-r0.apk

    curl -L -o /usr/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v${KUBERNETES_VERSION}/bin/linux/amd64/kubectl"
    chmod +x /usr/bin/kubectl
    kubectl version --client
}

function authenticate_k8s() {
    kubectl config set-cluster easyroute --server="$K8S_URL" --certificate-authority="$K8S_CA_PEM"
    kubectl config set-credentials admin --token="$K8S_TOKEN"
    kubectl config set-context default-context --cluster=easyroute --user=admin
    kubectl config use-context default-context
}

function ensure_namespace() {
    kubectl describe namespace "$PACKAGE_NAME" || kubectl create namespace "$PACKAGE_NAME"
}

# Extracts variables prefixed with K8S_SECRET_
# and creates a Kubernetes secret.
#
# e.g. If we have the following environment variables:
#   K8S_SECRET_A=value1
#   K8S_SECRET_B=multi\ word\ value
#
# Then we will create a secret with the following key-value pairs:
#   data:
#     A: dmFsdWUxCg==
#     B: bXVsdGkgd29yZCB2YWx1ZQo=
function create_application_secret() {
    export APPLICATION_SECRET_NAME="$CI_ENVIRONMENT_SLUG-secret"

    export DB_INDEX=3
    case ${CI_ENVIRONMENT_SLUG} in
            development)
                    export DB_INDEX=2
                    ;;
            staging)
                    export DB_INDEX=1
                    ;;
            production)
                    export DB_INDEX=0
    esac


    export K8S_SECRET_URL=$CI_ENVIRONMENT_URL
    export K8S_SECRET_NODE_ENV=$CI_ENVIRONMENT_SLUG
    export K8S_SECRET_REDIS_URL=redis://@${REDIS_HOST}:${REDIS_PORT}/${DB_INDEX}
    export K8S_SECRET_DATABASE_URL=$DATABASE_SERVER/$CI_ENVIRONMENT_SLUG

    export CAPS_CI_ENVIRONMENT_SLUG=$(echo $CI_ENVIRONMENT_SLUG | tr a-z A-Z)
    export CAPS_PACKAGE_NAME=$(echo $PACKAGE_NAME | tr a-z A-Z)

    env | sed -n "s/^\(${CAPS_CI_ENVIRONMENT_SLUG}__\)\{0,1\}\(${CAPS_PACKAGE_NAME}__\)\{0,1\}K8S_SECRET_\(.*\)$/\3/p" > k8s_prefixed_variables

    kubectl create secret \
        -n "$PACKAGE_NAME" generic "$APPLICATION_SECRET_NAME" \
        --from-env-file k8s_prefixed_variables -o yaml --dry-run | 
        kubectl replace -n "$PACKAGE_NAME" --force -f -

    rm k8s_prefixed_variables
}

function deploy() {
    name="$CI_ENVIRONMENT_SLUG"

    k8s_folder="k8s/$name"

    create_application_secret "$name"

    image_url="$CI_REGISTRY_PATH/$PACKAGE_NAME/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA"

    sed -ie "s~IMAGE_URL~$image_url~g" "$k8s_folder/deployment.yml"

    kubectl apply -f "$k8s_folder"

    kubectl rollout status -n "$PACKAGE_NAME" -w "deployment/$name"
}

export PACKAGE_NAME="$1"

install_dependencies
authenticate_k8s
ensure_namespace
create_application_secret
deploy