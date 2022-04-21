const express =  require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const weaviate = require("weaviate-client");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
let initial_path = path.join(__dirname, "views");

//setting up client
const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

//rendering home page
app.get('/', (req, res) => {
    res.render(path.join(initial_path, "search.ejs"),{movie_info:{}});
})

//perform query for seached text
app.post('/search', (req, res) => {
    let text = req.body['searched_data'];
    console.log(text)
    client.graphql
      .get()
      .withClassName('Movies')
      .withFields(['title','genres','popularity','runtime'])
      .withNearText({
        concepts: [text],
        certainty: 0.7
      })
      .do()
      .then(info => {
        res.render(path.join(initial_path, "search.ejs"),{movie_info:info['data']['Get']['Movies']});
   
      })
      .catch(err => {
        console.error(err)
      })
})

app.listen(process.env.PORT || 4000)