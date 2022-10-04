import weaviate

client = weaviate.Client("http://localhost:8080")

# https://link.semi.technology/3rktlbq to run the query in the Weaviate Console using GraphQL

# Run this query to find dogs similar to Golden Retrievers based off of the image

# nearImage = {"image": "./images/Golden-Retriever.jpg"}

# result = (
#   client.query
#   .get("Dog", "filepath")
#   .with_near_image(nearImage, encode=True)
#   .do()
# )

# print(result)


# Run this query to find dog breeds greater than 80 pounds 

# where_filter = {
#     "path": ["weight"],
#     "operator": "GreaterThan",
#     "valueInt": 80
# }

# query_result = (
#     client.query
#     .get("Dog", ["filepath", "weight"])
#     .with_where(where_filter)
#     .do()
# )

# print(query_result)

# Run this query to find dog breeds smaller than 40 pounds

where_filter = {
    "path": ["weight"],
    "operator": "LessThan",
    "valueInt": 60
}

query_result = (
    client.query
    .get("Dog", ["filepath", "weight"])
    .with_limit(3)
    .with_where(where_filter)
    .do()
)

print(query_result)