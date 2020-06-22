#!/usr/bin/env bash

if [[ "${BRANCH}" == "master" ]]; then 
  export NODE_ENV=production
else
  export NODE_ENV=development
fi

npm run build

curl -X POST -H "Content-Type: application/json" \
    -d "{\"environment\":\"${NODE_ENV}\",\"username\":\"${BUILD_USERNAME}\",\"repository\":\"https://github.com/KarrLab/datanator_frontend\",\"revision\":\"${COMMIT_REF}\"}" \
    "https://airbrake.io/api/v4/projects/${AIRBRAKE_PROJECT_ID}/deploys?key=${AIRBRAKE_PROJECT_KEY}"
