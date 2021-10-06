# Unmask Superheroes in 5 steps using the Weaviate NLP module

A simple example in Python (you can also use other [client libs](https://www.semi.technology/developers/weaviate/current/client-libraries/)) showing how Weaviate can help you unmask superheroes thanks to its vector search capabilities 🦸

Make sure you have an empty Weaviate running. You can do so by running `docker-compose up` in the folder where you saved the `docker-compose.yml` file.

1. Connect to a Weaviate

```python
import weaviate
client = weaviate.Client("http://localhost:8080")
```

2. Add a class to the schema

```python
classObj = {
    "class": "Superhero",
    "description": "A class describing a super hero",
    "properties": [
        {
            "name": "name",
            "dataType": [
                "string"
            ],
            "description": "Name of the super hero"
        }
    ],
    "vectorizer": "text2vec-contextionary" # Tell Weaviate to vectorize the content
}
client.schema.create_class(classObj) # returns None if successful
```

Step 3. Add the superheroes with a batch request

```python

batman = {
    "name": "Batman"
}
superman = {
    "name": "Superman"
}

client.batch.add_data_object(batman, "Superhero")
client.batch.add_data_object(superman, "Superhero")
client.batch.create_objects()
```

Step 4. Try to find superheroes in the vectorspace

```python
def findAlterego(alterEgo):
    whoIsIt = client.query.get(
        "Superhero",
        ["name", "_additional {certainty, id } "]
    ).with_near_text({
        "concepts": [alterEgo] # query that gets vectorized 🪄
    }).do()

    print(
        alterEgo, "is", whoIsIt['data']['Get']['Superhero'][0]['name'],
        "with a certainy of", whoIsIt['data']['Get']['Superhero'][0]['_additional']['certainty']
    )

findAlterego("Clark Kent")  # prints something like: Clark Kent is Superman with a certainy of 0.6026741
findAlterego("Bruce Wayne") # prints something like: Bruce Wayne is Batman with a certainy of 0.6895526
```

Step 5. See how the superheroes are represented in the vectorspace

```python
def showVectorForAlterego(alterEgo):
    whoIsIt = client.query.get(
        "Superhero",
        ["_additional {id} "]
    ).with_near_text({
        "concepts": [alterEgo] # query that gets vectorized 🪄
    }).do()

    getVector = client.data_object.get_by_id(
        whoIsIt['data']['Get']['Superhero'][0]['_additional']['id'], with_vector=True
    )

    print(
        "The vector for",
        alterEgo,
        "is",
        getVector['vector']
    )

showVectorForAlterego("Clark Kent") # prints something like: The vector for Clark Kent is [-0.05484624, 0.08283167, -0.3002325, ...etc...
```
