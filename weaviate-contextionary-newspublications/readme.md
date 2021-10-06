# Example docker-compose configuration file

Here you find an example docker-compose configuration file to start up Weaviate with the [`text2vec-contextionary module`](https://www.semi.technology/developers/weaviate/current/modules/text2vec-contextionary.html) and a News Publications example dataset. 

## How to use

Download the `docker-compose.yml` file. In the folder where you stored the file, run `docker-compose up`. Now, Weaviate, the [`text2vec-contextionary module`](https://www.semi.technology/developers/weaviate/current/modules/text2vec-contextionary.html) and the demo dataset will be retrieved, Weaviate will start up with the text2vec-contextionary module, and load in the demo data. Weaviate will be running at `localhost:8080`. You can then navigate to [console.semi.technology](https://console.semi.technology/) and connect to `http://localhost:8080`, to query the dataset.