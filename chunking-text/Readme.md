Breakdown:

- Talk about need for chunking (limitations on max size that can be fed into a single vector).
Representation of of human understandable data as vectors. If the chunks are too big you are trying to squeeze too much information into a vector and so you loose lots of relevant information.

- Try to answer standard question everyone asks - how big to chunk text? Do overlaps matter?
  * Qualitative approach of explaining why bigger chunks works better for some datasets and smaller chunks work better for other datasets (The main idea being on what level of granularity does information lie in your dataset)

  * Quantitative approach of treating chunk size and overlap as a hyperparameter and optimizing over it.

- Use Connor's weaviate BEIR evaluation dataset and Langchain text splitters. Show a few graphs of different splitting options (size of chunks, size of overlap).
  * Ideally pick small/medium sized datasets 
  * One dataset should give good recall for smaller chunks the other for bigger chunks - we can then looks at examples of why this is the case to explain.

- Maybe add how summarization impacts things (if time permits).
