# Example docker-compose configuration file with text2vec-contextionary and demo dataset

Here you find an example docker-compose configuration file to start up Weaviate with the [`text2vec-contextionary module`](https://weaviate.io/developers/weaviate/modules/text2vec-contextionary) and a News Publications example dataset. 

## How to use

Download the `docker-compose.yml` file. In the folder where you stored the file, run `docker-compose up`. Now, Weaviate, the [`text2vec-contextionary module`](https://weaviate.io/developers/weaviate/modules/text2vec-contextionary) and the demo dataset will be retrieved, Weaviate will start up with the text2vec-contextionary module, and load in the demo data. Weaviate will be running at `localhost:8080`. 

You can then query the dataset with your favorite method. For example with the [python client](https://weaviate.io/developers/weaviate/client-libraries/python):

```python
import weaviate

with weaviate.connect_to_local() as client:
    articles = client.collections.get("Article")
    response = articles.query.hybrid(query="Hockey",limit=2)
    for o in response.objects:
        print(o.properties)
```
