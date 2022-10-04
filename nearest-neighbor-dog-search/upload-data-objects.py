from fileinput import filename
import weaviate
from weaviate.util import generate_uuid5
import os

client = weaviate.Client("http://localhost:8080")

counter = 0

weight_dict = {
    "Bernese-Mountain-Dog.jpg": 90, 
    "Corgi.jpg": 25, 
    "German-Shepherd.jpg": 70, 
    "Australian-Shepherd.jpg": 52, 
    "Golden-Retriever.jpg": 65,
    "French-Bulldog.jpg": 22, 
    "Goldendoodle.jpg": 45, 
    "Labrador-Retriever.jpg": 65, 
    "Rottweiler.jpg": 103, 
    "Siberian-Husky.jpg": 48
}

for encoded_file_path in os.listdir("./base64_images"): 
    f = open("./base64_images/"+ encoded_file_path)
    base64_encoding = f.readlines()
    base64_encoding = ' '.join(base64_encoding)
    base64_encoding = base64_encoding.replace("\n", "").replace(" ", "") # to make sure there aren't any new lines or spaces when converting the images to base64 values

    labelName = encoded_file_path

    data_properties = { # the properties from our schema 
        "image": base64_encoding,
        "index": counter,
        "weight": weight_dict[labelName],
        "filepath": encoded_file_path
    }

    id = generate_uuid5(counter)
    counter += 1

    client.data_object.create(data_properties, "Dog", id) # uploading each data object


