#importing required libraries
import weaviate
import pandas as pd
#setting up client
client = weaviate.Client("http://localhost:8080")



#  UNCOMMENT BELOW LINE IF THIS IS NOT THE FIRST TIME YOU ARE ADDING DATA FOR THIS SCHEMA
# client.schema.delete_class('Movies')


#creating the schema
movie_class_schema = {
    "class": "Movies",
    "description": "Various Info about plants",
    "properties": [
        {
            "name": "movie_id",
            "dataType": ["number"],
            "description": "The id of the movie", 
        },
        {
            "name": "url",
            "dataType": ["string"],
            "description": "The IMBD url of the movie", 
        },
        {
            "name": "title",
            "dataType": ["string"],
            "description": "The name of the movie", 
        },
        {
            "name": "poster_link",
            "dataType": ["string"],
            "description": "The poster link of the movie", 
        },
        {
            "name": "genres",
            "dataType": ["string"],
            "description": "The genres of the movie", 
        },
        {
            "name": "actors",
            "dataType": ["string"],
            "description": "The actors of the movie", 
        },
        {
            "name": "director",
            "dataType": ["string"],
            "description": "Director of the movie", 
        },
        {
            "name": "description",
            "dataType": ["string"],
            "description": "overview of the movie", 
        },
        {
            "name": "date_published",
            "dataType": ["string"],
            "description": "The date on which movie was published", 
        },
        {
            "name": "keywords",
            "dataType": ["string"],
            "description": "main keywords of the movie", 
        },
        {
            "name": "rating_count",
            "dataType": ["number"],
            "description": "rating count of the movie", 
        },        
        {
            "name": "best_rating",
            "dataType": ["number"],
            "description": "best rating of the movie", 
        },        
        {
            "name": "worst_rating",
            "dataType": ["number"],
            "description": "worst rating of the movie", 
        },        
        {
            "name": "rating_value",
            "dataType": ["number"],
            "description": "rating value of the movie", 
        },
        {
            "name": "review_aurthor",
            "dataType": ["string"],
            "description": "aurthor of the review", 
        },  
        {
            "name": "review_date",
            "dataType": ["string"],
            "description": "date of review", 
        },
        {
            "name": "review_body",
            "dataType": ["string"],
            "description": "body of the review", 
        },
        {
            "name": "duration",
            "dataType": ["string"],
            "description": "the duration of the review", 
        },
    ]
}
client.schema.create_class(movie_class_schema)

#change the path to the place where data csv file is present
data=pd.read_csv("final_data.csv")

#adding the data
#You can decrease number of objects to be inserted to decrease the amount of time required
for i in range (0,len(data)):
            movie_object = {
                'movie_id':float(data.iloc[i]['id']),
                'url':str(data.iloc[i]['url']),
                'title': str(data.iloc[i]['Name']).lower(),
                'poster_link': str(data.iloc[i]['PosterLink']),
                'genres':str(data.iloc[i]['Genres']),
                'actors': str(data.iloc[i]['Actors']).lower(),
                'director': str(data.iloc[i]['Director']).lower(),
                'description':str(data.iloc[i]['Description']),
                'date_published': str(data.iloc[i]['DatePublished']),
                'keywords': str(data.iloc[i]['Keywords']),
                'rating_count':float(data.iloc[i]['RatingCount']),
                'best_rating': float(data.iloc[i]['BestRating']),
                'worst_rating': float(data.iloc[i]['WorstRating']),
                'rating_value':float(data.iloc[i]['RatingValue']),
                'review_aurthor': str(data.iloc[i]['ReviewAurthor']),
                'review_date': str(data.iloc[i]['ReviewDate']),
                'review_body': str(data.iloc[i]['ReviewBody']),
                'duration': str(data.iloc[i]['duration']),
            }

            try:
                client.data_object.create(movie_object, "Movies")
            except:
                print("failed",i)

            print(str(i)+"/"+str(len(data)))