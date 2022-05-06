'''This file adds the data (vegetable images) to weaviate instance
in the appropriate format.'''

import pickle
import weaviate
import uuid
import datetime
import base64, json, os
from own_vec import getFaceEncoding
from student_test import getFaces

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

# Connect to weaviate instance
client = weaviate.Client("http://localhost:8080")
print("Client created (student_own_add.py file)")

client.schema.delete_all()

# Create a schema to add Students
class_obj = {
        "class": "Students",
        "description": "Each example is an image of a student of DSAI discipline.",
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
                "description": "label name (student name) of the given image.",
                "name": "labelName"
            }

        ],
        "vectorizer": "none"
    }

client.schema.create_class(class_obj)
print("Schema class created")

# You can include more labels from the train folder, I have used 3 of them.
folders = os.listdir("students/")
for fol in folders:
    
    for img in os.listdir(f"students/{fol}"):
        
        try:
            
            # Adding base64 encoded image using weaviate utility function
            encoded_image = weaviate.util.image_encoder_b64(f"students/{fol}/{img}")
            
            data_properties = {
                "labelName": fol,
                "image": encoded_image
            }

            # using my own encoding generated using OpenCV
            vec = getFaceEncoding(f"students/{fol}/{img}")
            client.data_object.create(data_properties, "Students", generate_uuid('Students',fol+img),vector=vec)
        except:
            continue

    path = "students/"+fol
    print(f"{len(os.listdir(path))} Student images from {fol} added.")

print("Images added")

