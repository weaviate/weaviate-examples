'''This file adds the data (vegetable images) to weaviate instance
in the appropriate format.'''

import pickle
import weaviate
import uuid
import datetime
import base64, json, os

def generate_uuid(class_name: str, identifier: str,
                  test: str = 'teststrong') -> str:
    """ Generate a uuid based on an identifier
    :param identifier: characters used to generate the uuid
    :type identifier: str, required
    :param class_name: classname of the object to create a uuid for
    :type class_name: str, required
    """
    test = 'overwritten'
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, class_name + identifier))

def log(i: str) -> str:
    """ A simple logger
    :param i: the log message
    :type i: str
    """
    now = datetime.datetime.utcnow()
    print(now, "| " + str(i))

client = weaviate.Client("http://localhost:8080")
print("Client created")

client.schema.delete_all()
# Create a schema to add vegetables
class_obj = {
        "class": "Vegetables",
        "description": "Each example is an image of a vegetable, associated with a label from available classes.",
        "moduleConfig": {
            "img2vec-neural": {
                "imageFields": [
                    "image"
                ]
            }
        },
        "properties": [
            {
                "dataType": [
                    "blob"
                ],
                "description": "Coloured image",
                "name": "image"
            },
            {
                "dataType": [
                    "number"
                ],
                "description": "Label number for the given image.",
                "name": "labelNumber"
            },
            {
                "dataType": [
                    "string"
                ],
                "description": "label name (description) of the given image.",
                "name": "labelName"
            }

        ],

        "vectorIndexType": "hnsw",
        "vectorizer": "img2vec-neural"
    }

client.schema.create_class(class_obj)
print("Schema class created")

# You can include more labels from the train folder, I have used 3 of them.
folders = ['Cauliflower','Carrot','Radish'] 
for fol in folders:
    # I took only 100 images from each folder 'Cauliflower','Carrot' and 'Radish'. 
    cnt = 100 
    for img in os.listdir(f"/train/{fol}"):
        # Make sure to change path, to add images from your system
        encoded_image = weaviate.util.image_encoder_b64(f"D:/W/weaviate-examples/vegetable-classification/train/{fol}/{img}")
        
        data_properties = {
            "labelName": fol,
            "image": encoded_image
        }
        client.data_object.create(data_properties, "Vegetables", generate_uuid('Vegetables',fol+img))
        cnt-=1
        if cnt==0:break

    print(f"100 Vegetable images from {fol} added.")

print("Images added")