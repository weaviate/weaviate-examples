#!/bin/bash

import_images() {
  name=`<$1/name.txt`
  echo $name
  for img in $1/*.jp*; do
    encoded=$(cat $img | base64)
    curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{
      \"class\": \"FaceRecognition\",
      \"properties\": {
        \"filename\": \"$img\",
        \"image\": \"$encoded\",
        \"name\": \"$name\"
      }
    }" \
      http://localhost:8080/v1/objects
  done
}

for dir in images/*; do
  import_images $dir
done
