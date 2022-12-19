import weaviate

client = weaviate.Client("http://localhost:8080")
print("Client created")

#Function to get label for the uploaded audio
def testImage(nearImage):
    res = client.query.get("Audiogenres", ["image","labelName"]).with_near_image(nearImage).do()
    return (res['data']['Get']['Audiogenres'][0]['labelName'])
    