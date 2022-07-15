# Movie Search Engine
 
The Dataset used for this example can be found here: https://www.kaggle.com/datasets/yashgupta24/48000-movies-dataset \
It is data of over 48,000+ movies scraped from IMBD website.

This is a demo example to show how to make a search engine for movies using weaviate. \
The functionalities of weaviate that it covers are:-
1. How to add schema and load data into weaviate
2. How to perform semantic search using weaviate. We can search for a sentence and then we can fetch movies having similar plots. more details can be found [here](https://weaviate.io/developers/weaviate/current/tutorials/how-to-perform-a-semantic-search.html#explore-graphql-function)
3. How to filter search using weaviate. We can search for movie by specifying which text should be in movies title,description,actors etc. more details can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html)
4. Retrive results in a sorted manner. more details can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/get.html#cost-of-sorting--architecture)
5. Recommend movies by comparing the similarity of two objects. 

This example uses HTML,CSS,Js for frontend and NodeJs for the backend. 

Follow the following steps to reproduce the example 
1. Download the dataset from https://www.kaggle.com/datasets/yashgupta24/48000-movies-dataset and paste it in the directory where add_data.py file exists 
2. Run the following command to run the weaviate docker file 
```bash
sudo docker-compose up -d
``` 

3. Run the following command in directory to install all required dependencies 
```bash
pip install -r requirements.txt
``` 
4. Run the following command to add all the data objects,you can change path of dataset at line 115 if necessary. You can also decrease the number of data objects at line 119 so that it takes less time.
```bash
python add_data.py
``` 
5. After adding data run the following command to install all required node modules.
```bash
npm install
``` 
6. After adding data and installing modules run the following command and navigate to http://localhost:3000/ to perform searching
```bash
npm run start
``` 
A short demo usage:-



[movie_search_engine.webm](https://user-images.githubusercontent.com/75658681/178302422-247971ad-4c9f-4b8b-8c1c-1f7db267a2a0.webm)

Some description about queries:- \
All the used queries can be found in queries.js file. There are mainly 5 queries being used:
1. Query to fetch filtered search results:- This query uses the where filter provided in weaviate which takes various operators like 'And', 'Or', 'Not', 'Like' etc. More information about the Where filter can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#where-filter). For this example we used the Like operator  of the Where filter which allows us to do string searches based on the partial match. More information on the Like operator can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#like-operator).
```js
client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: ['rating_count'], order: 'desc' }])
        .withFields(['title', 'poster_link', 'rating_value', 'duration', 'director', 'movie_id'])
        .withWhere({
            operator: 'Or',
            operands: [{
                path: ["title"],
                operator: "Like",
                valueString: "*" + text + "*"
            },
            {
                path: ["director"],
                operator: "Like",
                valueString: "*" + text + "*"
            },
            {
                path: ["genres"],
                operator: "Like",
                valueString: "*" + text + "*"
            }
                ,
            {
                path: ["keywords"],
                operator: "Like",
                valueString: "*" + text + "*"
            }
                ,
            {
                path: ["actors"],
                operator: "Like",
                valueString: "*" + text + "*"
            }]
        })
        .withLimit(10)
        .do()
        .then(info => {
            return info
        })
        .catch(err => {
            console.error(err)
        })
```

2. Query to fetch results by sematic searching:- This query uses the nearText filter of the Get query of weaviate. It allows us to perform semantic searching on the data objects. More info about nearText filter can be found [here](https://weaviate.io/developers/weaviate/current/tutorials/how-to-perform-a-semantic-search.html#neartext-filter)
```js
client.graphql
        .get()
        .withClassName('Movies')
        .withFields(['title', 'poster_link', 'rating_value', 'duration', 'director', 'movie_id'])
        .withNearText({
            concepts: [text],
            certainty: 0.6
        })
        .withLimit(10)
        .do()
        .then(info => {
            return info
        })
        .catch(err => {
            console.error(err)
        });
```

3. Query to fetch sorted results:- This query allows us to change the order in which results appear for the above 2 queries by sorting them on the basis of their primitive property. For getting sorted results we need to tell the primitive property on which sorting needs to be done and the order in which the objects are needed to be sorted. For Example to apply sorting with nearText filter the query would be.
```js
client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: [primitive_property], order: sorting_order }])
        .withFields(['title', 'poster_link', 'rating_value', 'duration', 'director', 'movie_id'])
        .withNearText({
            concepts: [text],
            certainty: 0.6
        })
        .withLimit(10)
        .do()
        .then(info => {
            return info
        })
        .catch(err => {
            console.error(err)
        });
```

4. Query to fetch movie details:-This query like the filtered search query also uses the Where filter of weaviate but the operator this time is 'Equal' instead of 'Like'. This query searches for a movie having that specific id and fetches details of various fields of that movie.
```js
client.graphql
        .get()
        .withClassName('Movies')
        .withFields(['title', 'poster_link', 'url', 'rating_value', 'duration', 'description', 'date_published', 'director', 'actors', 'best_rating', 'worst_rating', 'rating_count', 'genres', 'keywords', 'movie_id', 'review_aurthor', 'review_date', 'review_body', '_additional { id certainty }'])
        .withWhere({
            path: ["movie_id"],
            operator: "Equal",
            valueNumber: parseInt(id)
        })
        .do()
        .then(info => {
            return info;
        })
        .catch(err => {
            console.error(err)
        })
```

5. Query to fetch recommended movies:- This query fetches the data objects that are closest to the given object. It uses the nearObject filter which requires specifying the object's id or beacon in the argument. For this demo we have passed the movie id of a paricular movie to fetch similar movies. More information on nearObject filter can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#nearobject-vector-search-argument)
```js
client.graphql
        .get()
        .withClassName('Movies')
        .withFields('title rating_value duration poster_link movie_id')
        .withNearObject({ id: mov_id, certainty: 0.85 })
        .withLimit(10)
        .do()
        .then(info => {
            return info;
        })
        .catch(err => {
            console.error(err)
        });
```      
