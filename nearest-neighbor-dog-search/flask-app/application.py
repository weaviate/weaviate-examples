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
     return render_template("index.html", content = [{"path": "./static/Bernese-Mountain-Dog.jpg", "weight": 90},{"path": "./static/Corgi.jpg", "weight": 25}, {"path": "./static/Goldendoodle.jpg", "weight": 45},
     {"path": "./static/Rottweiler.jpg", "weight": 103}, {"path": "./static/Australian-Shepherd.jpg", "weight": 52}, {"path": "./static/Golden-Retriever.jpg", "weight": 65}, {"path": "./static/German-Shepherd.jpg", "weight": 70},
     {"path": "./static/Siberian-Husky.jpg", "weight": 48}, {"path": "./static/Labrador-Retriever.jpg", "weight": 65},{"path": "./static/French-Bulldog.jpg", "weight": 22} ])

@app.route("/process_image", methods = ["POST"])
def process_image():
    uploaded_file = Image.open(request.files['filepath'].stream)
    buffer = BytesIO()
    uploaded_file.save(buffer, format="JPEG")
    img_str = base64.b64encode(buffer.getvalue()).decode()
    nearImage = { "image": img_str}
    weaviate_results = client.query.get("Dog", "filepath").with_near_image(nearImage, encode=False).with_limit(2).do()
    weaviate_results = weaviate_results["data"]["Get"]["Dog"]
    print(weaviate_results)
    results = []
    for result in weaviate_results:
        results.append({
            "path": "./static/" + result["filepath"]
         })
    print(f"\n {results} \n")
    return render_template("index.html", content = results, dog_image = img_str)

# run the app
if __name__ == "__main__": 
    app.run()