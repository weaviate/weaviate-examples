const weaviate = require("weaviate-client");

// importing data from json file
var data = require('./plant_info.json');

//setting up client
const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

//if schema having class name Plants already exists deleting it
client.schema
.classDeleter()
.withClassName('Plants')
.do()
.then(res => {
  console.log(res);
})
.catch(err => {
  console.error(err)
});

// Creating Schema
  var plant_class_schema = {
    "class": "Plants",
    "description": "Various Info about plants",
    "properties": [
        {
            "name": "title",
            "dataType": ["string"],
            "description": "The name of the plant", 
        },
        {
            "name": "alternateName",
            "dataType": ["string"],
            "description": "The alternate name of the plant", 
        },
        {
            "name": "sowInstructions",
            "dataType": ["string"],
            "description": "Sowing instruction of the plant", 
        },
        {
            "name": "spaceInstructions",
            "dataType": ["string"],
            "description": "Spacing instruction of the plant", 
        },
        {
            "name": "harvestInstructions",
            "dataType": ["string"],
            "description": "Harvesting instruction of the plant", 
        },
        {
            "name": "compatiblePlants",
            "dataType": ["string"],
            "description": "Compatible with (can grow beside) of the plant", 
        },
        {
            "name": "avoidInstructions",
            "dataType": ["string"],
            "description": "Avoiding instruction of the plant", 
        },
        {
            "name": "culinaryHints",
            "dataType": ["string"],
            "description": "Culinary instruction of the plant", 
        },  
        {
            "name": "culinaryPreservation",
            "dataType": ["string"],
            "description": "Culinary Preservation of the plant", 
        },
        {
            "name": "url",
            "dataType": ["string"],
            "description": "url link of the plant", 
        },
        {
            "name": "imageLinks",
            "dataType": ["string"],
            "description": "Image link of the plant", 
        },
    ]
}

//Adding data of 15 plants
for(let i=0;i<data.length;i++)
{
    plant_object = {
        'title': data[i]['Name'],
        'alternateName': data[i]['alternateName'],
        'sowInstructions':data[i]['sowInstructions'],
        'spaceInstructions': data[i]['spaceInstructions'],
        'harvestInstructions': data[i]['harvestInstructions'],
        'compatiblePlants':data[i]['compatiblePlants'],
        'avoidInstructions': data[i]['avoidInstructions'],
        'culinaryHints': data[i]['culinaryHints'],
        'culinaryPreservation':data[i]['culinaryPreservation'],
        'url': data[i]['url'],
        'imageLinks': data[i]['image-links']
    }
    client.data
          .creator()
          .withClassName('Plants')
          .withProperties(plant_object)
          .do()
          .then(res => {
              console.log(res)
          })
          .catch(err => {
              console.error(err)
          });
}


