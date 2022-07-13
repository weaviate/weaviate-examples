//importing required library
const express =  require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const weaviate = require("weaviate-client");
const e = require('express');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
let initial_path = path.join(__dirname, "views");


//setting up client
const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// variable storing the searched text
let text="";
// variable storing ID of the movie being viewed
let id="";
// variable storing if the searched text is for filter searching or Semantic Searching
let isSemantic=false;



//rendering home page
app.get('/', (req, res) => {
    res.render(path.join(initial_path, "search.ejs"),{movie_info:{}});
})


//perform query for seached text
app.get('/search', (req, res) => {
    // stores the searched text in variable "text"
    text=req.query['searched_data'].toLowerCase();

    if (req.query['filter_search']!=undefined)
    {
      isSemantic=false;
    }else{
      isSemantic=true;
    }
     // making a search query to search for the text on fields title,director,genres,keywords,actors 
    if (!isSemantic)
    {
      client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: ['rating_count'], order: 'desc' }])
        .withFields(['title','poster_link','rating_value','duration','director','movie_id'])
        .withWhere({
          operator: 'Or',
          operands: [{
            path: ["title"],
            operator: "Like",
            valueString: "*"+text+"*"
          },
          {
            path: ["director"],
            operator: "Like",
            valueString: "*"+text+"*"
          },
          {
            path: ["genres"],
            operator: "Like",
            valueString: "*"+text+"*"
          }
          ,
          {
            path: ["keywords"],
            operator: "Like",
            valueString: "*"+text+"*"
          }
          ,
          {
            path: ["actors"],
            operator: "Like",
            valueString: "*"+text+"*"
          }]
        })
        .withLimit(10)
        .do()
        .then(info => {
          res.render(path.join(initial_path, "search.ejs"),{movie_info:info['data']['Get']['Movies']});
    
        })
        .catch(err => {
          console.error(err)
        })
      }
      else
      {
        client.graphql
        .get()
        .withClassName('Movies')
        .withFields(['title','poster_link','rating_value','duration','director','movie_id'])
        .withNearText({
          concepts: [text],
          certainty: 0.6
        })
        .withLimit(10)
        .do()
        .then(info => {
         res.render(path.join(initial_path, "search.ejs"),{movie_info:info['data']['Get']['Movies']});
        })
        .catch(err => {
          console.error(err)
        });
      }
})


app.get('/sort', (req, res) => {

  // variable that stores the parameters on which result needs to be sorted
  let sorting_basis=Object.values(req.query).toString().split(" ")

  // making a search query to search for the text on fields title,director,genres,keywords,actors and generated sorted results
  if(!isSemantic)
  {
    client.graphql
    .get()
    .withClassName('Movies')
    .withSort([{ path: [sorting_basis[0]], order: sorting_basis[1] }])
    .withFields(['title','poster_link','rating_value','duration','director','movie_id'])
    .withWhere({
      operator: 'Or',
      operands: [{
        path: ["title"],
        operator: "Like",
        valueString: "*"+text+"*"
      },
      {
        path: ["director"],
        operator: "Like",
        valueString: "*"+text+"*"
      },
      {
        path: ["genres"],
        operator: "Like",
        valueString: "*"+text+"*"
      }
      ,
      {
        path: ["keywords"],
        operator: "Like",
        valueString: "*"+text+"*"
      }
      ,
      {
        path: ["actors"],
        operator: "Like",
        valueString: "*"+text+"*"
      }]
    })
    .withLimit(10)
    .do()
    .then(info => {
      res.render(path.join(initial_path, "search.ejs"),{movie_info:info['data']['Get']['Movies']});

    })
    .catch(err => {
      console.error(err)
    })
  }
    else{
      client.graphql
        .get()
        .withClassName('Movies')
        .withSort([{ path: [sorting_basis[0]], order: sorting_basis[1] }])
        .withFields(['title','poster_link','rating_value','duration','director','movie_id'])
        .withNearText({
          concepts: [text],
          certainty: 0.6
        })
        .withLimit(10)
        .do()
        .then(info => {
         res.render(path.join(initial_path, "search.ejs"),{movie_info:info['data']['Get']['Movies']});
        })
        .catch(err => {
          console.error(err)
        });
    }
})


app.get('/movie/:id',(req,res)=>{

  // stores the ID of the movie that is being viewed in in variable "id"
  id=req.params.id

    //retrieving information of the movie with the given id
      client.graphql
      .get()
      .withClassName('Movies')
      .withFields(['title','poster_link','url','rating_value','duration','description','director','actors','genres','movie_id','_additional { id certainty }'])
      .withWhere({
        path: ["movie_id"],
        operator: "Equal",
        valueNumber:parseInt(id)
      })
      .do()
      .then(info => {
        mov_id=info['data']['Get']['Movies'][0]['_additional']['id']

        //retrieving recommended movies for the current pic of the movie
            client.graphql
              .get()
              .withClassName('Movies')
              .withFields('title rating_value duration poster_link movie_id')
              .withNearObject({ id: mov_id, certainty: 0.85 })
              .withLimit(10)
              .do()
              .then(info2 => {
                res.render(path.join(initial_path, "movie_info.ejs"),{movie_info:info['data']['Get']['Movies'],related_movies:info2['data']['Get']['Movies']});
              })
              .catch(err => {
                console.error(err)
              });

  })
  .catch(err => {
    console.error(err)
  })
})
app.get('/more_details', (req, res) => 
{
  //retrieving information of the movie with the given id for more fields 
  client.graphql
      .get()
      .withClassName('Movies')
      .withFields(['title','poster_link','url','rating_value','duration','description','date_published','director','actors','best_rating','worst_rating','rating_count','genres','keywords','movie_id','review_aurthor','review_date','review_body','_additional { id certainty }'])
      .withWhere({
        path: ["movie_id"],
        operator: "Equal",
        valueNumber:parseInt(id)
      })
      .do()
      .then(info => {
        mov_id=info['data']['Get']['Movies'][0]['_additional']['id']

            //retrieving recommended movies for the current pic of the movie
            client.graphql
              .get()
              .withClassName('Movies')
              .withFields('title rating_value duration poster_link movie_id')
              .withNearObject({ id: mov_id, certainty: 0.85 })
              .withLimit(10)
              .do()
              .then(info2 => {
                res.render(path.join(initial_path, "more_details.ejs"),{movie_info:info['data']['Get']['Movies'],related_movies:info2['data']['Get']['Movies']});
              })
              .catch(err => {
                console.error(err)
              });

  })
  .catch(err => {
    console.error(err)
  })
})


app.listen(process.env.PORT ||3000)