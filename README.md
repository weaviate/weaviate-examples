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
