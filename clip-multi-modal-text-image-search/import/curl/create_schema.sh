#!/bin/bash

curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "class": "MultiModal",
      "moduleConfig": {
          "multi2vec-clip": {
              "imageFields": [
                  "image"
              ]
          }
      },
      "vectorIndexType": "hnsw",
      "vectorizer": "multi2vec-clip",
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
        }
      ]
    }' \
    http://localhost:8080/v1/schema
