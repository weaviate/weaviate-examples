import os
import weaviate


WEAVIATE_URL = os.getenv('WEAVIATE_URL')
if not WEAVIATE_URL:
    WEAVIATE_URL = 'http://localhost:8080'

client = weaviate.Client(WEAVIATE_URL)
schema = client.schema.get()
print(schema)
