from fileinput import filename
import weaviate
from weaviate.util import generate_uuid5
import os

client = weaviate.Client("http://localhost:8080")

counter = 0

for encoded_file_path in os.listdir("./base64_images"): 
    f = open("./base64_images/"+ encoded_file_path)
    base64_encoding = f.readlines()
    base64_encoding = ' '.join(base64_encoding)
    base64_encoding = base64_encoding.replace("\n", "").replace(" ", "") 

    labelName = encoded_file_path

    data_properties = { # the properties from our schema
        "breed": encoded_file_path.replace(".jpg", ""),
        "image": base64_encoding,
        "index": counter,
        "filepath": encoded_file_path
    }

    id = generate_uuid5(counter)
    counter += 1

    client.data_object.create(data_properties, "Dog", id) # uploading each data object


