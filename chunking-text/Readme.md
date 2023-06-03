# Repo for Optimal Text Chunking Blogpost

## Experiment Plan:

1. Use [LangChain](https://python.langchain.com/en/latest/modules/indexes/text_splitters.html) textsplitters to chunk a dataset (potentially multiple) from the [BEIR](https://github.com/beir-cellar/beir) benchmark multiple times.

2. Embed and store documents into different classes of Weaviate (one class for each chunking strategy)

3. Assess Recall for each class and quantify vs `chunk_size`, `chunk_overlap` etc.

4. Compare optimal chunking parameters to dataset parameters below (Word length, sentence length, paragraph length etc.)
<img width="903" alt="image" src="https://github.com/weaviate/weaviate-examples/assets/21254008/f81789a9-71a7-45f5-978c-08240f0456d4">

5. Extract qualitative and quantitative strategies/insights for optimal chunking

## Blog Breakdown:

- Talk about need for chunking (limitations on max size that can be fed into a single vector).
Representation of of human understandable data as vectors. If the chunks are too big you are trying to squeeze too much information into a vector and so you loose lots of relevant information.

- Try to answer standard question everyone asks - how big to chunk text? Do overlaps matter?
  * Qualitative approach of explaining why bigger chunks works better for some datasets and smaller chunks work better for other datasets (The main idea being on what level of granularity does information lie in your dataset)

  * Quantitative approach of treating chunk size and overlap as a hyperparameter and optimizing over it.

- Use Connor's weaviate BEIR evaluation dataset and Langchain text splitters. Show a few graphs of different splitting options (size of chunks, size of overlap).
  * Ideally pick small/medium sized [datasets]((https://github.com/beir-cellar/beir)) 
  * One dataset should give good recall for smaller chunks the other for bigger chunks - we can then looks at examples of why this is the case to explain.

- Maybe add how [summarization](https://python.langchain.com/en/latest/use_cases/summarization.html) impacts things (if time permits).
