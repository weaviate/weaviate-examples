# Information Retrieval with BERT

This example contains the notebook that was used in [this Towards Data Science article](https://towardsdatascience.com/a-sub-50ms-neural-search-with-distilbert-and-weaviate-4857ae390154). 

In this example we are going to use Weaviate without vectorization module, and use it as pure vector database to use a BERT transformer to vectorize text documents, then retrieve the closest ones through Weaviate's Search.

Note that we use Weaviate as pure vector database without any vectorization module attached. After this example was released, we have released new vectorization modules, like the [`text2vec-transformers` module](https://www.semi.technology/developers/weaviate/current/modules/text2vec-transformers.html). You can use this module to run Weaviate with a BERT transformer module out of the box.