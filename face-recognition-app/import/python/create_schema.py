import weaviate

def create_schema(client: weaviate.Client):
  class_obj = {
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
  }

  client.schema.create_class(class_obj)
