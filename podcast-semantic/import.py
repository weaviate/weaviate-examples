import weaviate
import json
import helper

client = weaviate.Client("http://localhost:9999")
client.timeout_config = (10000) 

client.schema.delete_all()
schema = {
    "classes": [
        {
            "class": "Podcast",
            "properties": [
                {
                    "name": "title",
                    "dataType": ["text"]
                },
                {
                    "name": "transcript",
                    "dataType": ["text"]
                }
            ]
        }
    ]
}
client.schema.create(schema)

with open("data/podcast_ds.json", 'r') as f:
    datastore = json.load(f)
    
def add_podcasts(batch_size = 1):
    no_items_in_batch = 0
    for item in datastore:
        podcast_object = {
            "title": item["title"],
            "transcript": item["transcript"]
        }

        podcast_uuid = helper.generate_uuid('podcast', item["title"] + item["url"])
        client.batch.add_data_object(podcast_object, "Podcast", podcast_uuid)
        no_items_in_batch += 1

        if no_items_in_batch >= batch_size:
            results = client.batch.create_objects()

            for result in results:
                    if result['result'] != {}:
                        helper.log(result['result'])

            message = str(item["title"]) + ' imported'
            helper.log(message)

            no_items_in_batch = 0

    client.batch.create_objects()
    
add_podcasts(1)

