'''This file contains code that adds data to weaviate from the Images folder.
These images will be the ones with which the module multi2-vec-clip will compare
the image or text query given by the user.'''

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

client = weaviate.Client("http://localhost:8080")
print("Client created")

#Checking if caption schema already exists, then delete it
current_schemas = client.schema.get()['classes']
for schema in current_schemas:
    if schema['class']=='ClipExample':
        client.schema.delete_class('ClipExample')
# Create a schema to add images
# I have used the web page https://weaviate.io/developers/weaviate/v1.11.0/retriever-vectorizer-modules/multi2vec-clip.html
# to get help on making a suitable schema. You can read the contents of this web page to know more.
class_obj = {
    "class": "ClipExample",
        "description": "A class to implement CLIP example",
        "moduleConfig": {
        "multi2vec-clip": {
          "imageFields": [
              "image"
          ],
          "textFields": [
              "text"
          ],
          "weights": {
            "textFields": [0.7],
            "imageFields": [0.3]
          }
        }
      },
        "vectorIndexType": "hnsw",
        "vectorizer": "multi2vec-clip",
        "properties": [
            {
            "dataType": [
                "string"
            ],
            "name": "text"
            },
            {
            "dataType": [
                "blob"
            ],
            "name": "image"
            }
        ]
    }

client.schema.create_class(class_obj)
print("Schema class created")


# Adding all images from static/Images folder
for img in os.listdir("static/Images/"):
    
    encoded_image = weaviate.util.image_encoder_b64(f"static/Images/{img}")
    
    data_properties = {
        "image": encoded_image,
        "text":img
    }
    client.data_object.create(data_properties, "ClipExample", generate_uuid('ClipExample',img))
print("Images added")

# You can try uncommenting the below code to add text as well
# After adding the texts, these texts can also be fetched as results if their
# embeddings are similar to the embedding of the query. Currently the frontend is
# designed so as to accommodate these as well. 

# Adding texts
# texts = [
#     'A dense forest',
#     'A beautiful beach',
#     'people playing games',
#     'Students syudying in class',
#     'a beautiful painting',
#     'place with scenic beauty',
#     'confident woman',
#     'cute little creature',
#     'players playing badminton'
# ]
# for txt in texts:
#     data_properties = {
#         "text":txt
#     }
#     client.data_object.create(data_properties, "ClipExample", generate_uuid('ClipExample',txt))
# print("Texts added")