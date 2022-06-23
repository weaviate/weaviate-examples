#!/bin/bash

import_images() {
  for img in $1; do

      encoded=$(cat $img | base64)
      curl \
      -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"class\": \"MultiModal\",
        \"properties\": {
          \"filename\": \"$img\",
          \"image\": \"$encoded\"
      }
    }" \
      http://localhost:8080/v1/objects
  done
}

import_images "images/*.jpg"
