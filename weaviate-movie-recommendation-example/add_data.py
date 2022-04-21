import weaviate
import pandas as pd

#setting up client
client = weaviate.Client("http://localhost:8080")

client.schema.delete_all()
#creating the schema
movie_class_schema = {
    "class": "Movies",
    "description": "Various Info about plants",
    "properties": [
        {
            "name": "title",
            "dataType": ["string"],
            "description": "The name of the movie", 
        },
        {
            "name": "genres",
            "dataType": ["string"],
            "description": "The genres of the movie", 
        },
        {
            "name": "overview",
            "dataType": ["string"],
            "description": "overview of the movie", 
        },
        {
            "name": "keywords",
            "dataType": ["string"],
            "description": "main keywords of the movie", 
        },
        {
            "name": "popularity",
            "dataType": ["number"],
            "description": "popularity of the movie", 
        },
        {
            "name": "runtime",
            "dataType": ["number"],
            "description": "runtime of the movie", 
        },
        {
            "name": "cast",
            "dataType": ["string"],
            "description": "The cast of the movie", 
        },
        {
            "name": "language",
            "dataType": ["string"],
            "description": "language in which movie was made", 
        },  
        {
            "name": "tagline",
            "dataType": ["string"],
            "description": "tagline of the movie", 
        },
        {
            "name": "revenue",
            "dataType": ["number"],
            "description": "revenue of the movie", 
        },
        {
            "name": "director",
            "dataType": ["string"],
            "description": "Director of the movie", 
        },
    ]
}
client.schema.create_class(movie_class_schema)

#loading and preprocessing the dataset
data=pd.read_csv("./movies.csv")
data=data[['original_title','genres','overview','keywords','popularity','runtime','cast','original_language','tagline','revenue','director']]
data.dropna(inplace=True)

#adding data to weaviate
for i in range (0,len(data)):

    movie_object = {
         'title': str(data.iloc[i]['original_title']),
         'genres': str(data.iloc[i]['genres']),
         'overview':str(data.iloc[i]['overview']),
         'keywords': str(data.iloc[i]['keywords']),
         'popularity': float(data.iloc[i]['popularity']),
         'runtime':int(data.iloc[i]['runtime']),
         'cast': str(data.iloc[i]['cast']),
         'language': str(data.iloc[i]['original_language']),
         'tagline':str(data.iloc[i]['tagline']),
         'revenue': int(data.iloc[i]['revenue']),
         'director': str(data.iloc[i]['director'])
     }
    client.data_object.create(movie_object, "Movies")
    print(str(i)+"/"+str(len(data)))