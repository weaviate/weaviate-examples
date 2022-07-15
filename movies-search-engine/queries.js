const weaviate = require("weaviate-client");

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

//Query to fetch filtered results
async function get_filtered_results(text) {
    let data = await client.graphql
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
    return data;
}

//Query to fetch results by sematic searching
async function get_semantic_results(text) {
    let data = await client.graphql
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
    return data;
}

//Query to fetch sorted filtered results
async function get_sorted_filtered_resutls(sorting_attribute, sorting_order, text) {
    let data = await client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: [sorting_attribute], order: sorting_order }])
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
    return data;
}

//Query to fetch sorted semantic results
async function get_sorted_semantic_resutls(sorting_attribute, sorting_order, text) {
    let data = await client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: [sorting_attribute], order: sorting_order }])
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
    return data;
}

//Query to fetch movie details
async function get_movie_details(id) {
    let data = await client.graphql
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
    return data;
}

//Query to fetch recommended movies
async function get_recommended_movies(mov_id) {
    let data = await client.graphql
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
    return data
}

//Exporting these function as they need to be used in index.js
module.exports = { get_filtered_results, get_semantic_results, get_sorted_filtered_resutls, get_sorted_semantic_resutls, get_movie_details, get_recommended_movies }