from fileinput import filename
from unittest import result
from flask import Flask, render_template, request
from PIL import Image
import base64
from io import BytesIO
import weaviate

app = Flask(__name__) 
app.config["UPLOAD_FOLDER"] = "/temp_images"
client = weaviate.Client("http://localhost:8080")

# defining the pages that will be on the website 
@app.route("/") # define how you can access this page 
def home(): # home page
     return render_template("index.html", content = [
        {"path": "./static/Bernese-Mountain-Dog.jpg"},
        {"path": "./static/Corgi.jpg"}, 
        {"path": "./static/Goldendoodle.jpg"},
        {"path": "./static/Rottweiler.jpg"}, 
        {"path": "./static/Australian-Shepherd.jpg"}, 
        {"path": "./static/Golden-Retriever.jpg"}, 
        {"path": "./static/German-Shepherd.jpg"},
        {"path": "./static/Siberian-Husky.jpg"}, 
        {"path": "./static/Labrador-Retriever.jpg"},
        {"path": "./static/French-Bulldog.jpg"} 
        ])

def imageSearch(img_str):
    sourceImage = { "image": img_str}

    weaviate_results = client.query.get(
        "Dog", ["filepath","breed"]
    ).with_near_image(
        sourceImage, encode=False
    ).with_limit(2).do()

    return weaviate_results["data"]["Get"]["Dog"]

@app.route("/process_image", methods = ["POST"])
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
            "path": "./static/" + result["filepath"], 
            "breed": result["breed"]
         })
    print(f"\n {results} \n")
    return render_template("index.html", content = results, dog_image = img_str)

# run the app
if __name__ == "__main__": 
    app.run()