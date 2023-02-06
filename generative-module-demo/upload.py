import weaviate
import json

client = weaviate.Client("http://localhost:8080")

with open('shorts.json', 'r') as f:
    shorts_data = json.load(f, strict = False)


for shorts in shorts_data["WeaviateShorts"]:
  properties = {
    "question": shorts["question"],
    "content": shorts["content"]
  }
  client.data_object.create(
    data_object = properties,
    class_name = "WeaviateShorts"
  )


with open('podcast-31.json', 'r') as f:
    podcast_data = json.load(f, strict = False)

for pod in podcast_data["PodClip"]:
    data_properties = {
        "content": pod["content"],
        "speaker": pod["speaker"],
        "podNum": pod["podNumber"]
    }
    client.data_object.create(
        data_object = data_properties,
        class_name = "PodClip",
    )

print("Uploaded data.")