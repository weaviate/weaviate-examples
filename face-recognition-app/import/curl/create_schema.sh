#!/bin/bash

while ! curl --fail -o /dev/null -s http://localhost:8080/v1/.well-known/ready; do
  echo "Waiting for Weaviate to be ready..."
  sleep 1;
done


curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "class": "FaceRecognition",
      "moduleConfig": {
          "img2vec-neural": {
              "imageFields": [
                  "image"
              ]
          }
      },
      "vectorIndexType": "hnsw",
      "vectorizer": "img2vec-neural",
      "properties": [
        {
          "dataType": [
            "string"
          ],
          "name": "filename"
        },
        {
          "dataType": [
              "blob"
          ],
          "name": "image"
        },
        {
          "dataType": [
            "string"
          ],
          "name": "name"
        }
      ]
    }' \
    http://localhost:8080/v1/schema
