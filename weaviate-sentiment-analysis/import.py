import weaviate
import pandas as pd

#setting up client
client = weaviate.Client("http://localhost:8080")
client.timeout_config = (1000)

client.schema.delete_all()
#creating the schema
schema = {
    "classes": [
        {
            "class": "Comments",
            "properties": [
                {
                    "name": "sentiment",
                    "dataType": ["text"]
                },
                {
                    "name": "content",
                    "dataType": ["text"]
                }
            ]
        }
    ]
}
client.schema.create(schema)

#loading the dataset
data=pd.read_csv("./text_emotion.csv")

#adding data to weaviate
#Adding 5000 entries, try to add more entries for better performance
for i in range (1,5000):
    sentiment = str(data.iloc[i][1])
    obj = {
                "content": str(data.iloc[i][2]),
                "sentiment": sentiment
          }
    client.data_object.create(obj, "Comments")
    if(i%100 == 0):
        print(str(i)+" imported")
