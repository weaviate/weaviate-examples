from fileinput import filename
import weaviate
from weaviate.util import generate_uuid5
import os

client = weaviate.Client("http://localhost:8080")

counter = 0

weight_dict = {"Australian-Shepherd.jpg": 52,
                "Bernese-Mountain-Dog.jpg": 94,
                "Corgi.jpg": 26,
                "French-Bulldog.jpg": 22,
                "German-Shepherd.jpg": 68,
                "Golden-Retriever.jpg": 70,
                "Goldendoodle.jpg": 40,
                "Labrador-Retriever.jpg": 67,
                "Rottweiler.jpg": 103,
                "Siberian-Husky.jpg": 47
}

# Uploading one object at a time rather than batch importing 
for encoded_file_path in os.listdir("./base64_images"): 
    f = open("./base64_images/"+ encoded_file_path)
    base64_encoding = f.readlines()
    base64_encoding = ' '.join(base64_encoding)
    base64_encoding = base64_encoding.replace("\n", "").replace(" ", "") 

    labelName = encoded_file_path

# The properties from our schema
    data_properties = {
        "breed": encoded_file_path.replace(".jpg", ""),
        "image": base64_encoding,
        "index": counter,
        "filepath": encoded_file_path,
        "weight": weight_dict[labelName],
    }

# Each object needs to have a unique identifier 
    id = generate_uuid5(counter)
    counter += 1

# Uploading each data object to Weaviate 
    client.data_object.create(data_properties, "Dog", id)


print("The objects have been uploaded to Weaviate.")