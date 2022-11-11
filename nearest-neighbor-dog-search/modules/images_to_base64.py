"""
Prepare images for the Weaviate import.
"""
import os
import shutil


def clear_base64_images(base64_encrypt_folder: str) -> None:
    """
    Clear directory with base64 encoded images.

    Parameters
    ----------
    base_folder : str
        The directory for the base64 encoded images to be imported to Weaviate.
    """
    

    # if the base64_images folder => delete it 
    if os.path.exists(base64_encrypt_folder):
        shutil.rmtree(base64_encrypt_folder)
    
    # create the base64 directory
    os.mkdir(base64_encrypt_folder)


def convert_images_to_base64() -> None:
    """
    Convert images to base64.
    """

    flask_app_images_dir = "./flask-app/static/img/"

    clear_base64_images("base64_images")

    for file_path in os.listdir(flask_app_images_dir): # grabbing the images in the images folder and converting them to base64
        filename = file_path.split("/")[-1]
        # this can be done using base64 python library, now this solution is linux compatible
        os.system(
            f"cat {flask_app_images_dir + file_path} | base64 > base64_images/{filename}.b64"
        )
