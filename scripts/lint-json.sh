#!/usr/bin/env bash

# find json files
tmpfile=$(mktemp)
find . -name "*.json" -not -path "./node_modules/*" -print0 > $tmpfile

#lint files and collect error status
export error=0
while IFS= read -r -d '' line; do
  if [[ "$line" != "./package.json" && "$line" != "./package-lock.json" ]]; then
    jsonlint -p -i -q "$line"
    if [[ $? -ne 0 ]]; then export error=1; fi
  fi
done < $tmpfile

# return error status
if [[ $error -eq 0 ]]
then
  exit 0;
else
  exit 1;
fi