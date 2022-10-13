import os 
import base64

# Do NOT run this file. The images have already been converted and are in the base64_images folder

os.mkdir("base64_images") # create the base64_images folder 

for file_path in os.listdir("./images"): # grabbing the images in the images folder and converting them to base64
    if ".DS_Store" not in file_path:
        filename = file_path.replace(".jpg", "").split("/")[-1]
        os.system("cat " + "images/" + file_path + " | base64 > base64_images/" + filename + ".jpg")
