import weaviate
import pandas as pd

#setting up client
client = weaviate.Client("http://localhost:8080")

#Checking if caption schema already exists, then delete it
current_schemas = client.schema.get()['classes']
for schema in current_schemas:
    if schema['class']=='Comments':
        client.schema.delete_class('Comments')
#creating the schema
comment_schema = {
    "class": "Comments",
    "description": "comments of people",
    "properties": [
        {
            "name": "comment",
            "dataType": ["string"],
            "description": "The text of the comment", 
        },
        {
            "name": "label",
            "dataType": ["string"],
            "description": "The label of the comment", 
        }
    ]
}
client.schema.create_class(comment_schema)

#loading the dataset
data=pd.read_csv("./train.csv")

#shuffling the datset
data=data.sample(frac=1)

#adding data to weaviate
#Adding only 1000 entries, you can increase or decrease the number of entries according to time
for i in range (0,1000):
    lab=""
    if(data.iloc[i][1]==1):
        lab="toxic"
    else:
        lab="Non Toxic"
    obj = {
                "comment": str(data.iloc[i][0]),
                "label": lab
          }
    client.data_object.create(obj, "Comments")
