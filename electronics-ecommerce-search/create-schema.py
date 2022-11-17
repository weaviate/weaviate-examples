import os
import weaviate

WEAVIATE_URL = os.getenv('WEAVIATE_URL')
if not WEAVIATE_URL:
    WEAVIATE_URL = 'http://localhost:8080'

print(WEAVIATE_URL, flush=True)

client = weaviate.Client(WEAVIATE_URL)

# creating the Dog class with the following properties: breed, image, and filepath

schema = {
    "classes": [
        {
            "class": "Product",
            "description": "Electronics product",
            "vectorIndexType": "hnsw", 
            "vectorizer": "text2vec-transformers",
            "moduleConfig": {
                "text2vec-transformers": {
                    "poolingStrategy": "masked_mean",
                    "vectorizeClassName": False
                }
            },
            "properties": [
                {
                    "name": "productId",
                    "dataType": ["string"],
                    "description": "id",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": True,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "name",
                    "dataType": ["text"],
                    "description": "name of the product",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": False,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "title",
                    "dataType": ["text"],
                    "description": "title of the product containing the supplier",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": False,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "description",
                    "dataType": ["text"],
                    "description": "short description",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": False,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "imageLink",
                    "dataType": ["string"],
                    "description": "link to an image of the product",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": True,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "ean",
                    "dataType": ["string"],
                    "description": "unique product code ean",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": True,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "releaseDate",
                    "dataType": ["date"],
                    "description": "date released",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": True,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "supplier",
                    "dataType": ["Supplier"],
                    "description": "supplier",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": False,
                            "vectorizePropertyName": False
                        }
                    },
                },
                {
                    "name": "price",
                    "dataType": ["number"],
                    "description": "price of the product",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": True,
                            "vectorizePropertyName": False
                        }
                    },
                }
            ]
        }, {
            "class": "Supplier",
            "description": "supplier of electronics",
            "vectorIndexType": "hnsw", 
            "vectorizer": "text2vec-transformers",
            "properties": [
                {
                    "name": "name",
                    "dataType": ["string"],
                    "description": "name of the supplier",
                    "moduleConfig": {
                        "text2vec-transformers": {
                            "skip": False,
                            "vectorizePropertyName": False
                        }
                    },
                },
            ]
        },
    ]
}

# adding the schema 
client.schema.create(schema)

print("The schema has been defined.")