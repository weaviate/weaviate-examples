import weaviate
from create_schema import create_schema
from import_objects import read_images

client = weaviate.Client("http://localhost:8080")

print("Create FaceRecogition class")
create_schema(client)

print("Import images")
read_images(client)
