from fileinput import filename
import weaviate
from weaviate.util import generate_uuid5
import os

client = weaviate.Client("http://localhost:8080")

counter = 0

weight_dict = {"Bernese-Mountain-Dog.txt": 90, "Corgi.txt": 25, "German-Shepherd.txt": 70, "Australian-Shepherd.txt": 52, "Golden-Retriever.txt": 65,
"French-Bulldog.txt": 22, "Goldendoodle.txt": 45, "Labrador-Retriever.txt": 65, "Rottweiler.txt": 103, "Siberian-Husky.txt": 48}

for encoded_file_path in os.listdir("./base64_images"):
    f = open("./base64_images/"+ encoded_file_path)
    base64_encoding = f.readlines()
    base64_encoding = ' '.join(base64_encoding)
    base64_encoding = base64_encoding.replace("\n", "").replace(" ", "") 

    labelName = encoded_file_path.replace(".jpg", "")

    data_properties = {
        "filename": labelName,
        "image": base64_encoding,
        "index": counter,
        "weight": weight_dict[labelName]
    }

    id = generate_uuid5(counter)
    counter += 1

    client.data_object.create(data_properties, "Dog", id)