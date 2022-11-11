"""
Create Dog class in Weaviate.
"""
import sys
import weaviate


def create_dog_class_schema(client: weaviate.Client) -> None:
    """
    Create Dog class schema in Weaviate.

    Parameters
    ----------
    client : weaviate.Client
        The Weaviate client instance where to create the Dog class schema.
    """

    dog_class_schema = {
        "class": "Dog",
        "description": "Images of different dogs",
        "moduleConfig": {
            "img2vec-neural": {"imageFields": ["image"]}
        },
        "vectorIndexType": "hnsw", 
        "vectorizer": "img2vec-neural",
        "properties": [
            {
                "name": "breed",
                "dataType": ["string"],
                "description": "name of dog breed",
            },
            {
                "name": "image",
                "dataType": ["blob"],
                "description": "image",
            },
            {
                "name": "filepath",
                "dataType":["string"],
                "description": "filepath of the images",
            },
        ]
    }

    if client.schema.contains({"class": "Dog", "properties": []}):
        client.schema.delete_class("Dog")
    client.schema.create_class(dog_class_schema)
