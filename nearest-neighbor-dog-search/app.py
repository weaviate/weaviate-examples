import os
import base64
import time
from io import BytesIO
from PIL import Image
import weaviate
from flask import Flask, render_template, request
from modules.images_to_base64 import convert_images_to_base64
from modules.create_schema import create_dog_class_schema
from modules.import_objects import import_data


time.sleep(5)


WEAVIATE_URL = os.getenv('WEAVIATE_URL')
if not WEAVIATE_URL:
    WEAVIATE_URL = 'http://localhost:8080'

client = weaviate.Client(WEAVIATE_URL)

app = Flask(
    import_name=__name__,
    template_folder='flask-app/templates',
    static_folder='flask-app/static',
) 
app.config["UPLOAD_FOLDER"] = "./temp_images"


def weaviate_img_search(base64_img: str) -> list:
    """
    This function uses the nearImage operator in Weaviate.

    Parameters
    ----------
    base64_img : str
        The base64 encoded image to be used in nearImage filter.

    Returns
    -------
    list
        A list of Dog images (Weaviate objects).
    """

    global client

    weaviate_results = (
        client.query
        .get("Dog", ["filepath","breed"])
        .with_near_image({"image": base64_img}, encode=False)
        .with_limit(2)
        .do()
    )

    return weaviate_results["data"]["Get"]["Dog"]


def list_images() -> list:
    """
    Checks the static/img folder and returns a list of image paths.

    Returns
    -------
    list
        Image paths from the static/img as a list.
    """

    if os.path.exists('./flask-app'):
        img_path = "./flask-app/static/img/"
    elif os.path.exists('./static'):
        img_path = "./static/img/"
    else:
        return []

    return [{"path": file_path} for file_path in os.listdir(img_path)]


# Defining the pages that will be on the website 
@app.route("/") 
def home():
    """
    Render home page.
    """

    return render_template("index.html", content = list_images())


@app.route("/process_image", methods = ["POST"]) # save the uploaded image and convert it to base64
def process_image():
    """
    Process the image upload request by converting it to base64 and querying Weaviate
    """

    uploaded_file = Image.open(request.files['filepath'].stream)
    buffer = BytesIO() 
    uploaded_file.save(buffer, format="JPEG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    weaviate_results = weaviate_img_search(img_str)

    results = []
    for result in weaviate_results:
        results.append({
            "path": result["filepath"], 
            "breed": result["breed"]
        })
    return render_template("index.html", content = results, dog_image = img_str)


if __name__ == "__main__":
    convert_images_to_base64()
    print("The images have been converted to base64.")

    create_dog_class_schema(client)
    print("The schema has been defined.")

    import_data(client)
    print("The objects have been uploaded to Weaviate.")

    kwargs = {}
    if os.getenv('HOST'):
        kwargs = {'host': os.getenv('HOST')}

    app.run(**kwargs)
