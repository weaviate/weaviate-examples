import weaviate

client = weaviate.Client("http://localhost:8080")


weaviate_shorts_class =  {
    "class": "WeaviateShorts", 
    "description": "Quick answers to various questions",
    "vectorizer": "text2vec-openai",
      "moduleConfig": {
        "qna-openai": {
          "model": "text-davinci-002",
          "maxTokens": 16,
          "temperature": 0.0,
          "topP": 1,
          "frequencyPenalty": 0.0,
          "presencePenalty": 0.0
        }
      },
    "properties": [
        {
            "name": "question",
            "dataType": ["string"],
            "description": "Questions from the document",
        },
        {
            "name": "content",
            "dataType": ["string"],
            "description": "Answers to the questions",
        }
    ]
}


podcast_class = {
           "class": "PodClip",
           "description": "A podcast clip.",
            "vectorizer": "text2vec-openai",
            "moduleConfig": {
                "qna-openai": {
                "model": "text-davinci-002",
                "maxTokens": 16,
                "temperature": 0.0,
                "topP": 1,
                "frequencyPenalty": 0.0,
                "presencePenalty": 0.0
        }
      },
           "properties": [
               {
                   "name": "content",
                   "dataType": ["text"],
                   "description": "The text content of the podcast clip",
               },
               {
                "name": "speaker",
                "dataType": ["string"],
                "description": "The speaker in the podcast",
               },
               {
                   "name": "podNum",
                   "dataType": ["int"],
                   "description": "The podcast number."
               },
        ]
}

# resetting the schema 
client.schema.delete_all()

# add the schema
client.schema.create_class(weaviate_shorts_class) 
client.schema.create_class(podcast_class)

# get the schema
schema = client.schema.get()