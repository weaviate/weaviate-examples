#importing required libraries
import weaviate
import os

#Setting up the client
client = weaviate.Client("http://localhost:8080")
print("Client created")

#Checking if Audiogenres schema already exists, then delete it
current_schemas = client.schema.get()['classes']
for schema in current_schemas:
    if schema['class']=='Audiogenres':
        client.schema.delete_class('Audiogenres')


class_obj = {
        "class": "Audiogenres",
        "description": "Each object contains an image of a spectrogram and a label about genre of that spectrogram",
        "moduleConfig": {
            "img2vec-neural": {
                "imageFields": [
                    "image"
                ]
            }
        },
        "properties": [
            {
                "dataType": [
                    "blob"
                ],
                "description": "spectrogram image",
                "name": "image"
            },
            {
                "dataType": [
                    "string"
                ],
                "description": "label name (genre) of the given spectrogram.",
                "name": "labelName"
            }

        ],

        "vectorIndexType": "hnsw",
        "vectorizer": "img2vec-neural"
    }

client.schema.create_class(class_obj)

#Configure batch process - for faster imports 
#see: https://weaviate.io/developers/weaviate/current/restful-api-references/batch.html
client.batch.configure(
  batch_size=10, 
  # dynamically update the `batch_size` based on import speed
  dynamic=True,
  timeout_retries=3,
)

folders = ['blues','classical','country','disco','hiphop','jazz','metal','pop','reggae','rock']; 
for fol in folders:
    for img in os.listdir(f"images_original/{fol}"):
        
        encoded_image = weaviate.util.image_encoder_b64(f"images_original/{fol}/{img}")
        
        data_properties = {
            "labelName": fol,
            "image": encoded_image
        }
        
        try:
            client.data_object.create(data_properties, "Audiogenres")
        except BaseException as error:
            print("Import Failed at: ",i)
            print("An exception occurred: {}".format(error))
            # Stop the import on error
            break

    print(f"All images from {fol} added.")

client.batch.flush()