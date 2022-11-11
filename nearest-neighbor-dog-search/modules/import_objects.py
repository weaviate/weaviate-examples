import re
import os
import weaviate


def import_data(client: weaviate.Client):
    """
    Process all images in [base64_images] folder and add import them into Dogs collection.

    Parameters
    ----------
    client : weaviate.Client
        The Weaviate client for which to import the data.
    """

    client.batch.configure(
        batch_size=100, 
        dynamic=True,
    )

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
            }

            batch.add_data_object(data_properties, "Dog")
