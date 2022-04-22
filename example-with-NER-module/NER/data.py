'''This file adds data to the weaviate instance'''
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
print("Client created (data.py)")

client.schema.delete_all()

# Here I have created a simple schema to add some data
class_obj = {
    "class": "Comment",
    "properties": [{
        "name": "content",
        "dataType": ["text"],
    }]
}
client.schema.create_class(class_obj)
print("Schema class created")

# Here I add some data. This is like a data of say people in a group
# and we want to figure out and collect their names, the place where they live
# and the organization that they work for. We use the NER module for this.
comments = [
    'I am John and I live in USA. I work at Microsoft',
    'I am James and I am studying in London. I am an intern at Google',
    'My name is Jason and I work at Facebook,London',
    'Peter here, I am an engineer at Apple, California',
]

for com in comments:
    data_obj = {
    "content": com
    }
    client.data_object.create(
    data_obj,
    "Comment",
    generate_uuid('Comment',com)
    )
print("Finished importing data")
