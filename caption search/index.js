const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', require('ejs').renderFile);
let initial_path = path.join(__dirname, "views");
const weaviate = require("weaviate-client");

let youtube_link = "";
app.get('/', (req, res) => {
  res.render(path.join(initial_path, "add_data.ejs"));
})

//function to get video id from video url
function get_id(url) {
  return url.split("v=")[1].substring(0, 11);
}

// Function to get the answer for a particular question
async function get_answer(searched_question) {
  let data = await client.graphql
    .get()
    .withClassName('Caption')
    .withAsk({
      question: searched_question,
      properties: ["text"],
    })
    .withFields('_additional { answer { hasAnswer certainty property result startPosition endPosition } }')
    .withLimit(1)
    .do()
    .then(info => {
      return info
    })
    .catch(err => {
      console.error(err)
    });
  return data;
}

// Function to get the timestamp for a particular starting index
async function get_timestamp(start_index) {
  let data = await client.graphql
    .get()
    .withClassName('Timestamps')
    .withFields(['startIndex', 'time'])
    .withLimit(1)
    .withWhere({
      operator: 'GreaterThan',
      path: ['endIndex'],
      valueNumber: parseInt(start_index)
    })
    .withSort([{ path: ['startIndex'], order: 'asc' }])
    .do()
    .then(info => {
      return info;
    })
    .catch(err => {
      console.error(err)
    })

  return data;
}

// setting up the client
const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

app.post('/get_link', (req, res) => {
  youtube_link = req.body['url'];
  // running the add_data.py to add the caption of the video in weaviate
  // passing the youtube video link as argument to our python file
  let arguments = {
    args: [youtube_link]
  }
  PythonShell.run('add_data.py', arguments, function (err, output) {
    if (err) {
      console.log(err)
    };
    console.log(output);
    if (output == "completed") {
      video_id = get_id(youtube_link)
      res.render(path.join(initial_path, "search.ejs"), { answer: {},link:{}, img_url: "http://img.youtube.com/vi/" + video_id + "/0.jpg" });
    }
  });
})

app.post('/search', (req, res) => {
  let searched_question = req.body['searched_data'];

  let answer = get_answer(searched_question);
  answer.then(
    answ => {
      let start_index = answ['data']['Get']['Caption'][0]['_additional']['answer']['startPosition'];
      display_answer=answ['data']['Get']['Caption'][0]['_additional']['answer']['result'];
      timestamp = get_timestamp(start_index);
      timestamp.then(
        tmstmp => {
              video_id = get_id(youtube_link)
              res.render(path.join(initial_path, "search.ejs"), { answer:display_answer,link: "https://www.youtube.com/watch?v=" + video_id + "&t=" + parseInt(tmstmp['data']['Get']['Timestamps'][0]['time']), img_url: "http://img.youtube.com/vi/" + video_id + "/0.jpg" })
        }
      )
    }
  )
})

app.listen(process.env.PORT || 3000,
  () => console.log(`The app is running on: http://localhost:${process.env.PORT || 3000}`)
)
