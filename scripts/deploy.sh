#!/usr/bin/env bash

if [[ "${BRANCH}" == "master" ]]; then 
  export NODE_ENV=production
else
  export NODE_ENV=development
fi

npm run build

curl -X POST -H "Content-Type: application/json" \
    -d "{\"environment\":\"production\",\"username\":\"karr.lab.daemon\",\"repository\":\"https://github.com/KarrLab/datanator_frontend\",\"revision\":\"${COMMIT_REF}\"}" \
    "https://airbrake.io/api/v4/projects/275996/deploys?key=527a182e6ad1d36557df055c2d85df51"
