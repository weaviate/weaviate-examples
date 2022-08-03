const pd = require("node-pandas")
const weaviate = require("weaviate-client");

// set up client
const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// form the schema
classObj = {
    "class": "Movies",
    "description": "Various Info about movies",
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

// provision the schema
client
  .schema
  .classCreator()
  .withClass(classObj)
  .do()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  });


// load and preprocessing the dataset
data=pd.readCsv("./movies.csv")

// iterate movies and push objects
data.forEach(function(movie){
  try {
     movie_object = {
         'title': movie['original_title'],
         'genres': movie['genres'],
         'overview':movie['overview'],
         'keywords': movie['keywords'],
         'popularity': parseFloat(movie['popularity']),
         'runtime': parseInt(movie['runtime']),
         'cast': movie['cast'],
         'language': movie['original_language'],
         'tagline': movie['tagline'],
         'revenue': parseInt(movie['revenue']),
         'director': movie['director']
     }

     client.data
      .creator()
      .withClassName('Movies')
      .withProperties(movie_object)
      .do()
      .then(res => {
          console.log(res)
      })
      .catch(err => {
          console.error(err)
      });

  } catch(e) { console.log(e) }
})

// That's all!
