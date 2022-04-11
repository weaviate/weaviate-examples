import pickle
import weaviate
import uuid
import datetime
import base64, json, os

client = weaviate.Client("http://localhost:8080")
print("Client created")

def testImage(nearImage):
    # This function takes in a dictionary with key as "image" and value as the path of that image.
    # Then it finds the most similar image to the uploaded image and returns its label.
    # In this, it uses image2vecneural.
    res = client.query.get("Vegetables", ["image","labelName"]).with_near_image(nearImage).do()
    # returning the labelName of the most similar image
    return (res['data']['Get']['Vegetables'][0]['labelName'])