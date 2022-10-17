from textwrap import indent
import weaviate
import pprint 
pp = pprint.PrettyPrinter(indent = 5)

client = weaviate.Client("http://localhost:8080")

# Run this query to find dog breeds smaller than 60 pounds

where_filter = {
    "path": ["weight"],
    "operator": "LessThan",
    "valueInt": 60
}

query_result = (
    client.query
    .get("Dog", ["breed", "weight",])
    .with_limit(3)
    .with_where(where_filter)
    .do()
)

pp.pprint(query_result["data"]["Get"])