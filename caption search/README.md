# Caption Search Using Weaviate
 
This is a demo example to show how to perform caption search using weaviate. \
We will first fetch all the captions of a video and store them in weaviate. Then we will map all the indexes in that caption text to a particular time stamp at which those parts of the caption occur. We will be using [youtube-transcript-api](https://pypi.org/project/youtube-transcript-api/) to fetch the captions.

This example uses HTML, CSS, and Js for the frontend and NodeJs for the backend. 

Follow the following steps to reproduce the example 
1. Run the following command to run the weaviate docker file 
```bash
sudo docker-compose up -d
``` 

2. Run the following command in the directory to install all required dependencies 
```bash
pip install -r requirements.txt
``` 
5. After installing all required python packages run the following command to install all required node modules.
```bash
npm install
``` 
6. After adding data and installing modules run the following command and navigate to http://localhost:3000/, After reaching there enter the video URL and start performing Q&A on that video.
```bash
npm run start
``` 
A short demo usage:-


https://user-images.githubusercontent.com/75658681/187984897-b8046504-a9d1-495e-af59-baa2004f23bd.mp4





Some descriptions about queries:- \
We have majorly used only two queries for this demo
1. Query to fetch an answer,startIndex,endIndex for a particular searched question:- This query adds an additional ask {} parameter in the Get query of weaviate. This query returns a maximum of 1 answer which is available in _additional {} field of the results. The answer with the highest certainty will be returned. More Information of this query can be found [here]([https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#like-operator](https://weaviate.io/developers/weaviate/current/reader-generator-modules/qna-transformers.html)).
```js
client.graphql
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
```

2. Query to fetch timestamp for particular starting index:-This query uses the where filter provided in weaviate which allows us to perform various arithmetic comparisons. More information about the Where filter can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#where-filter). For this example we used the GreaterThan operator of the Where filter which allows us to filter the results which are greater than a certain threshold. More information on the GreaterThan operator can be found [here](https://weaviate.io/developers/weaviate/current/graphql-references/filters.html#where-filter).
```js
client.graphql
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
```      
