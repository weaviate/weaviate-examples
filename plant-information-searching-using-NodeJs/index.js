const express =  require('express')
const app = express()
var data = require('./plant_info.json');
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
    res.render(path.join(initial_path, "search.ejs"),{plant_info:{}});
})

//perform query for seached text
app.post('/search', (req, res) => {
    let text = req.body['searched_data'];
    console.log(text)
    client.graphql
      .get()
      .withClassName('Plants')
      .withFields(['title','alternateName','sowInstructions','spaceInstructions','harvestInstructions','compatiblePlants','avoidInstructions','culinaryHints','url','imageLinks'])
      .withNearText({
        concepts: [text],
        certainty: 0.7
      })
      .do()
      .then(info => {
        res.render(path.join(initial_path, "search.ejs"),{plant_info:info['data']['Get']['Plants']});
      })
      .catch(err => {
        console.error(err)
      })
})

//generating information of choosen plant
app.get('/:name',(req,res)=>{
  const {name}=req.params;
  let obj
  console.log(req.body)
  let size=name.length
  for (let i = 0; i < data.length; i++) {
      if(name==data[i].Name.substring(0,size))
      {
          obj=data[i]
          break;
      }
}
  res.render('info.ejs',{plant_info:obj}) 
})

app.listen(process.env.PORT || 4000)