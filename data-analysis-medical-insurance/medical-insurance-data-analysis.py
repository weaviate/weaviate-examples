import weaviate
import pandas as pd

client = weaviate.Client("https://demo-example-zhsihmkv.weaviate.network")  # Replace with your cloud endpoint

current_schemas = client.schema.get()['classes']
for schema in current_schemas:
    if schema['class'] == 'Person':
        client.schema.delete_class('Person')

# Define the class names and properties
person_class = {
    "class": "Person",
    "description": "Details of an individual",
    "properties": [
        {
            "name": "age",
            "description": "The age of the person",
            "dataType": ["int"]
        },
        {
            "name": "sex",
            "description": "The sex of the person",
            "dataType": ["string"]
        },
        {
            "name": "bmi",
            "description": "The BMI (Body Mass Index) of the person",
            "dataType": ["number"]
        },
        {
            "name": "children",
            "description": "The number of children of the person",
            "dataType": ["int"]
        },
        {
            "name": "smoker",
            "description": "Smoking status of the person",
            "dataType": ["string"]
        },
        {
            "name": "region",
            "description": "The region where the person resides",
            "dataType": ["string"]
        },
        {
            "name": "charges",
            "description": "The insurance charges of the person",
            "dataType": ["number"]
        }
    ]
}

# Create the class in Weaviate
client.schema.create_class(person_class)

# Load the insurance dataset
dataset = pd.read_csv('insurance.csv')

# Iterate over the rows of the dataset and create objects in Weaviate

for _, row in dataset.iterrows():
    person = {
        "age": int(row['age']),
        "sex": row['sex'],
        "bmi": float(row['bmi']),
        "children": int(row['children']),
        "smoker": row['smoker'],
        "region": row['region'],
        "charges": float(row['charges'])
    }
    print("loading...")
    client.data_object.create(person, "Person")

# Perform data analysis
# Example 1: Average charges by region

print("")
print("Average charges by region:")

result = client.query.aggregate("Person") \
    .with_group_by_filter(["region"]) \
    .with_fields("charges {mean}") \
    .with_fields("groupedBy {path value}") \
    .do()

aggregations = result.get("data", {}).get("Aggregate", {}).get("Person", {})
for aggregation in aggregations:
    group_by_path = aggregation.get("groupedBy", {}).get("path")
    group_by_value = aggregation.get("groupedBy", {}).get("value")
    charges_mean = aggregation.get("charges", {}).get("mean")

    print(f"Grouped by: {group_by_path} = {group_by_value}, Mean Charges: {charges_mean}")

# Example 2: Count of smokers and non-smokers by sex

print("")
print("Count smokers by sex:")
result = client.query.aggregate("Person") \
    .with_group_by_filter(["sex"]) \
    .with_fields("smoker {count}") \
    .with_fields("groupedBy {path value}") \
    .do()

aggregations = result.get("data", {}).get("Aggregate", {}).get("Person", {})

for aggregation in aggregations:
    charges_mean = aggregation.get("charges", {}).get("mean")
    sex = aggregation.get("groupedBy", {}).get("value")
    count = aggregation.get("smoker", {}).get("count")
    print(sex, "-", count)

# Example 3: Retrieve people with high charges who are smokers

print("")
print("Retrieve people with high charges who are smokers:")
content = {
    "operator": "And",
    "operands": [
        {
            "path": "smoker",
            "operator": "Equal",
            "valueString": "yes"
        },
        {
            "path": "charges",
            "operator": "GreaterThan",
            "valueNumber": 40000

        }]}
result = client.query.get("Person", ["age", "sex", "charges", "region", "bmi", "children"]) \
    .with_where(content) \
    .do()

results = result.get("data", {}).get("Get", {}).get("Person", {})
for output in results:
    age = output.get("age", {})
    sex = output.get("sex", {})
    region = output.get("region", {})
    charges = output.get("charges", {})
    bmi = output.get("bmi", {})
    children = output.get("children", {})
    print("Age:", age, ", Sex:", sex, ", Region:", region, ", Charges:", charges, ", Bmi:", bmi, ", Children:",
          children)

# Example 4: Retrieve people  who are smokers  with top 5 BMI and high charges
print("")
print("Retrieve individuals with top 5 BMI who are smokers and have high charges:")

result = client.query.get("Person", ["age", "sex", "charges", "region", "bmi", "children"]) \
    .with_where(content) \
    .with_sort({"path": ["bmi"], "order": "desc"}) \
    .with_limit(5) \
    .do()

results = result.get("data", {}).get("Get", {}).get("Person", {})
for output in results:
    age = output.get("age", {})
    sex = output.get("sex", {})
    region = output.get("region", {})
    charges = output.get("charges", {})
    bmi = output.get("bmi", {})
    children = output.get("children", {})
    print("Age:", age, ", Sex:", sex, ", Region:", region, ", Charges:", charges, ", BMI:", bmi, ", Children:",
          children)

# Example 5: Retrieve people with the highest insurance charges within each age group
print("")
print("Individuals with the highest insurance charges within each age group:")

result = client.query.aggregate("Person") \
    .with_group_by_filter(["age"]) \
    .with_fields("charges {maximum}") \
    .with_fields("groupedBy {path value}")\
    .do()

aggregations = result.get("data", {}).get("Aggregate", {}).get("Person", {})
for aggregation in aggregations:
    group_by_path = aggregation.get("groupedBy", {}).get("path")
    group_by_value = aggregation.get("groupedBy", {}).get("value")
    charges_max = aggregation.get("charges", {}).get("maximum")

    print(f"Grouped by: {group_by_path} = {group_by_value}, Max Charges: {charges_max}")
