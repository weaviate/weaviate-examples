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
            "properties": [
                {
                    "name": "productId",
                    "dataType": ["string"],
                    "description": "id",
                },
                {
                    "name": "name",
                    "dataType": ["text"],
                    "description": "name of the product",
                },
                {
                    "name": "title",
                    "dataType": ["text"],
                    "description": "title of the product containing the supplier",
                },
                {
                    "name": "description",
                    "dataType": ["text"],
                    "description": "short description",
                },
                {
                    "name": "imageLink",
                    "dataType": ["string"],
                    "description": "link to an image of the product",
                },
                {
                    "name": "ean",
                    "dataType": ["string"],
                    "description": "unique product code ean",
                },
                {
                    "name": "releaseDate",
                    "dataType": ["date"],
                    "description": "date released",
                },
                {
                    "name": "supplier",
                    "dataType": ["Supplier"],
                    "description": "supplier",
                },
                {
                    "name": "price",
                    "dataType": ["number"],
                    "description": "price of the product",
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
                },
            ]
        },
    ]
}

# adding the schema 
client.schema.create(schema)

print("The schema has been defined.")