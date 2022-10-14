from fileinput import filename
from unittest import result
from flask import Flask, render_template, request
from PIL import Image
import base64
from io import BytesIO
import weaviate

# creating the application and connecting it to the Weaviate local host 
app = Flask(__name__) 
app.config["UPLOAD_FOLDER"] = "/temp_images"
client = weaviate.Client("http://localhost:8080")

def imageSearch(img_str):
    """
    This function uses the nearImage operator in Weaviate. 

        Parameters: 
            img_str(str): base64 of the image 
        
        Returns:
            returns a list of dictionaries, each dictionary has keys:
                "filepath": (str) // the filepath to the image
                "breed":    (str) // the breed of the dog
    """
    sourceImage = { "image": img_str}

    weaviate_results = client.query.get(
        "Dog", ["filepath","breed"]
        ).with_near_image(
            sourceImage, encode=False
        ).with_limit(2).do()

    return weaviate_results["data"]["Get"]["Dog"]

if client.is_ready():    
    # Defining the pages that will be on the website 
    @app.route("/") # defining the pages that will be on the website 
    def home(): # home page
        return render_template("index.html", content = [
            {"path": "./static/img/Bernese-Mountain-Dog.jpg"},
            {"path": "./static/img/Corgi.jpg"}, 
            {"path": "./static/img/Goldendoodle.jpg"},
            {"path": "./static/img/Rottweiler.jpg"}, 
            {"path": "./static/img/Australian-Shepherd.jpg"}, 
            {"path": "./static/img/Golden-Retriever.jpg"}, 
            {"path": "./static/img/German-Shepherd.jpg"},
            {"path": "./static/img/Siberian-Husky.jpg"}, 
            {"path": "./static/img/Labrador-Retriever.jpg"},
            {"path": "./static/img/French-Bulldog.jpg"} 
            ])

    @app.route("/process_image", methods = ["POST"]) # save the uploaded image and convert it to base64

    def process_image():
            uploaded_file = Image.open(request.files['filepath'].stream)
            buffer = BytesIO() 
            uploaded_file.save(buffer, format="JPEG")
            img_str = base64.b64encode(buffer.getvalue()).decode()

            weaviate_results = imageSearch(img_str)
            print(weaviate_results)

            results = []
            for result in weaviate_results:
                results.append({
                    "path": "./static/img/" + result["filepath"], 
                    "breed": result["breed"]
                })

            print(f"\n {results} \n")
            return render_template("index.html", content = results, dog_image = img_str)

else:
    print("There is no Weaviate Cluster Connected.")

# run the app
if __name__ == "__main__": 
    app.run()