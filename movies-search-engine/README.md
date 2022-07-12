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




