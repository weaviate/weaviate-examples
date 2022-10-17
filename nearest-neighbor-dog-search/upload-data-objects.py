from fileinput import filename
import weaviate
import os, re

weight_dict = {
    "Australian Shepherd": 52,
    "Bernese Mountain Dog": 94,
    "Corgi": 26,
    "French Bulldog": 22,
    "German Shepherd": 68,
    "Golden Retriever": 70,
    "Goldendoodle": 40,
    "Labrador Retriever": 67,
    "Rottweiler": 103,
    "Siberian Husky": 47
}

def get_weight(breed_name):
    if breed_name in weight_dict:
        return weight_dict[breed_name]
    return 50

def set_up_batch():
    """
    Prepare batching configuration to speed up deleting and importing data.
    """
    client.batch.configure(
        batch_size=100, 
        dynamic=True,
        timeout_retries=3,
        callback=None,
    )
    
def clear_up_dogs():
    """
    Remove all objects from the Dogs collection.
    This is useful, if we want to rerun the import with different pictures.
    """
    with client.batch as batch:
        batch.delete_objects(
            class_name="Dog",
            # same where operator as in the GraphQL API
            where={
                "operator": "NotEqual",
                "path": ["breed"],
                "valueString": "x"
            },
            output="verbose",
        )

def import_data():
    """
    Process all images in [base64_images] folder and add import them into Dogs collection
    """

    with client.batch as batch:
        # Iterate over all .b64 files in the base64_images folder
        for encoded_file_path in os.listdir("./base64_images"):
            with open("./base64_images/" + encoded_file_path) as file:
                file_lines = file.readlines()

            base64_encoding = " ".join(file_lines)
            base64_encoding = base64_encoding.replace("\n", "").replace(" ", "") 

            # remove .b64 to get the original file name
            image_file = encoded_file_path.replace(".b64", "")

            # remove image file extension and swap - for " " to get the breed name
            breed = re.sub(".(jpg|jpeg|png)", "", image_file).replace("-", " ")

            # The properties from our schema
            data_properties = {
                "breed": breed,
                "image": base64_encoding,
                "filepath": image_file,
                "weight": get_weight(breed)
            }

            # Uploading each data object to Weaviate 
            batch.add_data_object(data_properties, "Dog")

client = weaviate.Client("http://localhost:8080")
set_up_batch()
clear_up_dogs()
import_data()

print("The objects have been uploaded to Weaviate.")
