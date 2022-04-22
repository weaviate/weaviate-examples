# Sentiment analysis of sentences

This example contains Sentiment Analysis data, retrieved from [data.world](https://data.world/crowdflower/sentiment-analysis-in-text).
The transformer model [`sentence-transformers-paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-xlm-r-multilingual-v1) is connected to Weaviate as [vectorization module](https://www.semi.technology/developers/weaviate/current/modules/text2vec-transformers.html) (see `docker-compose.yaml` file).

Here, we first upload text_emotion data to Weaviate instance running pre-trained text2vec-transformer model which vectorizes this data and embed these vectors and data objects to a GraphQL database. 

Now, when we enter a new sentence, it also gets vectorized and is embedded into the GraphQL database. The module, then, does a nearest neighbour search around the new data point and returns the sentiments of the data objects closest to the search query.

## How to use

1. Start up Weaviate: `docker-compose up -d`. Once completed, Weaviate is running on [`http://localhost:8080`]().
2. Install requirements: `pip install -r requirements.txt`
3. Run `python import.py` to import 5000 comments to Weaviate.
4. Run `python script.py` to enter sentences and to know the sentiment behind them.