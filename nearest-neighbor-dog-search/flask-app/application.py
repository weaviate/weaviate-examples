from flask import Flask, render_template, request
from PIL import Image
import base64
from io import BytesIO
import weaviate
import os

WEAVIATE_URL = os.getenv('WEAVIATE_URL')
if not WEAVIATE_URL:
    WEAVIATE_URL = 'http://localhost:8080'

# creating the application and connecting it to the Weaviate local host 
app = Flask(__name__) 
app.config["UPLOAD_FOLDER"] = "/temp_images"
client = weaviate.Client(WEAVIATE_URL)

def weaviate_img_search(img_str):
    """
    This function uses the nearImage operator in Weaviate. 
    """
    sourceImage = { "image": img_str}

    weaviate_results = client.query.get(
        "Dog", ["filepath","breed"]
        ).with_near_image(
            sourceImage, encode=False
        ).with_limit(2).do()

    return weaviate_results["data"]["Get"]["Dog"]

def list_images():
    """
    Checks the static/img folder and returns a list of image paths
    """
    if os.path.exists('./flask-app'):
        img_path = "./flask-app/static/img/"
    elif os.path.exists('./static'):
        img_path = "./static/img/"
    else:
        return []

    images = []
    for file_path in os.listdir(img_path):
        images.append({
            "path": file_path
        })

    return images


if client.is_ready():    
    # Defining the pages that will be on the website 
    @app.route("/") 
    def home(): # home page
        return render_template("index.html", content = list_images())

    @app.route("/process_image", methods = ["POST"]) # save the uploaded image and convert it to base64

    # process the image upload request by converting it to base64 and querying Weaviate
    def process_image():
            uploaded_file = Image.open(request.files['filepath'].stream)
            buffer = BytesIO() 
            uploaded_file.save(buffer, format="JPEG")
            img_str = base64.b64encode(buffer.getvalue()).decode()

            weaviate_results = weaviate_img_search(img_str)
            print(weaviate_results)

            results = []
            for result in weaviate_results:
                results.append({
                    "path": result["filepath"], 
                    "breed": result["breed"]
                })

            print(f"\n {results} \n")
            return render_template("index.html", content = results, dog_image = img_str)

else:
    print("There is no Weaviate Cluster Connected.")

# run the app
if __name__ == "__main__": 
    app.run(host='0.0.0.0', port='5000')
