# Text search with Weaviate using own vectors and SBERT

The file textSearch.py contains the code to do a text search by entering some query.

To begin with, setup Weaviate on your machine using the installation instructions on the Weaviate website.

To run the example, you will need to spin up your Weaviate instance and to run the Python file textSearch.py in an environment having the following python libraries:
1. Weaviate
2. uuid
3. Sentence-transformer (needed for SBERT)
4. Torch

Initially, you will have to load the SBERT model using the code in Python "sbert_model = SentenceTransformer('bert-base-nli-mean-tokens')".
After that you can use pickle to store and load the model for further use. 

I have used SBERT model to convert text into vectors, which are then loaded in Weaviate along with the text.
When a user enters some query, the query is also mapped to a vector using the same SBERT model and the text
with the most similar vector (found using cosine distances) is returned.

You can also tweak the code to make your own vectors using some other models like Doc2Vec or others.
You can also add more texts in the list named "documents" to further widen the scope of your search.
