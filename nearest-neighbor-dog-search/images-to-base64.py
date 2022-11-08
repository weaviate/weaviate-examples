import os 
import shutil

def clear_base64_images():
    base_folder = "base64_images"

    # if the base64_images folder => delete it 
    if os.path.exists(base_folder):
        shutil.rmtree(base_folder)
    
    # create the base64_images folder
    os.mkdir(base_folder)  

def convert_images_to_base64():
    img_path = "./flask-app/static/img/"

    for file_path in os.listdir(img_path): # grabbing the images in the images folder and converting them to base64
        if ".DS_Store" not in file_path:
            filename = file_path.split("/")[-1]
            os.system("cat " + img_path + file_path + " | base64 > base64_images/" + filename + ".b64")

clear_base64_images()
convert_images_to_base64()

print("The images have been converted to base64.")
