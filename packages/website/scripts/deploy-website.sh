[[ "$TRACE" ]] && set -x

echo "deploy $1 to $CI_ENVIRONMENT_URL"

echo $APP_ENGINE_SERVICE_ACCOUNT > /tmp/$CI_PIPELINE_ID.json
gcloud auth activate-service-account --key-file /tmp/$CI_PIPELINE_ID.json
gcloud --quiet --project $GCLOUD_PROJECT_ID app deploy app-$1.yaml dispatch.yaml

rm /tmp/$CI_PIPELINE_ID.json