# Weaviate examples

List of examples and tutorials of how to use the Vector Search Engine
Weaviate for cool machine-learning related tasks.

### Running Weaviate

* Most examples assume you have a Weaviate running. You can run one locally by following [this installation guide](https://weaviate.io/developers/weaviate/current/getting-started/installation.html#customize-your-weaviate-setup) in the documentation.
  * If you need a specific vectorizer module or another ML module, it will be explained in the tutorial.
* Basic links: [Documentation](https://github.com/semi-technologies/weaviate) – [Github](https://weaviate.io/developers/weaviate/current/) - [Slack](https://join.slack.com/t/weaviate/shared_invite/zt-goaoifjr-o8FuVz9b1HLzhlUfyfddhw)

## Examples

|Title|Language|Description|
|---|---|---|
| [Semantic search through Wikipedia with the Weaviate vector search engine](https://github.com/semi-technologies/semantic-search-through-Wikipedia-with-Weaviate) | GraphQL | Semantic search through a vectorized Wikipedia (SentenceBERT) with the Weaviate vector search engine | 
| [PyTorch-BigGraph Wikidata search with the Weaviate vector search engine](https://github.com/semi-technologies/biggraph-wikidata-search-with-weaviate) | GraphQL | Search through Facebook Research's PyTorch BigGraph Wikidata-dataset with the Weaviate vector search engine |
| [Multi-Modal Text/Image search using CLIP](clip-multi-modal-text-image-search/) | Bash, Javascript, React | Use text to search through images using CLIP (multi2vec-clip). Also acts as a demo on how to use Weaviate with React |
| [Google Colab notebook: Getting started with the Python Client](getting-started-with-python-client-colab) | python (Google Colab) | Google Colab notebook to learn to get started with the Python client. Contains plenty of example code. |
| [Demo dataset News Publications with Contextionary](weaviate-contextionary-newspublications) | yaml | Docker-compose configuration file of Weaviate with a News Publications demo dataset. |
| [Demo dataset News Publications with Transformers, NER, Spellcheck and Q&A](weaviate-transformers-newspublications) | yaml | Docker-compose configuration file of Weaviate with a News Publications demo dataset. The vectorization is done by a text2vec-transformers module, and the spellcheck, Q&A and Named Entity Recognition module are connected. |
| [Weaviate simple schema](schema-wines) | Python | Easy example of a schema and how to upload it to Weaviate with the Python client |
| [Semantic search through wine dataset](semanticsearch-transformers-wines) | Python | Easy example to get started with Weaviate and semantic search with the Transformers module |
| [Unmask Superheroes in 5 steps using the Weaviate NLP module and the Python client](unmask-superheroes) | Python | Super simple 5 step guide to get started with the Weaviate NLP modules. This is a basic introduction to semantic search with Weaviate and the Python client.|
| [Information Retrieval with BERT (Weaviate without vectorizer module)](bert-information-retrieval) | Python (Jupyter Notebook) | In this example we are going to use Weaviate without vectorization module, and use it as pure vector database to use a BERT transformer to vectorize text documents, then retrieve the closest ones through Weaviate's Search | 
| [Text search with weaviate using own vectors](text-search-with-own-vectors) | Python | A basic and simple example using our own vectors(obtained using SBERT, but any other model can also be used) in weaviate|
| [Harry Potter Question Answering with Haystack & Weaviate](harrypotter-qa-haystack-weaviate) | Python (Jupyter/Colab notebook) | A demo notebook showing how to use Weaviate as DocumentStore in [Haystack](https://haystack.deepset.ai/overview/intro).
| [Vegetable classification using image2vec-neural](vegetable-classification) | Python  |An image classification example made using image2vec-neural and flask to classify vegetable images|
| [Exploring multi2vec-clip with Python and flask](exploring-multi2vec-clip-with-Python-and-flask) | Python  |This example explores the multi2vec-clip module to implement an image and text combined search functionality.|
| [Toxic Comment Classifier having GUI in Tkinter](weaviate-toxic-comment-classifier) | Python  |An example to classify comments as Toxic or Non Toxic |
| [Plant information searching in NodeJs and Javascript](plant-information-searching-using-NodeJs) | NodeJs, Javascript |A simple example to demonstrate how to use weaviate in NodeJs using Javascript APIs|
| [Web App for movie recommendation](weaviate-movie-recommendation-example) | NodeJs, Javascript |An example demonstration how to easily make a movie recommender using weaviate|
| [Generate Data profile for data stored in weaviate cluster](weaviate-data-profiling-using-pandas) | Python, NodeJs, Javascript |An example demonstration how to easily generate data profile for data in weaviate cluster using pandas library of python|
| [Example with NER module of weaviate](example-with-NER-module) | Python  |Minimal example to get started with and use [NER](https://weaviate.io/developers/weaviate/v1.11.0/reader-generator-modules/ner-transformers.html) module to extract useful data and store it|
| [Workshop Vector Databases](vector-database-workshop) | Python notebook  | Jupyter/Colab notebook to learn how to get started with Vector Search and Weaviate, given at [Open Data Science Conference (ODSC) East 2022](https://odsc.com/speakers/vector-database-workshop-using-weaviate/)|
| [Workshop Question Answering](question-answering-application-with-weaviate-workshop) | Python notebook  | Jupyter/Colab notebook to learn how to get started with Question Answering and Weaviate, given at [Knowledge Graph Conference (KGC) 2022](https://www.knowledgegraph.tech/kgc-2022-tutorial-ml-model-with-the-vector-database-weaviate/) |