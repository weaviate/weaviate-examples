import weaviate

client = weaviate.Client("http://localhost:8080")

# creating the Dog class with the following properties: filename, image, weight, and filepath

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
            "vectorizer": "img2vec-neural", # the img2vec-neural Weaviate vectorizer
            "properties": [
                {
                    "name": "breed",
                    "dataType": [
                        "string"
                    ],
                    "description": "name of dog breed",
                },
                {
                    "name": "image",
                    "dataType": [
                        "blob"
                    ],
                    "description": "image",
                },
                {
                    "name": "filepath",
                    "dataType":[
                        "string"
                    ],
                    "description": "filepath of the images",
                }
            ]
        }
    ]
}

# adding the schema 
client.schema.create(schema)
