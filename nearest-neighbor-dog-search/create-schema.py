import weaviate

client = weaviate.Client("http://localhost:8080")

# creating the class "Dog" with the following properties: filename, image, weight, and filepath

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
                },
                {
                    "dataType":[
                        "string"
                    ],
                    "description": "filepath of the images",
                    "name": "filepath"
                }
            ]
        }
    ]
}

# adding the schema 
client.schema.create(schema)