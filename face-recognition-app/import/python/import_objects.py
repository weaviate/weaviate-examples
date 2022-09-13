import weaviate
import os
import base64

def read_images(client: weaviate.Client):
  images_dir = "../../images"
  for dir in os.listdir(images_dir):
    dir_path = f"{images_dir}/{dir}"
    if os.path.isdir(dir_path):
      import_images(client, dir_path)

def import_images(client: weaviate.Client, dir: str):
  name = ""
  with open(f'{dir}/name.txt', 'r') as file:
    name = file.read().rstrip()

  for d in os.listdir(dir):
    if d.endswith("jpg") or d.endswith("jpeg"):
      filename = f"{dir}/{d}"
      with open(filename, "rb") as image_file:
        encoded = base64.b64encode(image_file.read())

        import_one_object(client, filename, encoded, name)

def import_one_object(client: weaviate.Client, filename: str, image: bytes, name: str):
  data_obj = {
    "filename": filename,
    "image": image.decode('utf-8'),
    "name": name
  }

  data_uuid = client.data_object.create(
    data_obj,
    "FaceRecognition",
  )

  print(f"{name}: imported object with id {data_uuid}")