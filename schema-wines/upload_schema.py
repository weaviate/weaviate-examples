import weaviate

client = weaviate.Client("http://localhost:8080")

schema = {
    "classes": [
        {
            "class": "Wine",
            "description": "A wine that has been tasted and reviewed",
            "properties": [
                {
                    "name": "title",
                    "description": "The name of the wine",
                    "dataType": ["text"]
                }, {
                    "name": "description",
                    "description": "The review of the wine",
                    "dataType": ["text"]
                }, {
                    "name": "designation",
                    "description": "The vineyard within the winery where the grapes that made the wine are from",
                    "dataType": ["string"]
                }, {
                    "name": "points",
                    "description": "Points 0-100 given by the reviewer",
                    "dataType": ["int"]
                }, {
                    "name": "price",
                    "description": "The price of the wine in dollars",
                    "dataType": ["number"]
                }, {
                    "dataType": ["Country"],
                    "description": "The country the wine is from",
                    "name": "fromCountry"
                }, {
                    "dataType": ["Province"],
                    "description": "The province or state that the wine is from",
                    "name": "fromProvince"
                }, {
                    "dataType": ["Variety"],
                    "description": "The type of grapes used to make the wine (ie Pinot Noir)",
                    "name": "hasVariety"
                }, {
                    "dataType": ["Winery"],
                    "description": "The winery that made the wine",
                    "name": "fromWinery"
                }
            ]
        }, {
            "class": "Country",
            "description": "A country which produces wine",
            "properties": [
                {
                    "dataType": ["string"],
                    "description": "The name of the country",
                    "name": "name"
                }
            ]
        }, {
            "class": "Province",
            "description": "A defined region or state of a country",
            "properties": [
                {
                    "dataType": ["string"],
                    "description": "The name of the country",
                    "name": "name"
                }, {
                    "dataType": ["Country"],
                    "description": "The country the province lies in",
                    "name": "inCountry"
                }
            ]
        }, {
            "class": "Variety",
            "description": "The type of grapes a wine is made of",
            "properties": [
                {
                    "dataType": ["string"],
                    "description": "The name of the variety, which is the name of the grape",
                    "name": "name"
                }
            ]
        }, {
            "class": "Winery",
            "description": "A wine producer",
            "properties": [
                {
                    "dataType": ["string"],
                    "description": "The name of the winery",
                    "name": "name"
                }, {
                    "dataType": ["Country"],
                    "description": "The country the province lies in",
                    "name": "inCountry"
                }
            ]
        }
    ]
}

client.schema.create(schema)