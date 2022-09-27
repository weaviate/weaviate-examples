import weaviate

client = weaviate.Client("http://localhost:8080")

# Run this query to find dogs similar to Golden Retrievers based off of the image

# nearImage = {"image": "./images/Golden-Retriever.jpg"}

# result = (
#   client.query
#   .get("Dog", "filename")
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
#     .get("Dog", ["filename", "weight"])
#     .with_where(where_filter)
#     .do()
# )

# print(query_result)

# Run this query to find dog breeds smaller than 40 pounds

where_filter = {
    "path": ["weight"],
    "operator": "LessThan",
    "valueInt": 40
}

query_result = (
    client.query
    .get("Dog", ["filename", "weight"])
    .with_where(where_filter)
    .do()
)

print(query_result)