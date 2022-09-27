import weaviate

client = weaviate.Client("http://localhost:8080")

schema = {
    "classes": [
        {
            "class": "Dog",
            "description": "Images of different dogs",
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
                    "description":"name of the file",
                    "name": "filename"
                },
                {
                    "dataType": [
                        "blob"
                    ],
                    "description": "image",
                    "name": "image"
                },
                {
                    "dataType": [
                        "int"
                    ],
                    "description": "average weight of dog",
                    "name": "weight"
                }
            ]
        }
    ]
}

client.schema.create(schema)